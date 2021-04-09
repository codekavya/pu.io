import jsonwebtoken from "jsonwebtoken";
const { verify, decode } = jsonwebtoken;
import adminModels from "../models/adminModels.js";
import apiCounts from "../models/apiModels.js";
import { AUTH_TYPE } from "../Utils/constants.js";

const auth = (type = "") => async (req, res, next) => {
  try {
    const token = req.header("Cookie").replace("SKey=Bearer ", "");
    const payload = verify(token, "thisisdemokey");
    const user = await adminModels.findOne({
      _id: payload._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    return next();
  } catch (e) {
    console.log(e);
    try {
      if (type !== AUTH_TYPE.TOKEN) {
        const value = req.header("x-api-key");
        const key = decode(value, "TECHG123");
        const user = await adminModels.findOne({ Email: key.Email });
        if (!user) {
          return res.status(404).send({ Error: "Server Error" });
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
          return next();
        }
      } else if (type === AUTH_TYPE.TOKEN) {
        return res.send({
          Error: "This route cannot be accessed with api key",
        });
      }
    } catch (e) {
      console.log(e);
      res.send({ Error: "Unable to Authorize" });
    }
  }
};

export default auth;
