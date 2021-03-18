import pkg from "jsonwebtoken";
const { verify } = pkg;
import adminModels from "../models/adminModels.js";
const { findOne } = adminModels;
//import { spliter } from "../Utils/__cookies__extracter.js";
const auth = async (req, res, next) => {
  try {
    const token = req.header("Cookie").replace("SKey=Bearer ", "");
    console.log(token);
    const payload = verify(token, "thisisdemokey");
    const user = await findOne({ _id: payload._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.send({ Error: "Unable to Authorize" });
  }
};

export default auth;
