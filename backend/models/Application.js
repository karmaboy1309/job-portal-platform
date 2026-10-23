const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String },
  resumeURL: { type: String, default: '' },
  portfolioURL: { type: String, default: '' },
  status: { type: String, enum: ['pending','accepted','rejected'], default: 'pending' },
  // Employer's internal note when reviewing the application
  note: { type: String, default: '' },
  // Timestamp of when the application was last reviewed
  reviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
