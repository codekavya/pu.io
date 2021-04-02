import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const syllabusSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  syllabus: Object,
  program: { type: Schema.Types.ObjectId, ref: "classes" },
  creator: { type: Schema.Types.ObjectId, ref: "admins" },
});
const syllabus = model("syllabuses", syllabusSchema);

export default syllabus;
