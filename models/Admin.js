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
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: Number,
      default: 2,
    },
  },
  { timestamps: true }
);
module.exports = model("admin", adminSchema);
