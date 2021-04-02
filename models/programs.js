import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const programsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  shortname: {
    type: String,
  },
  description: {
    type: String,
  },
  faculty: { type: Schema.Types.ObjectId, ref: "faculties" },
  syllabus: [{ type: Schema.Types.ObjectId, ref: "syallbuses" }],
  colleges: [{ type: Schema.Types.ObjectId, ref: "colleges" }],
});

export default model("programs", programsSchema);
