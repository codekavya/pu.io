import Users from "../models/adminModels.js";
import Forms from "../models/form.js";

import api_Key_Generator from "../auth/generateKey.js";

export async function postUserSignUp(req, res) {
  console.log(req.body);
  const user = new Users(req.body);
  await user.save();

  try {
    await user.save();
    res.send({ Account: user });
  } catch (E) {
    res.send(E);
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
      "Content-Type": "text/html",
      "Set-Cookie": `SKey = Bearer ${token}`,
    });
    res.json({ user, token });
  } catch (error) {
    res.status(401).send({ Error: "Error Logging", error });
  }
}

//Needed to be tested
export async function getAPIKEY(req, res) {
  const user = await User.findOne({});
  if (user.apiKey != null) {
    return res
      .status(404)
      .send("No Key Found Try Sendig A Form or Wait for Response");
  }
  return res.send({ "Api Key": user.apiKey, userProfile: user });
}

/*This endpoint is responsible for posting the form and checking if
the user has requested for the API Key 
*/

export async function apiHandler(req, res, next) {
  if (req.user.apiKey) {
    res.status(200).send(req.user);
  } else if (req) {
  } else {
    res.redirect("/rkey");
  }
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
    res.status(500);
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
