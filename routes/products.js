const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique name
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Max: 5MB
});


router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log(" Body:", req.body);
    console.log("File:", req.file);

    const { user, title, description, price, location, category, condition, contact } = req.body;
    
    if (!user) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const image = req.file ? req.file.filename : "default.jpg";

    const newProduct = new Product({
      user,
      title,
      description,
      price,
      location,
      category,
      condition,
      contact,
      image
    });

    await newProduct.save();
    res.status(201).json({ message: "Product listed successfully!", product: newProduct });
  } catch (error) {
    console.error(" Error adding product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


//  Get all products (homepage use this)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("user", "name email") 
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});


//  Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    .populate("user", "name email");
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error('Error getting product:', err);
    res.status(500).json({ message: 'Server error while getting product' });
  }
});

//  Get products of a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userProducts = await Product.find({ user: req.params.userId });
    res.json(userProducts);
  } catch (err) {
    console.error('Error getting user products:', err);
    res.status(500).json({ message: 'Server error while getting user products' });
  }
});
//  Delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: ' Product deleted successfully' });
  } catch (error) {
    console.error(' Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

router.get("/mylisting/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const items = await Product.find({ user: userId }); // match by user field
    res.json(items);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ message: "failed to fetch listing" });
  }
});

module.exports = router;
