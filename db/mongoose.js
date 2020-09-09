const mongoose = require('mongoose');
const {
  mongoDbKey
} = require("../config.json")


  mongoose.connect(mongoDbKey, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).catch(e=>{
  console.log("Network Problem")
});