import mongoose from "mongoose";
import { PLACEHOLDER_IMAGES } from "../Utils/constants";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

//This schema defines the way individual chat is stored in database
const chatSchema = new Schema(
  {
    Name: {
      type: String,
      unique: true["The Room Name Already Exists"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "admins",
    },
    chatroomPhoto: {
      type: String,
      default: PLACEHOLDER_IMAGES.CHATROOM_PHOTO,
    },
    RoomMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "admins",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "chats",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const chatModel = model("chatRoom", chatSchema);

export default chatModel;
