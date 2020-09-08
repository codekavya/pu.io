const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schoolsandcollegesSchema = new Schema();

module.exports = mongoose.model(
  "schools and colleges",
  schoolsandcollegesSchema
);
