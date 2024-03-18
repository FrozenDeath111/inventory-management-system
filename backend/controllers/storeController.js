const Product = require("../models/productModel");
const User = require("../models/userModel");
const Store = require("../models/storeModel");
const mongoose = require("mongoose");

// get store stock
const getStoreStock = async (req, res) => {
    try {
        
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
            const products = await Product.find();

            delete products['details'];

            res.status(200).json(products);
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
            res.status(200).json({msg:"Product Added Successfully"});
        } else {
            res.status(401).json({ error: "Authorization Level Problem" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getStoreStock,
    showProduct,
    addToStore
}