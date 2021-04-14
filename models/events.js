import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { PLACEHOLDER_IMAGES } from "../Utils/constants.js";

const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const eventsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    banner: { type: String, default: PLACEHOLDER_IMAGES.EVENT_BANNER },
    attachments: [
      {
        type: String,
      },
    ],
    organizers: [String],
    venue: ["String"],
    Ticket: String,
    club: { type: Schema.Types.ObjectId, ref: "clubs" },
    type: {
      type: String,
      required: true,
      enum: ["competition", "workshop", "meetup", "other"],
    },
    scope: {
      isOpen: Boolean,
      colleges: [{ type: Schema.Types.ObjectId, ref: "colleges" }],
      classes: [{ type: Schema.Types.ObjectId, ref: "classes" }],
    },
    date: {
      starts: Date,
      ends: Date,
    },
    contact: String,
  },
  {
    timestamps: true,
  }
);
eventsSchema.plugin(mongoosePaginate);
const event = model("events", eventsSchema);

export default event;
