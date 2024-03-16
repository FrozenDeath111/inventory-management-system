const Product = require("../models/productModel");
const StockActivity = require("../models/stockActivityModel");
const Warehouse = require("../models/warehouseModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

// create new products
const createProduct = async (req, res) => {
  const { username } = req.user;
  const { name, category, details, quantity, warehouse_staff_username } =
    req.body;

  try {
    const { role } = await User.findOne({ username }).select("role");

    if (role === 1) {
      const product = await Product.create({ name, category, details });
      const state = "New Stock";

      await StockActivity.create({
        product_id: product._id,
        quantity,
        state,
        warehouse_staff_username,
      });
      await Warehouse.create({
        product_id: product._id,
        warehouse_stock: quantity,
      });

      res.status(200).json({ msg: "Product Added Successfully" });
    } else {
      res.status(401).json({ error: "Authorization Level Not High Enough" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
};
