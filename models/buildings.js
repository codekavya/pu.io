import mongoose from "mongoose";
import { PLACEHOLDER_IMAGES } from "../Utils/constants.js";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const buildingsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
  },
  long: {
    type: Number,
  },
  photoUrl: {
    type: String,
    default: PLACEHOLDER_IMAGES.BUILDING_PHOTO,
  },
  googleMap: {
    type: String,
  },
  college: { type: Schema.Types.ObjectId, ref: "college" },
  classes: [{ type: Schema.Types.ObjectId, ref: "classrooms" }],
  offices: [{ type: Schema.Types.ObjectId, ref: "offices" }],
  creator: { type: Schema.Types.ObjectId, ref: "admins" },
});
const buildings = model("buildings", buildingsSchema);

export default buildings;
