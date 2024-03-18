const mongoose = require("mongoose");
const Product = require("./productModel");
const User = require("./userModel");
const Schema = mongoose.Schema;

const storeSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    store_manager_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    store_stock: {
      type: Number,
      required: true,
    },
    sale_stock: {
        type: Number,
        required: true,
    },
  },
  { timestamps: true, database: "inv_management-sys", collection: "store" }
);

module.exports = mongoose.model("Store", storeSchema);