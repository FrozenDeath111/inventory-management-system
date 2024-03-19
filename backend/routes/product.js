const express = require("express");

const requireAuth = require("../middleware/requireAuth.js");
const { createProduct, getProducts, getProductHistory, getActivity, updateStock, addProduct, getDashboardData } = require("../controllers/productController.js");

const router = express.Router();

// create new products
router.post("/create-product", requireAuth, createProduct);

// get products
router.get("/get-products", requireAuth, getProducts);

// get activity - warehouse
router.get("/get-activity", requireAuth, getActivity);

// get dashboard data
router.get("/dashboard-data", requireAuth, getDashboardData);

// get product info and history
router.get("/:_id", requireAuth, getProductHistory);

// update stock
router.patch("/update-stock", requireAuth, updateStock);

// add product
router.patch("/add-product", requireAuth, addProduct);


module.exports = router;