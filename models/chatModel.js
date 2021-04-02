import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

//This schema defines the way individual chat is stored in database
  const chatSchema = new Schema({
    message: String,
    messageBy:{
      type: Schema.Types.ObjectId,
      ref:"Admin"
    },
    chatRoomName:{
      type:Schema.Types.ObjectId,
      ref:"chatRoom"
    },
    messageSentAt:{
      type:Date
    }
  });
  const MessageModel = model("chats", chatSchema);

export default MessageModel;