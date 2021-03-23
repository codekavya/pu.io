import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const contactsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: [
    {
      type: String,
      required: false,
    },
  ],
  number: [
    {
      type: Number,
      required: false,
    },
  ],
  college: {
    type: String,
    required: false,
  },
});
const contact = model("contacts", contactsSchema);

export default contact;
