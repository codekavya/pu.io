const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facultiesSchema = new Schema();

module.exports = mongoose.model("faculties", facultiesSchema);
