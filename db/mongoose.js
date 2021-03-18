import mongoose from "mongoose";
const { connect } = mongoose;
import config from "../config.js";
const { mongoDbKey } = config;

connect(mongoDbKey, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).catch((e) => {
  console.log("Network Problem");
});
