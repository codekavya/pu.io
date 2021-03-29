import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

//This schema defines the way individual chat is stored in database
  const chatSchema = new Schema({
    message: String,
    messageBy:{
      type: Schema.Types.ObjectId,
      ref:"Users"
    },
    chatRoomName:{
      type:Schema.Types.ObjectId,
      ref:"chatRoom"
    }
  });
  const MessageModel = model("chats", chatSchema);

export default MessageModel;