import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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
    attachment: {
      type: String,
    },
    club: { type: Schema.Types.ObjectId, ref: "clubs" },
    type: {
      type: String,
      required: true,
      enum: ["competition", "workshop", "meetup", "other"],
    },
    classes: [{ type: Schema.Types.ObjectId, ref: "classes" }],
    date: {
      starts: Date,
      ends: Date,
    },
  },
  {
    timestamps: true,
  }
);
eventsSchema.plugin(mongoosePaginate);
const event = model("events", eventsSchema);

export default event;
