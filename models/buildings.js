import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const buildingsSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
}


);
const buildings = model("buildings", buildingsSchema);

export default buildings;
