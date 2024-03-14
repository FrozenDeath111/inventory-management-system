const mongoose = require("mongoose");
const Product = require("./productModel");
const Schema = mongoose.Schema;

const stockActivitySchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
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
    warehouse_staff_username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    database: "inv_management-sys",
    collection: "stockActivity",
  }
);

module.exports = mongoose.model("StockActivity", stockActivitySchema);
