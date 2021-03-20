import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const contactsSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
});
const contact = model("contacts", contactsSchema);

export default contact;
