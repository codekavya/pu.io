import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const classroomNoticesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  classroomId: {
    type: String,
    required: true,
  },
});
const classroomNotices = model("classroomNotices", classroomNoticesSchema);

export default classroomNotices;
