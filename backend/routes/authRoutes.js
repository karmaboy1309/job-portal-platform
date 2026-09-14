const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, location, bio, skills, resumeURL } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email, and password are required' });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hash,
      role: role || 'seeker',
      location: location || '',
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map(s=>s.trim()) : []),
      resumeURL: resumeURL || ''
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location, bio: user.bio, skills: user.skills, resumeURL: user.resumeURL } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const u = req.user;
    res.json({ user: u });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update profile
router.put('/me', auth, async (req, res) => {
  try {
    const updates = (({ name, location, bio, skills, resumeURL, avatarURL }) => ({ name, location, bio, skills, resumeURL, avatarURL }))(req.body);
    if (updates.skills && !Array.isArray(updates.skills)) updates.skills = String(updates.skills).split(',').map(s=>s.trim());
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select('-passwordHash');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    const user = await User.findById(req.user._id);
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
