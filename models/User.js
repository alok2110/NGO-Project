const { model, Schema } = require("mongoose");
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    village: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Number,
      default: 0,
    },
    aadharNumber: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
    },
    userType: {
      type: Number,
      default: 1,
    },
    approveStatus: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = model("user", userSchema);
