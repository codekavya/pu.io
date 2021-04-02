import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const scheduleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  schedule: { type: Object },
  classroom: { type: Schema.Types.ObjectId, ref: "classrooms" },
  creator: { type: Schema.Types.ObjectId, ref: "admins" },
});
const schedule = model("schedules", scheduleSchema);

export default schedule;
