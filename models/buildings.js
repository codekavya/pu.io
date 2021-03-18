import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const buildingsSchema = new Schema();
const buildings = model("buildings", buildingsSchema);

export default buildings;
