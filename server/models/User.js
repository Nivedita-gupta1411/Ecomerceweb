// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema fields first
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  profilePhoto: { type: String, default: "" },
  trustScore: { type: Number, default: 5.0 }
}, { timestamps: true });

//  Place pre-save hook here, before model compilation
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});


// Add instance method for comparing password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

//  Finally, compile and export the model
module.exports = mongoose.model('User', userSchema);
