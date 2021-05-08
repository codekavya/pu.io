import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2"
const Schema = _Schema;

//This schema defines the way individual chat is stored in database
const chatSchema = new Schema({
    message: String,
    messageBy: {
        type: Schema.Types.ObjectId,
        ref: "admins",
    },
    chatRoomName: {
        type: Schema.Types.ObjectId,
        ref: "chatRoom",
    },
    messageSentAt: {
        type: Date,
    },
});
chatSchema.plugin(mongoosePaginate)
const MessageModel = model("chats", chatSchema);

export default MessageModel;