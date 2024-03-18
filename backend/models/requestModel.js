const mongoose = require("mongoose");
const Product = require("./productModel");
const User = require("./userModel");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
    {
        product_name: {
          type: String,
          required: true,
        },
        store_manager_username: {
            type: String,
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
    },
    { timestamps: true, database: "inv_management-sys", collection: "request" }
)

module.exports = mongoose.model("Request", requestSchema);