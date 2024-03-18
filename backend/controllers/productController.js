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

    const productExist = await Product.findOne({name});

    if(productExist && role === 1) {
      const state = "Update Stock";

      await StockActivity.create ({
        product_id:productExist._id,
        quantity,
        state,
        warehouse_staff_username,
      });

      await Warehouse.updateOne({product_id: productExist._id}, {$inc: {
        warehouse_stock: quantity,
      }})

      res.status(200).json({ msg: "Product Updated Successfully" });
    } else if (role === 1) {
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

// get products
const getProducts = async (req, res) => {
  const {username} = req.user;

  try {
    const { role } = await User.findOne({ username }).select("role");

    if(role !== 3) {
      const products = await Product.find().sort({_id: -1});
      delete products['details'];

      for(index in products){
        const {warehouse_stock} = await Warehouse.findOne({product_id: products[index]._id}).select('warehouse_stock');
        products[index]._doc.stock = warehouse_stock;
      }


      // const selected_id = [];
      // products.forEach((item) => {
      //   selected_id.push(item._id);
      // })

      // const stock = await Warehouse.find({"product_id": {
      //   "$in":selected_id
      // }})

      // for(index in products) {
      //     for(i in stock) {
      //       if(products[index]._id.toString() == stock[i].product_id.toString()){
      //         products[index]._doc.stock = stock[i].warehouse_stock;
      //       }
      //     }
      // }

      res.status(200).json(products);
    }
    else {
      res.status(200).json({msg: "Yet to be implemented"});
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// get product info and history
const getProductHistory = async (req, res) => {
  try {
    const _id = req.params._id;

    const productDetails = await Product.findOne({_id});
    const productHistory = await StockActivity.find({product_id: _id});

    res.status(200).json({productDetails, productHistory});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductHistory,
};
