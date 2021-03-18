import { decode } from "jsonwebtoken";
import Users from "../models/adminModels.js";
const validAPI = async (req, res, next) => {
  try {
    const value = req.header("Cookie");
    const key = decode(value, "TECHG123");
    const user = await Users.findOne({ Email: key.Email });
    if (!user) {
      res.status(404).send("Server Error");
    }
    req.api = key;
    req.user = user;
    next();
  } catch (e) {
    res.status(500).send("Server Error");
  }
};

export default validAPI;
