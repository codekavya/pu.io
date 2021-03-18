import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const schoolsandcollegesSchema = new Schema();

export default model("schools and colleges", schoolsandcollegesSchema);
