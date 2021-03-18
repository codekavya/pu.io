import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const contactsSchema = new Schema();
const contact = model("contacts", contactsSchema);

export default contact;
