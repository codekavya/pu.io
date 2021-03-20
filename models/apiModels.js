import mongoose from "mongoose";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const apiCountsSchema = new Schema({
  ApiKey: {
    type: String,
    trim: true,
    required: [true],
    unique: true,
  },
  TotalHits: {
    type: Number,
    default: 0,
  },
  TodayHits: {
    type: Number,
    default: 0,
  },
  DailyLimit: {
    type: Number,
    default: 100,
  },
  userName:{
    type:String,
    required:true
  },
  userID:{
    type:String,
    required:true
    
  }
});

const apiCounts = model("apiCounts", apiCountsSchema);

export default apiCounts;
