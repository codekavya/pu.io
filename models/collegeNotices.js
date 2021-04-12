import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema: _Schema, model } = mongoose;
const Schema = _Schema;

const collegeNoticesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    college: { type: Schema.Types.ObjectId, ref: "colleges" },
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
collegeNoticesSchema.plugin(mongoosePaginate);
const collegeNotices = model("collegeNotices", collegeNoticesSchema);

export default collegeNotices;
