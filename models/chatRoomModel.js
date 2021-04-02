import mongoose from "mongoose";
const {
  Schema: _Schema,
  model
} = mongoose;
const Schema = _Schema;

//This schema defines the way individual chat is stored in database
const chatSchema = new Schema({
  Name: {
    type: String,
    unique: true["The Room Name Already Exists"]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref:"Admin"
  },
  RoomMembers: [{
    type: Schema.Types.ObjectId,
    ref: "Admin"
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    "ref": "chats"
  }]
}, {
  timestamps: true,
});
const chatModel = model("chatRoom", chatSchema);

export default chatModel;