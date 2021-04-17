import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";
const { isEmail } = validator;
import bcryptjs from "bcryptjs";
const { compare, hash } = bcryptjs;
import jwt from "jsonwebtoken";
const { sign } = jwt;
import Error from "../Errors/error.js";
import { PLACEHOLDER_IMAGES } from "../Utils/constants.js";

const userSchema = new Schema(
  {
    Name: {
      type: String,
      trim: true,
      required: [true, "Enter the name"],
    },
    photoUrl: {
      type: String,
      default: PLACEHOLDER_IMAGES.PROFILE_PHOTO,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    Username: {
      type: String,
      unique: true,
      required: [true, "Choose a valid username"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    },
    DOB: {
      type: Date,
      required: [true, "Enter a valid date of birth."],
      validate(value) {
        try {
          const age = Math.floor(
            (new Date() - new Date(value).getTime()) / 3.15576e10
          );
          if (age < 18) throw new Error("Age must be greater than 18");
        } catch (err) {
          console.log(err);
          throw new Error("invalid data");
        }
      },
    },
    requestCount: {
      type: Number,
      trim: true,
      required: [false],
    },
    Email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email Address is Required"],
      validate(value) {
        if (!isEmail(value)) throw new Error("Invalid Email");
      },
    },
    Password: {
      type: String,
      trim: true,
      required: [true, "Password is Needed"],
      minlength: 10,
      validate(value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
        if (!regex.test(value))
          throw new Error(
            "at least one lowercase letter, one uppercase letter, one digit, one special character, and at least eight characters long"
          );
      },
    },
    formRequested: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
      },
    ],
    roles: [
      {
        type: String,
        required: false,
      },
    ],
    followingClubs: [{ type: Schema.Types.ObjectId, ref: "clubs" }],
    managingClubs: [{ type: Schema.Types.ObjectId, ref: "clubs" }],
    classroom: { type: Schema.Types.ObjectId, ref: "classrooms" },
    api: { type: Schema.Types.ObjectId, ref: "apicounts" },
    chatRooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "chatRoom",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Generate Token FOR ADMINISTRATIVE PURPOSE
userSchema.methods.getToken = async function () {
  const user = this;
  const token = sign({ _id: user._id.toString() }, "thisisdemokey");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
userSchema.methods.generateAPIKEY = async function () {
  const user = this;
  const key = sign({ Email: user.Email }, "TECHG123");
  user.apiKey = key;
  await user.save();
  return key;
};
userSchema.methods.toJSON = function () {
  const user = this;
  const filteredObj = user.toObject();
  delete filteredObj.Password;
  delete filteredObj.tokens;
  delete filteredObj.formAccepted;
  delete filteredObj.formRequested;
  delete filteredObj.requestCount;
  return filteredObj;
};

userSchema.statics.findByProvideInfo = async (Email, password) => {
  const user = await Users.findOne({ Email });

  if (!user) {
    throw new Error("Invalid Email or Password");
  }
  const isPasswordMatched = await compare(password, user.Password);
  if (!isPasswordMatched) {
    throw new Error("Invalid Email or Password");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("Password")) {
    user.Password = await hash(user.Password, 7);
  }

  next();
});

const Users = model("admins", userSchema);

export default Users;
