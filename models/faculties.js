import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const facultiesSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
});
const faculty = model("faculties", facultiesSchema);

export default faculty;
