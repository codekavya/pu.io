import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const classroomsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
  },
  program: { type: Schema.Types.ObjectId, ref: "programs" },
  college: { type: Schema.Types.ObjectId, ref: "colleges" },
  schedule: { type: Schema.Types.ObjectId, ref: "schedules" },
  users: [{ type: Schema.Types.ObjectId, ref: "admins" }],
  notices: [{ type: Schema.Types.ObjectId, ref: "classroomNotices" }],
});

const classrooms = model("classrooms", classroomsSchema);

export default classrooms;
