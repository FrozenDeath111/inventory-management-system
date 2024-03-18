require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const storeRoutes = require("./routes/store");

// app initialization
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// routes
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/store", storeRoutes);

// db connection
async function run() {
    await mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        // listen port
        app.listen(process.env.PORT, () => {
          console.log(
            `DB Initialization Complete. Listening on ${process.env.PORT}`
          );
        });
      });
  }
  
  run().catch((error) => console.log(error));