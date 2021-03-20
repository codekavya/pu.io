import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";
const { isEmail } = validator;
import bcryptjs from "bcryptjs";
const { compare, hash } = bcryptjs;
import jwt from "jsonwebtoken";
const { sign } = jwt;

const userSchema = new Schema(
  {
    Name: {
      type: String,
      trim: true,
      required: [true, "Enter the name"],
    },
    Age: {
      type: Number,
      trim: true,
      required: [true, "Enter your Valid Age"],
      validate(value) {
        if (value < 18) {
          throw new Error("Age must be greater than 18");
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
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password"))
          throw new Error("Type Strong Password");
      },
    },

    apiKey: {
      type: String,
      default: "",
      unique:true
    },
    formAccepted: {
      type: Boolean,
      default: false,
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
        role: {
          required: false,
          type: String,
        },
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
  console.log("Came here No Debugger attached");
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
    throw new Error("Unable to login in");
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

const Users = model("Users", userSchema);

export default Users;
