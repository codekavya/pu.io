import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { PLACEHOLDER_IMAGES } from "../Utils/constants.js";

const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    contactPhoto: {
      type: String,
      default: PLACEHOLDER_IMAGES.CONTACT_PHOTO,
    },
    email: [
      {
        type: String,
        required: false,
      },
    ],
    number: [
      {
        type: String,
        required: false,
      },
    ],
    type: {
      type: String,
      enum: ["office", "teacher", "staff", "CR"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "admins",
    },
    college: {
      type: Schema.Types.ObjectId,
      ref: "colleges",
    },
  },
  {
    timestamps: true,
  }
);
contactsSchema.plugin(mongoosePaginate);
const contact = model("contacts", contactsSchema);

export default contact;
