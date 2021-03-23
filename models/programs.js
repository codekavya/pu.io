import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const programsSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
});

export default model("programs", programsSchema);
