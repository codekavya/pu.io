import jsonwebtoken from "jsonwebtoken";
const { verify, decode } = jsonwebtoken;
import adminModels from "../models/adminModels.js";
import apiCounts from "../models/apiModels.js";
import { AUTH_TYPE } from "../Utils/constants.js";

const auth = (type = "") => async (req, res, next) => {
  try {
    // if (!req.header("Authorization")) throw new Error("No Auth Header");
    const token = req.header("Authorization").replace("SKey=Bearer ", "");
    const payload = verify(token, "thisisdemokey");
    const user = await adminModels.findOne({
      _id: payload._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    if (!user.isEmailVerified) {
      throw new Error("Verify your Email first....");
    }
    
    req.token = token;
    req.user = user;
    return next();
  } catch (e) {
    console.log(e);
    try {
      if (type !== AUTH_TYPE.TOKEN) {
        if (!req.header("x-api-key")) throw new Error();
        const value = req.header("x-api-key");
        console.log(value);
        const api = await apiCounts.findOne({ ApiKey: value });
        console.log(api);
        if (!api) {
          return res.status(404).send({ Error: "Invalid api key" });
        }
        const user = await adminModels.findById(api.user._id);
        console.log(user);
        if (api.TodayHits >= api.DailyLimit) {
          return res
            .status(429)
            .send({ Error: "You have reached your daily API usage limit" });
        } else {
          api.TodayHits = api.TodayHits + 1;
          api.TotalHits = api.TotalHits + 1;
          await api.save();
          req.count = api.TodayHits;
          req.api = value;
          req.user = user;
          return next();
        }
      } else if (type === AUTH_TYPE.TOKEN && req.header("x-api-key")) {
        return res.send({
          Error: "This route cannot be accessed with api key",
        });
      } else {
        throw new Error();
      }
    } catch (e) {
      console.log(e);
      return res.send({ Error: "Unable to Authorize" });
    }
  }
};

export default auth;
