import Users from "../models/adminModels.js";
import Forms from "../models/form.js";
import apiCounts from "../models/apiModels.js";
import User from "../models/adminModels.js";
import PwdResetModel from "../models/passwordResetModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendmail } from "../Services/mailer.js";
import { passwordResetMailHTML } from "../Utils/mailconstructor.js";
import path from "path";
import config from "../config.js";
const { email } = config;
import api_Key_Generator from "../auth/apiFormHandler.js";

export async function postUserSignUp(req, res) {
  const user = new Users(req.body);
  try {
    await user.save();
    return res.send({
      Account: user,
    });
  } catch (E) {
    console.log(E);
    if (E.name === "MongoError" && E.code === 11000)
      return res.status(409).send({
        Error: "Duplicate error",
        E,
      });
    return res.status(400).send({
      Error: E,
    });
  }
}
export async function postLogoutAllSession(req, res, next) {
  try {
    req.user.tokens = [];
    await req.user.save();
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function postUserSignIn(req, res) {
  try {
    const user = await Users.findByProvideInfo(
      req.body.Email,
      req.body.Password
    );
    const token = await user.getToken();
    res.set({
      "Content-Type": "application/json",
      "Set-Cookie": `SKey = Bearer ${token}`,
    });
    const userData = await user
      .populate({
        path: "classroom",
        select: ["shortCode"],
      })
      .execPopulate();
    res.json({
      user: userData,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      Error: "Error Logging",
      error,
    });
  }
}

export async function getApiKeyOrForm(req, res, next) {
  const user = req.user;
  const key = await apiCounts.findOne({
    user: user._id,
  });
  const form = await Forms.findOne({
    user: user._id,
  });
  if (!key && !form) {
    //Send the Form to Database
    return res.send(
      '<form action="/key" method="POST">Name:<input type="text" name="Name"><br>Password:<input type="password" name="Password"><br>Email:<input type="Email" name="Email"><br>Faculty:<input type="text" name="Faculty"><br>College:<input type="text" name="College"><br>Purpose:<textarea name="Purpose"></textarea><br><button type="submit">Send</button></form>'
    );
  } else if (!key && form && !form.accepted) {
    return res.status(208).send({
      msg: "Your Form is Under Validation",
    });
  }

  if (!key && form.accepted) {
    const generated_key = await user.generateAPIKEY();
    const api = new apiCounts({
      ApiKey: generated_key,
      user: user,
    });
    await api.save();
    return res.send({
      apiKey: generated_key,
    });
  }
  if (key && form.accepted) {
    return res.status(200).send({
      apiKey: key.ApiKey,
    });
  }
  next();
}

export async function postreqForm(req, res, next) {
  api_Key_Generator(req, res, next);
}

export async function deleteUser(req, res, next) {
  try {
    const usertoDelete = await Users.findByIdAndDelete(req.params.id);
    if (!usertoDelete) {
      return res.status(404).send("No user Found");
      res.send(usertoDelete);
    }
  } catch (error) {
    return res.status(500).send({
      Error: E,
    });
  }
}

export async function updateUser(req, res, next) {
  const isallowed = ["Name", "Password"];
  const entity = Object.keys(req.body);
  const isValid = entity.every((data) => isallowed.includes(data));
  if (!isValid) return res.status(401).send("Invalid Operation");

  try {
    entity.forEach((entry) => {
      req.user[entry] = req.body[entry];
    });
    await req.user.save();
    return res.status(201).send(req.user);
  } catch (e) {
    return res.status(404).send({
      Error: e,
    });
  }
}
export async function postLogoutUsers(req, res, next) {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    return res.status.send(500);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const user = await Users.findOne({
      Email: req.body.email,
    });
    console.log(user);

    if (!user) {
      throw new Error("User doesnot exists");
    }

    let token = await PwdResetModel.findOne({
      userId: user._id,
    });
    if (token) await token.deleteOne();

    const resetToken = await generateToken(user);
    const linkToMail = await generateLink(
      "http://localhost:4000",
      resetToken,
      user
    );
    await sendmail({
      from: '"Code Kavya👻" <noreply@codekavya.com>',
      to: req.body.email,
      subject: "Verify your email at PU.io",
      text: "test",
      html: passwordResetMailHTML(user.Name, linkToMail.toString()),
    });

    res.send("Email Send Sucessfullly");
  } catch (E) {
    res.send({
      error: E.message,
    });
  }
}
const generateToken = async (user) => {
  //Generate New Token id;
  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, 7);
  const property = {
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  };
  const pwdResetDocument = await new PwdResetModel({ ...property }).save();

  const token = jwt.sign(property, "Thisisthemonkey");
  return token;
};

const generateLink = async (clientURL, resetToken, user) => {
  const link = `${clientURL}/passwordReset/${resetToken}`;
  return link;
};

export default async function resetPasswordHandler(req, res, next) {
  //jwt payload need to be decrypted
  const reqBodyPayLoad = req.params.id;
  try {
    const decodedPwdResetDoc = jwt.decode(reqBodyPayLoad, "Thisisthemonkey");
    const passwordResetDoc = await PwdResetModel.findOne({
      userId: decodedPwdResetDoc.userId,
    });

    if (!passwordResetDoc) {
      throw new Error("Invalid or Link Expired ok");
    }
    const isValid =
      decodedPwdResetDoc.token.toString() === passwordResetDoc.token.toString();
    if (!isValid) {
      throw new Error("Invalid or Link Expired ok");
    }
    if (req.method == "GET") {
      return res.sendFile(
        path.join(process.cwd(), "public", "views", "reset.html")
      );
    }
    const password1 = req.body.password1;
    const password2 = req.body.password2;
    if (password1 !== password2) throw new Error("Password Doesnot Match");
    const hash = await bcrypt.hash(password1, Number(8));
    const user = await User.findByIdAndUpdate(decodedPwdResetDoc.userId, {
      Password: hash,
    });
    await PwdResetModel.findByIdAndDelete(passwordResetDoc._id);
    res.send({ status: "Password Change Sucessfull" });
    //send mail
  } catch (E) {
    res.status(401).send({ Error: E.message });
  }
}
