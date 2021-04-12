import mongoose from "mongoose";
import { PLACEHOLDER_IMAGES } from "../Utils/constants";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const clubsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  clubLogo: {
    type: String,
    default: PLACEHOLDER_IMAGES.CLUB_LOGO,
  },
  committee: [
    {
      position: String,
      member: { type: Schema.Types.ObjectId, ref: "admins" },
      canPostEvent: Boolean,
    },
  ],
  colleges: [{ type: Schema.Types.ObjectId, ref: "colleges" }],
  events: [{ type: Schema.Types.ObjectId, ref: "Events" }],
});
const clubs = model("clubs", clubsSchema);

export default clubs;
