const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  location: {
    type: String,
    required: true
  },

  image: {
    type: String, // Image URL or file path
    default: ""
  },

  category: {
    type: String,
    default: "General"
  },

  condition: {
    type: String,
    enum: ['New', 'Used'],
    default: 'Used'
  },

  contact: {
    type: String,
    default: "",
    // match: [/^(?:\+91|0)?[6-9]\d{9}$/, "Invalid phone number"]

  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', productSchema);
