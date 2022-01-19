const { model, Schema } = require("mongoose");
const superAdminSchema = new Schema(
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
      default: 3,
    },
  },
  { timestamps: true }
);
module.exports = model("superAdmin", superAdminSchema);
