const mongoose = require("mongoose");
const Product = require("./productModel");
const Schema = mongoose.Schema;

const warehouseSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    warehouse_stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, database: "inv_management-sys", collection: "warehouse" }
);

module.exports = mongoose.model("Warehouse", warehouseSchema);
