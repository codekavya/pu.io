import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const schoolsandcollegesSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
});

export default model("schools and colleges", schoolsandcollegesSchema);
