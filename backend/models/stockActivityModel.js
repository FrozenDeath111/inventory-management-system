const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stockActivitySchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    request_id: {
      type: Schema.Types.ObjectId,
      ref: "Request",
    },
    quantity: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    staff_username: {
      type: String,
    },
  },
  {
    timestamps: true,
    database: "inv_management-sys",
    collection: "stockActivity",
  }
);

module.exports = mongoose.model("StockActivity", stockActivitySchema);
