import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const classroomsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    required: false,
  },
  building: {
    type: String,
    required: false,
  },
});

const classrooms = model("classrooms", classroomsSchema);

export default classrooms;
