const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
});

module.exports = mongoose.model('User', userSchema);
