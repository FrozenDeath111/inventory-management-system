const express = require("express");
const requireAuth = require("../middleware/requireAuth.js");
const { showProduct, addToStore, getStoreData, requestProduct, updateStore, getRequests } = require("../controllers/storeController.js");

const router = express.Router();

// get store data
router.get("/get-store-data", requireAuth, getStoreData);

// show can be added product
router.get("/show_products", requireAuth, showProduct);

// get requests
router.get("/get-requests", requireAuth, getRequests);

// add product to store
router.post("/add-to-store", requireAuth, addToStore);

// request product
router.post("/request-stock", requireAuth, requestProduct);

// update store
router.patch("/update-store", requireAuth, updateStore);

module.exports = router;