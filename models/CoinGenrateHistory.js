const { model, Schema } = require("mongoose");
const coinGenrateHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    coin: {
      type: Number,
      required: true,
    },
    genrateDate: {
      type: String,
      default: new Date().toLocaleDateString(),
    },
  },
  { timestamps: true }
);
module.exports = model("coinGenrateHistory", coinGenrateHistorySchema);
