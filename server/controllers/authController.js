const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).cookie('token', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, district } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already registered'); }
  const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'officer', district });
  sendToken(user, 201, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Please provide email and password'); }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error('Invalid credentials'); }
  sendToken(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10000), httpOnly: true });
  res.json({ success: true, message: 'Logged out' });
});
