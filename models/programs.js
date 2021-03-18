import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const programsSchema = new Schema();

export default model("programs", programsSchema);
