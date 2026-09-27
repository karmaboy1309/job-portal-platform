const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: false
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
    default: 'Full-time'
  },
  // Skills required for the job (e.g. ['React', 'Node.js'])
  skills: {
    type: [String],
    default: []
  },
  // Experience level required
  experience: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'],
    default: 'Entry Level'
  },
  // Application deadline
  deadline: {
    type: Date,
    required: false
  },
  // Featured flag for highlighting jobs
  isFeatured: {
    type: Boolean,
    default: false
  },
  // Whether the listing is currently open for applications
  isActive: {
    type: Boolean,
    default: true
  },
  owner: { type: require('mongoose').Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);
