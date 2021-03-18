import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const facultiesSchema = new Schema();
const faculty = model("faculties", facultiesSchema);

export default faculty;
