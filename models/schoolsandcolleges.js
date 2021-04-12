import mongoose from "mongoose";
import { PLACEHOLDER_IMAGES } from "../Utils/constants.js";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const schoolsandcollegesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["constituent", "affiliated", "joint"],
  },
  introduction: {
    type: String,
  },
  location: {
    name: { type: String },
    cooordinates: [{ type: Number }],
  },
  website: {
    type: String,
  },
  photoUrl: { type: String, default: PLACEHOLDER_IMAGES.COLLEGE_PHOTO },
  contacts: [{ type: Schema.Types.ObjectId, ref: "contacts" }],
  faculties: [{ type: Schema.Types.ObjectId, ref: "clubs" }],
  buildings: [{ type: Schema.Types.ObjectId, ref: "buildings" }],
  classes: [{ type: Schema.Types.ObjectId, ref: "classrooms" }],
  programs: [{ type: Schema.Types.ObjectId, ref: "programs" }],
  notices: [{ type: Schema.Types.ObjectId, ref: "collegeNotices" }],
});

export default model("colleges", schoolsandcollegesSchema);
