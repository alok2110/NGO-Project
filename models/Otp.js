const { model, Schema } = require("mongoose");
const otpSchema = new Schema(
  {
    email: String,
    code: String,
    expireIn: Number,
  },
  { timestamps: true }
);
module.exports = model("otp", otpSchema, "otp");
