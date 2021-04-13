import { io } from "../app.js";
import * as Utils from "../public/trackUsers.js";
import MessageModel from "../models/chatModel.js";
import chatRoomModel from "../models/chatRoomModel.js";
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
    roomMembers.map(async (memberid, index) => {
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
  const messagefromDB = chatRoom.messages;
  const loggedinUser = req.user;

  io.once("connection", (socket) => {
    socket.on("room", async (roomid) => {
      const users = Utils.storeUsers({
        id: loggedinUser._id.toString(),
        username: loggedinUser.Name,
        room: roomid,
      });
      socket.join(roomid);
      if (messagefromDB.length > 0) {
        //populate before sending
        const populatedChatRoom = await chatRoom
          .populate({
            path: "messages",
            populate: {
              path: "messageBy",
              select: "Name",
            },
          })
          .execPopulate();


          //Array of populated message should be decrypted..

        socket.emit("database-messages", populatedChatRoom.messages);
      }
      //TODO:set activeStatus
      socket.broadcast
        .to(users.user.room)
        .emit("message", `${req.user.Name} has joined the group`);
    });

    //get all message from clients and save to database and return to specific rooms
    socket.on("message", async (msg) => {
      const currentUser = Utils.findBy(loggedinUser._id.toString());
      const messageSendAt = new Date();
      const message = msg
      let messagetoDB ={
          message,
          messageBy: req.user._id,
          chatRoomName: chatRoom._id,
          messageSendAt
      }
      let messagetoClient ={
        message,
        messageBy: currentUser.username,
        messageSendAt
      } 
      const newMessage = new MessageModel(messagetoDB);
      await newMessage.save();
      chatRoom.messages.push(newMessage._id);
      await chatRoom.save();


      //send the message to specific room
      io.to(currentUser.room).emit("messageObj", messagetoClient);
    });

    socket.on("disconnect", () => {
      const removedUser = Utils.removeUser(loggedinUser.toString());
      if (removedUser) {
        console.log(removedUser.room);
        //remove users from the array set status to offline a boolean value
        socket.broadcast
          .to(removedUser.room)
          .emit("message", `${removedUser.username} has left the group`);
      }
    });
  });
}
