import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const clubsSchema = new Schema();
const clubs = model("clubs", clubsSchema);

export default clubs;
