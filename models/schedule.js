import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const scheduleSchema = new Schema();
const schedule = model("schedules", scheduleSchema);

export default schedule;
