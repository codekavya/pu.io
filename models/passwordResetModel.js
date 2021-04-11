import mongoose from "mongoose";
const {
    Schema: _Schema,
    model
} = mongoose;
const Schema = _Schema;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "admins",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // this is the expiry time in ms
    },

});
const PwdResetModel = model("tokens", tokenSchema);

export default PwdResetModel;