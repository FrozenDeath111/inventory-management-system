const express = require("express");

const requireAuth = require("../middleware/requireAuth.js");
const { createProduct } = require("../controllers/productController.js");

const router = express.Router();

// create new products
router.post("/create-product", requireAuth, createProduct);

module.exports = router;