const express = require("express");
const requireAuth = require("../middleware/requireAuth.js");
const { getStoreStock, showProduct, addToStore } = require("../controllers/storeController.js");

const router = express.Router();

// get store stock
router.get("/get_stock", requireAuth, getStoreStock);

// show can be added product
router.get("/show_products", requireAuth, showProduct);

// add product to store
router.post("/add-to-store", requireAuth, addToStore);

module.exports = router;