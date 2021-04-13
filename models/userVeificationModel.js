import mongoose from "mongoose";
const {
    Schema: _Schema,
    model
} = mongoose;
const Schema = _Schema;

const EmailVerificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "admins",
    },
    token: {
        type: String,
        required: true,
    },
    sendAt: {
        type: Date,
        default: Date.now
    }
});
const EmailVerificationModel = model("MailVerificationModel", EmailVerificationSchema);

export default EmailVerificationModel;