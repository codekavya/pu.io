import jsonwebtoken from "jsonwebtoken";
const { verify, decode } = jsonwebtoken;
import adminModels from "../models/adminModels.js";
import apiCounts from "../models/apiModels.js";
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
        res.status(404).send({ Error: "Server Error" });
      }
      const api = await apiCounts.findOne({ Apikey: user.apikey });
      if (api.TodayHits >= api.DailyLimit) {
        res
          .status(429)
          .send({ Error: "You have reached your daily API usage limit" });
      } else {
        api.TodayHits = api.TodayHits + 1;
        api.TotalHits = api.TotalHits + 1;
        await api.save();
        req.count = api.TodayHits;
        req.api = value;
        req.user = user;
        next();
      }
    } catch (e) {
      res.send({ Error: "Unable to Authorize" });
    }
  }
};

export default auth;
