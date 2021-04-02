import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";

const userSchema = new Schema(
  {
    Name: {
      type: String,
      trim: true,
      required: [true, "Enter the name"],
    },
    Email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Enter your Valid Age"],
      validate(value) {
        // if(!validator.isEmail(value)){
        //     throw new Error('Email Required')
        // }
      },
    },
    Purpose: {
      type: String,
      trim: true,
      required: [true, "Email Address is Required"],
    },
    accepted: {
      type: Boolean,
      default: false,
    },
    user: { type: Schema.Types.ObjectId, ref: "admins" },
  },
  { timestamps: true }
);

const Forms = model("forms", userSchema);

export default Forms;
