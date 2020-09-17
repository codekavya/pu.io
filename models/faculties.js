const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facultiesSchema = new Schema();
const faculty = mongoose.model("faculties", facultiesSchema);

module.exports =faculty
