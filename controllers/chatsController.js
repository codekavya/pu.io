import { io } from "../app.js";
import * as Utils from "../public/trackUsers.js";
import MessageModel from "../models/chatModel.js";
import chatRoomModel from "../models/chatRoomModel.js";
import chatModels from "../models/chatModel.js"
import Users from "../models/adminModels.js";

//room is created once and stored in database
export async function createRoom(req, res, next) {
    try {
        //Get the room name, roomMember's Array,logged in User;
        const roomName = req.body.roomName;
        const roomMembers = req.body.RoomMembers;
        const loggedinUser = req.user;

        //From Room Schema Add new Room Name to database
        const newChatRoom = new chatRoomModel({
            Name: roomName,
            createdBy: req.user._id,
        });
        newChatRoom.RoomMembers.push(loggedinUser, ...roomMembers);
        await newChatRoom.save();

        //from array of room members, push each member's chatRoom array to database
        roomMembers.map(async(memberid, index) => {
            let user = await Users.findById(memberid);
            user.chatRooms.push(newChatRoom._id);
            await user.save();
        });

        loggedinUser.chatRooms.push(newChatRoom._id);
        await loggedinUser.save();

        res.redirect(`/room/${newChatRoom._id.toString()}`);
    } catch (Error) {
        res.send({
            Error: Error,
        });
    }
}

export async function sendMessage(req, res, next) {
    const chatRoom = req.chatRoom;
    const loggedinUser = req.user;

    io.on("connection", (socket) => {
        socket.on("room", async(roomid) => {
            const members = await chatRoom.populate({
                path: "RoomMembers",
                select: ["Name", "isActive"]
            }).execPopulate()



            const users = Utils.storeUsers({
                id: loggedinUser._id.toString(),
                username: loggedinUser.Name,
                room: roomid,
            });
            socket.join(roomid);

            if (!loggedinUser.isActive) {
                loggedinUser.isActive = true;
                await loggedinUser.save()
            }
            console.log(members.RoomMembers)
            io.to(roomid).emit("userDetails", members.RoomMembers);
            const query = { chatRoomName: req.chatRoom._id };
            const paginateOptions = {
                page: 1,
                limit: 100,
                populate: {
                    path: "messageBy",
                    select: "Name"
                },
                customLabels: {
                    docs: "chats",
                },
            };
            req.query.page && (paginateOptions.page = req.query.page);
            req.query.limit && (paginateOptions.limit = req.query.limit);
            //populate before sending
            const chatRoomMessages = await chatModels.paginate(query, paginateOptions)
            socket.emit("database-messages", chatRoomMessages.chats);
            socket.broadcast
                .to(users.user.room)
                .emit("message", `${req.user.Name} has joined the group`);

        });


        //get all message from clients and save to database and return to specific rooms
        socket.on("message", async(msg) => {
            const currentUser = Utils.findBy(loggedinUser._id.toString());
            console.log("Came here", currentUser)
            const messageSendAt = new Date();
            const message = msg
            let messagetoDB = {
                message,
                messageBy: req.user._id,
                chatRoomName: chatRoom._id,
                messageSendAt
            }
            let messagetoClient = {
                message,
                messageBy: currentUser.username,
                messageSendAt
            }
            const newMessage = new MessageModel(messagetoDB);
            await newMessage.save();

            //send the message to specific room
            io.to(currentUser.room).emit("messageObj", messagetoClient);

        });

        socket.on("disconnect", async() => {
            const removedUser = Utils.removeUser(loggedinUser.toString());
            if (removedUser) {
                console.log(removedUser.room);

                //Change the status to offline
                loggedinUser.isActive = false;
                await loggedinUser.save()

                //socket emit object of  users and there status
                const members = await chatRoom.populate({
                    path: "RoomMembers",
                    select: ["Name", "isActive"]
                }).execPopulate()
                io.broadcast.to(removedUser.room).emit("userDetails", members.RoomMembers);


            }
        });
    });
}


export async function getLastIndexMessage(req, res, next) {
    try {
        const populatedChatRoom = await chatRooms.find({ chatRoomName: req.chatRoom._id })
            .populate({
                path: "messages",
                populate: {
                    path: "messageBy",
                    select: "Name",
                },
            }).sort({ _id: -1 }).limit(1)
        return res.send(populatedChatRoom.messages[0])

    } catch (error) {
        return res.status(400).send({
            Error: error.message
        })

    }

}