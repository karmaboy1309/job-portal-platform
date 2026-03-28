const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['seeker','employer','admin'], default: 'seeker' },
  location: { type: String },
  bio: { type: String },
  skills: { type: [String], default: [] },
  resumeURL: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
