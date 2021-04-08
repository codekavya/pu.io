import Users from "../models/adminModels.js";
import Forms from "../models/form.js";
import apiCounts from "../models/apiModels.js";
import error from "../Errors/error.js";

import api_Key_Generator from "../auth/apiFormHandler.js";
import MyError from "../Errors/error.js";

export async function postUserSignUp(req, res) {
  const user = new Users(req.body);
  try {
    await user.save();
    return res.send({ Account: user });
  } catch (E) {
    console.log(E);
    if (E.name === "MongoError" && E.code === 11000)
      return res.status(409).send({ Error: "Duplicate error", E });
    return res.status(400).send({ Error: E });
  }
}
export async function postLogoutAllSession(req, res, next) {
  try {
    req.user.tokens = [];
    await req.user.save();
  } catch (error) {
    res.status(500).send(error);
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
      .populate({ path: "classroom", select: ["shortCode"] })
      .execPopulate();
    res.json({ user: userData, token });
  } catch (error) {
    console.log(error);
    res.status(401).send({ Error: "Error Logging", error });
  }
}

export async function getApiKeyOrForm(req, res, next) {
  const user = req.user;
  const key = await apiCounts.findOne({ user: user._id });
  const form = await Forms.findOne({ user: user._id });
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
      res.status(404).send("No user Found");
      res.send(usertoDelete);
    }
  } catch (error) {
    res.status(500).send({ Error: E });
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
    res.status(201).send();
  } catch (e) {
    res.status(404).send(e);
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
    res.status.send(500);
  }
}
