import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const facultiesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
  },
  dean: {
    type: String,
  },
  deanPhoto: {
    type: String,
  },
  programs: [{ type: Schema.Types.ObjectId, ref: "programs" }],
  colleges: [{ type: Schema.Types.ObjectId, ref: "colleges" }],
});
const faculty = model("faculties", facultiesSchema);

export default faculty;
