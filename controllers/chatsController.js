import {
  io
} from "../app.js";
import path from "path";
import MessageModel from "../models/chatModel.js"
import chatRoomModel from "../models/chatRoomModel.js"


//room is created once and stored in database
export async function createRoom(req, res, next) {
  try{
  //Get the room name when user is prompted to enter the group name;
  const roomName = req.body.roomName;
  const roomMembers = req.body.roomMembers;
  const user = req.user;

    //From Room Schema Add new Room Name to database
     const newChatRoom =  new chatRoomModel({
      Name:roomName,
      createdBy:req.user._id
      })
    await newChatRoom.save();

    user.chatRooms.push(newChatRoom._id);
    newChatRoom.RoomMembers.push(user._id,req.body.roomMembers)
    await user.save();
    res.redirect(`/rooms/${newChatRoom._id}`);
  }catch(Error){
    res.send({
      Error:Error
    })
  }
}



export async function sendMessage(req, res, next) {
  console.log(req.params.id)
  const chatRoom = await chatRoomModel.findById({_id:req.params.id});
  const chatRoomName = chatRoom.Name
  io.once("connection", (socket) => {

    console.log("a connection created");
    //check if the group has message previously 
   if(chatRoom.messages){
     //populate before sending 
    console.log(chatRoom.populate("messages").populated("messages"));
      // io.emit("message",chatRoomModel.messages.populate("chats"))
   }
    socket.broadcast.emit('message',`${req.user.Name} has joined the group`)
    //when user clicks send button create a new message and
    //Store that in database
    socket.on("message", async (msg) => {
      const message = new MessageModel({
        message: msg,
        messageBy: req.user._id,
        chatRoomName:chatRoom._id
      })
      await message.save();
      chatRoom.messages.push(message._id);
      await chatRoom.save();
      io.emit("message",msg);
    })



    socket.on('disconnect',()=>{
      //set status to offline a boolean value
      io.emit('message',`${req.user.Name} has left the group`)
    })
  });
  
}