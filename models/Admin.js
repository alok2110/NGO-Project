const { model, Schema } = require("mongoose");
const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: Number,
      default: 2,
    },
    coins: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = model("admin", adminSchema);
