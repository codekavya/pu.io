import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const classroomNoticesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    classroom: { type: Schema.Types.ObjectId, ref: "classrooms" },
    creator: { type: Schema.Types.ObjectId, ref: "admins" },
    validTill: Date,
    attachments: [String],
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
classroomNoticesSchema.plugin(mongoosePaginate);
const classroomNotices = model("classroomNotices", classroomNoticesSchema);

export default classroomNotices;
