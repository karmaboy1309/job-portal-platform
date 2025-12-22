const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const Application = require('../models/Application');

// Create a new Job (employer only)
router.post('/create', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer' && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const payload = { ...req.body, owner: req.user._id };
    const newJob = new Job(payload);
    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply to a job (seeker)
router.post('/:id/apply', auth, async (req, res) => {
  try {
    if (req.user.role !== 'seeker') return res.status(403).json({ message: 'Only job seekers can apply' });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied' });
    const application = new Application({ job: job._id, applicant: req.user._id, coverLetter: req.body.coverLetter || '' });
    await application.save();
    res.status(201).json({ message: 'Application submitted', application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employer: get applications for a job
router.get('/:id/applications', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.owner) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const apps = await Application.find({ job: job._id }).populate('applicant', 'name email');
    res.json({ applications: apps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single Job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Job by ID
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
