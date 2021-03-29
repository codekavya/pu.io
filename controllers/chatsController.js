import {
  io
} from "../app.js";
import path from "path";
import MessageModel from "../models/chatModel.js"
import chatRoomModel from "../models/chatRoomModel.js"


//room is created once and stored in database
export async function createRoom(req, res, next) {
  //Get the room name when user is prompted to enter the group name;
  const roomName = req.roomName;
    //Create room and create a collection in database
    newChat = new chatRoomModel({
      name:roomName,
      createdBy: req.user._id
    })
    await newChat.save();
}



export async function sendMessage(req, res, next) {
  io.once("connection", (socket) => {
    console.log("a connection created");
    socket.broadcast.emit('message',`${req.user.name} has joined the group`)
    //when user clicks send button create a new message and
    //Store that in database
    socket.on("send-message", async (msg) => {
      const chat = new MessageModel({
        message: msg,
        messageBy: req.user._id,
        chatRoomName: data.roomName
      })
      await chat.save();
      io.emmit("message",msg);
    })

    socket.on('disconnect',()=>{
      io.emit('message',`${req.user.name} has left the group`)
    })
  });
  
}