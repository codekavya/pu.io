const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const programsSchema = new Schema();

module.exports = mongoose.model("programs", programsSchema);
