const { model, Schema } = require("mongoose");
const transactionSchema = new Schema(
  {
    sender_name: {
      type: String,
    },
    sender_phone: {
      type: Number,
    },
    receiver_name: {
      type: String,
    },
    receiver_phone: {
      type: Number,
    },
    coins: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = model("transaction", transactionSchema);
