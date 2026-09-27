const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const Application = require('../models/Application');

// Create a new Job (employer only)
router.post('/create', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { title, company, location, description, salary, type, skills, experience, deadline, isFeatured } = req.body;
    if (!title?.trim() || !company?.trim() || !location?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Title, company, location, and description are required' });
    }
    const parsedSkills = Array.isArray(skills)
      ? skills.map(s => String(s).trim()).filter(Boolean)
      : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []);

    const payload = {
      title: title.trim(),
      company: company.trim(),
      location: location.trim(),
      description: description.trim(),
      salary: salary ? Number(salary) : undefined,
      type: type || 'Full-time',
      skills: parsedSkills,
      experience: experience || 'Entry Level',
      deadline: deadline ? new Date(deadline) : undefined,
      isFeatured: Boolean(isFeatured),
      owner: req.user._id
    };
    const newJob = new Job(payload);
    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: newJob });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Job statistics (MUST be before /:id)
router.get('/stats', async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const byLocation = await Job.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.status(200).json({ totalJobs, byLocation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seeker: get own applications (MUST be before /:id)
router.get('/my-applications', auth, async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });
    res.status(200).json({ applications: apps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Jobs with optional search, type, and salary range filtering (only active listings)
router.get('/', async (req, res) => {
  try {
    const { search, type, location, minSalary, maxSalary } = req.query;
    const filter = { isActive: true };
    if (type && type !== 'All') {
      filter.type = type;
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ data: jobs, total: jobs.length });
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

// Apply to a job (seeker)
router.post('/:id/apply', auth, async (req, res) => {
  try {
    if (req.user.role !== 'seeker') return res.status(403).json({ message: 'Only job seekers can apply' });
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied for this job' });
    const application = new Application({
      job: job._id,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter || ''
    });
    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employer: get applications for a specific job
router.get('/:id/applications', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const apps = await Application.find({ job: job._id })
      .populate('applicant', 'name email location skills resumeURL');
    res.json({ applications: apps });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Employer: update application status (accept / reject)
router.patch('/:id/applications/:appId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { status, note } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const app = await Application.findByIdAndUpdate(
      req.params.appId,
      { status, note: note || '', reviewedAt: new Date() },
      { new: true }
    );
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application status updated', application: app });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Job by ID (owner or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.owner) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const allowed = ['title', 'description', 'company', 'location', 'salary', 'type', 'skills', 'experience', 'deadline', 'isActive'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });
    await job.save();
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Job by ID (owner or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (String(job.owner) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
