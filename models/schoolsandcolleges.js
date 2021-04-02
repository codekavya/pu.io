import mongoose from "mongoose";
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
  contacts: [{ type: Schema.Types.ObjectId, ref: "contacts" }],
  faculties: [{ type: Schema.Types.ObjectId, ref: "clubs" }],
  buildings: [{ type: Schema.Types.ObjectId, ref: "buildings" }],
  classes: [{ type: Schema.Types.ObjectId, ref: "classrooms" }],
  programs: [{ type: Schema.Types.ObjectId, ref: "programs" }],
});

export default model("colleges", schoolsandcollegesSchema);
