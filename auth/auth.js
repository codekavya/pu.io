import jsonwebtoken from "jsonwebtoken";
const { verify, decode } = jsonwebtoken;
import adminModels from "../models/adminModels.js";
// const { findOne } = adminModels;

//import { spliter } from "../Utils/__cookies__extracter.js";
const auth = async (req, res, next) => {
  try {
    const token = req.header("Cookie").replace("SKey=Bearer ", "");
    console.log(token);
    const payload = verify(token, "thisisdemokey");
    console.log(payload);
    const user = await adminModels.findOne({
      _id: payload._id,
      "tokens.token": token,
    });
    console.log(user);
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
    console.log("Hello");
  } catch (e) {
    try {
      const value = req.header("x-api-key");
      const key = decode(value, "TECHG123");
      const user = await adminModels.findOne({ Email: key.Email });
      if (!user) {
        res.status(404).send("Server Error");
      }
      req.api = key;
      req.user = user;
      next();
    } catch (e) {
      res.send({ Error: "Unable to Authorize" });
    }
  }
};

export default auth;
