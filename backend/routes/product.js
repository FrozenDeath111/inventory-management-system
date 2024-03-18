const express = require("express");

const requireAuth = require("../middleware/requireAuth.js");
const { createProduct, getProducts, getProductHistory } = require("../controllers/productController.js");

const router = express.Router();

// create new products
router.post("/create-product", requireAuth, createProduct);

// get products
router.get("/get-products", requireAuth, getProducts);

// get product info and history
router.get("/:_id", requireAuth, getProductHistory);

module.exports = router;