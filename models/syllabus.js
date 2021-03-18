import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const syllabusSchema = new Schema();
const syllabus = model("syllabus", syllabusSchema);

export default syllabus;
