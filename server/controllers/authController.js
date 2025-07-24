// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendResetEmail, sendRegistrationEmail } = require('../utils/mailer');

// ✅ Register User
const registerUser = async (req, res) => {
  const { name, email, password, phone, country, city, course, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      country,
      city,
      course,
      role
    });

    await user.save();
    sendRegistrationEmail(user);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Register Error:', err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// ✅ Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'secret_key'); // Replace with env var

    return res.status(200).json({ token, role: user.role });
  } catch (err) {
    console.error('❌ Login Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get All Users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json(users);
  } catch (err) {
    console.error('❌ Get Users Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetLink = `http://localhost:5000/reset-password/${user._id}`;
    sendResetEmail(user, resetLink);

    return res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('❌ Forgot Password Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Reset Password
const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error('❌ Reset Password Error:', err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

// ✅ Exports
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  forgotPassword,
  resetPassword
};
