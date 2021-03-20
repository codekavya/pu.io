import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const syllabusSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
});
const syllabus = model("syllabuses", syllabusSchema);

export default syllabus;
