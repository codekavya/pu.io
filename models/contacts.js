import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const contactSchema = new Schema();
const contact = model("contact", contactSchema);

export default contact;
