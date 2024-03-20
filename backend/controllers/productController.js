const Product = require("../models/productModel");
const StockActivity = require("../models/stockActivityModel");
const Warehouse = require("../models/warehouseModel");
const User = require("../models/userModel");
const Store = require("../models/storeModel");
const Request = require("../models/requestModel");
const mongoose = require("mongoose");

// create new products
const createProduct = async (req, res) => {
  const { username } = req.user;
  const { name, category, details, quantity, staff_username } = req.body;

  try {
    const { role } = await User.findOne({ username }).select("role");

    const productExist = await Product.findOne({ name });

    if (productExist && role === 1) {
      res.status(400).json({ error: "Product Exists" });
    } else if (role === 1) {
      const product = await Product.create({ name, category, details });
      const state = "To Receive";

      await StockActivity.create({
        product_id: product._id,
        quantity,
        state,
        staff_username,
      });

      await Warehouse.create({
        product_id: product._id,
        warehouse_stock: 0,
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
  const { username } = req.user;

  try {
    const { role } = await User.findOne({ username }).select("role");

    if (role === 1) {
      const products = await Product.find().sort({ _id: -1 });
      delete products["details"];

      for (index in products) {
        const { warehouse_stock } = await Warehouse.findOne({
          product_id: products[index]._id,
        }).select("warehouse_stock");
        products[index]._doc.stock = warehouse_stock;
      }

      const staffNames = await User.find({role: 2});

      delete staffNames['name'];
      delete staffNames['password'];
      delete staffNames['role'];

      res.status(200).json({products, staffNames});
    } else if (role === 2) {
      const products = await Product.find().sort({ _id: -1 });
      delete products["details"];

      for (index in products) {
        const { warehouse_stock } = await Warehouse.findOne({
          product_id: products[index]._id,
        }).select("warehouse_stock");
        products[index]._doc.stock = warehouse_stock;
      }

      res.status(200).json(products);
    } else {
      res.status(401).json({ error: "Authorization Level Problem" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get product info and history
const getProductHistory = async (req, res) => {
  try {
    const _id = req.params._id;

    const productDetails = await Product.findOne({ _id });
    const productHistory = await StockActivity.find({ product_id: _id });

    res.status(200).json({ productDetails, productHistory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get activity
const getActivity = async (req, res) => {
  const { username } = req.user;

  try {
    const { role } = await User.findOne({ username }).select("role");

    if (role === 2) {
      const requestData = await StockActivity.find({
        $or: [
          {
            state: "To Ship",
          },
          {
            state: "To Receive",
            staff_username: username,
          },
        ],
      });

      for (let index in requestData) {
        const { name } = await Product.findOne({
          _id: requestData[index].product_id,
        }).select("name");
        requestData[index]._doc.product_name = name;

        const { warehouse_stock } = await Warehouse.findOne({
          product_id: requestData[index].product_id,
        }).select("warehouse_stock");
        requestData[index]._doc.wh_stock = warehouse_stock;
      }

      res.status(200).json(requestData);
    } else {
      res.status(401).json({ error: "Authorization Level Problem" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get dashboard data
const getDashboardData = async (req, res) => {
  const {username} = req.user

  try {
    const { role } = await User.findOne({ username }).select("role");

    if(role === 1) {
      const data = await StockActivity.find().sort({updatedAt: -1});

      res.status(200).json(data);
    } else if(role === 2) {
      const data = await StockActivity.find({
        $or: [{
          state: "Received",
        },{
          state: "Shipped",
        }]
      }).sort({updatedAt: -1});

      for(let index in data){
        let {name} = await Product.findOne({_id: data[index].product_id}).select('name');
        data[index]._doc.product_name = name;
      }

      res.status(200).json(data);
    } else if(role === 3) {
      const {_id} = await User.findOne({username}).select('_id');
      const storeStockData = await Store.find({store_manager_id: _id});
      const saleData = await StockActivity.find({staff_username: username, state:"Sale"}).sort({updatedAt: -1});

      for(let index in saleData){
        let {name} = await Product.findOne({_id: saleData[index].product_id}).select('name');
        saleData[index]._doc.product_name=name;
      }

      res.status(200).json({storeStockData, saleData});
    } else {
      res.status(401).json({ error: "Authorization Level Problem" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// update stock
const updateStock = async (req, res) => {
  const { username } = req.user;

  const updateData = req.body;

  try {
    const { role } = await User.findOne({ username }).select("role");

    if (role === 2) {
      if (updateData.action && updateData.state === "To Ship") {
        await Warehouse.updateOne(
          { product_id: updateData.product_id },
          {
            $inc: {
              warehouse_stock: -updateData.requestedStock,
            },
          }
        );

        const { _id } = await User.findOne({
          username: updateData.store_username,
        }).select("_id");

        await Request.updateOne(
          { _id: updateData.request_id },
          {
            $set: {
              state: "Shipped",
            },
          }
        );

        await Store.updateOne(
          { store_manager_id: _id, product_id: updateData.product_id },
          {
            $inc: {
              store_stock: +updateData.requestedStock,
            },
          }
        );

        await StockActivity.updateOne(
          { _id: updateData._id },
          {
            $set: {
              quantity: updateData.requestedStock,
              state: "Shipped",
              staff_username: username,
            },
          }
        );

        res.status(200).json({ msg: "Shipped Successfully" });
      } else if (updateData.action && updateData.state === "To Receive") {
        await Warehouse.updateOne(
          { product_id: updateData.product_id },
          {
            $inc: {
              warehouse_stock: +updateData.requestedStock,
            },
          }
        );

        await StockActivity.updateOne(
          { _id: updateData._id },
          {
            $set: {
              quantity: updateData.requestedStock,
              state: "Received",
              staff_username: username,
            },
          }
        );

        res.status(200).json({ msg: "Received Successfully" });
      } else {
        if (updateData.request_id) {
          await Request.updateOne(
            { _id: updateData.request_id },
            {
              $set: {
                state: "Rejected",
              },
            }
          );
        }

        await StockActivity.updateOne(
          { _id: updateData._id },
          {
            $set: {
              quantity: updateData.requestedStock,
              state: "Rejected",
              staff_username: username,
            },
          }
        );

        res.status(200).json({ msg: "Rejected Successfully" });
      }
    } else {
      res.status(401).json({ error: "Authorization Level Problem" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// add product
const addProduct = async (req, res) => {
  const { username } = req.user;

  const {product_id, addAmount, staffName} = req.body;

  try {
    const { role } = await User.findOne({ username }).select("role");

    if (role === 1) {
      await Warehouse.updateOne({product_id},{
        $inc : {
          warehouse_stock: +addAmount,
        }
      })

      await StockActivity.create({
        product_id,
        quantity: addAmount,
        state: "Received",
        staff_username: staffName,
      })
      
      res.status(200).json({msg: "Stock Added Successfully"});
    } else {
      res.status(401).json({ error: "Authorization Level Problem" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductHistory,
  getActivity,
  updateStock,
  addProduct,
  getDashboardData,
};
