// server.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
//
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");


dotenv.config();


// Middleware
app.use(cors());
app.use(express.json());
app.use('/upload', express.static(path.join(__dirname, 'upload'))); // Serve uploaded images

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
// app.use("/api/items", itemRoutes);

app.get("/", (req, res) => {
  res.send(" Welcome to the Local Community Marketplace API!");
});



// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" DB connection error:", err.message);
  });
