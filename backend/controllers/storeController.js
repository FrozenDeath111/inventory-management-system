const Product = require("../models/productModel");
const User = require("../models/userModel");
const Store = require("../models/storeModel");
const Request = require("../models/requestModel");
const StockActivity = require("../models/stockActivityModel");
const mongoose = require("mongoose");

// get store data
const getStoreData = async (req, res) => {
    const {username} = req.user;

    try {
        const {_id, role} = await User.findOne({username}).select('role');

        if(role === 3){
            const storeData = await Store.find({store_manager_id: _id});

            for(index in storeData){
                const product = await Product.findOne({_id: storeData[index].product_id});
                storeData[index]._doc.product_name = product.name;
                storeData[index]._doc.product_category = product.category;
            }

            res.status(200).json(storeData);
        } else {
            res.status(401).json({ error: "Authorization Level Problem" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// show can be added product
const showProduct = async (req, res) => {
    const {username} = req.user;

    try {
        const {_id, role} = await User.findOne({username}).select('role');

        if(role === 3){
            const store = await Store.find({store_manager_id: _id}).select('product_id');

            product_list = [];

            store.map(item => product_list.push(item.product_id));

            const products = await Product.find({ _id: {
                $nin: product_list
            }});

            delete products['details'];

            res.status(200).json(products);
        } else {
            res.status(401).json({ error: "Authorization Level Problem" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// get requests
const getRequests = async (req, res) => {
    const {username} = req.user;

    try {
        const {role} = await User.findOne({username}).select('role');

        if(role === 3){
            const requestData = await Request.find({store_manager_username: username});

            res.status(200).json(requestData);
        } else {
            res.status(401).json({ error: "Authorization Level Problem" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// add to store
const addToStore = async (req, res) => {
    const {username} = req.user;

    const {product_id} = req.body;

    try {
        const {_id, role} = await User.findOne({username}).select('role');

        if(role === 3){
            await Store.create({
                product_id,
                store_manager_id: _id,
                store_stock: 0,
                sale_stock: 0,
            });
            res.status(200).json({msg: "Product Added Successfully" });
        } else {
            res.status(401).json({ error: "Authorization Level Problem" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// request product
const requestProduct = async (req, res) => {
    const {username} = req.user;

    const {product_name, quantity} = req.body;

    try {
        const {role} = await User.findOne({username}).select('role');

        if(role === 3){
            const state = "pending";

            await Request.create({
                product_name,
                store_manager_username: username,
                quantity,
                state,
            })
            res.status(200).json({msg: "Request Added Successfully" });
        } else {
            res.status(401).json({ error: "Authorization Level Problem" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// update store data
const updateStore = async (req, res) => {
    const {username} = req.user;

    const {_id, product_name, store_stock, sale_stock, toSale} = req.body

    try {
        const {role} = await User.findOne({username}).select('role');

        if(role === 3){
            const product = await Product.findOne({name: product_name});

            await Store.updateOne({_id}, {
                $set: {
                    store_stock,
                    sale_stock,
                }
            })

            await StockActivity.create({
                product_id: product._id,
                quantity: toSale,
                state: "Sale",
                warehouse_staff_username: username,
            })

            const storeData = await Store.findOne({_id});

            storeData._doc.product_name = product.name;
            storeData._doc.product_category = product.category;

            res.status(200).json(storeData);

        } else {
            res.status(401).json({ error: "Authorization Level Problem" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    showProduct,
    getStoreData,
    addToStore,
    requestProduct,
    updateStore,
    getRequests
}