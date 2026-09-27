import React, { useState } from 'react';
import { createJob } from '../services/jobService';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'];

const CreateJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '', company: '', salary: '', location: '', description: '',
    type: 'Full-time',
    skills: '',
    experience: 'Entry Level',
    deadline: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const salaryNumber = Number(formData.salary);
    if (Number.isNaN(salaryNumber) || !formData.salary) {
      setError('Please enter a valid salary number');
      return;
    }
    if (!formData.location?.trim()) {
      setError('Location is required');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        ...formData,
        salary: salaryNumber,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        deadline: formData.deadline || undefined,
      };
      await createJob(payload);
      setSuccess(true);
      setTimeout(() => navigate('/jobs'), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to create job';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page-wrapper-md">
        <div className="access-denied">
          <div className="access-denied-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p>Please sign in as an employer to post jobs.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'employer' && user.role !== 'admin') {
    return (
      <div className="page-wrapper-md">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h2>Employer Access Only</h2>
          <p>Only employer accounts can post job listings. Create an employer account to get started.</p>
          <button className="btn btn-secondary" onClick={() => navigate('/jobs')}>
            Browse Jobs Instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper-md">
      {/* Header */}
      <div className="create-job-header">
        <div className="create-job-icon">✨</div>
        <div>
          <h1 className="page-title">Post a <span>New Job</span></h1>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 14, marginTop: 4 }}>
            Fill in the details below to reach thousands of qualified candidates.
          </p>
        </div>
      </div>

      <div className="create-job-form-card">
        {success && (
          <div className="success-box" style={{ marginBottom: 20 }}>
            <span>🎉</span>
            <span>Job posted successfully! Redirecting to job listings…</span>
          </div>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading && <LoadingSpinner text="Creating your listing…" />}

        {!loading && (
          <form className="create-job-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cj-title">Job Title *</label>
                <input
                  id="cj-title"
                  type="text"
                  name="title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cj-company">Company Name *</label>
                <input
                  id="cj-company"
                  type="text"
                  name="company"
                  placeholder="e.g. Acme Corp"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cj-location">Location *</label>
                <input
                  id="cj-location"
                  type="text"
                  name="location"
                  placeholder="e.g. New York, Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cj-salary">Annual Salary (USD) *</label>
                <input
                  id="cj-salary"
                  type="number"
                  name="salary"
                  placeholder="e.g. 95000"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Type</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
                {JOB_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`badge ${formData.type === t ? 'badge-blue' : ''}`}
                    style={{
                      padding: '8px 16px',
                      cursor: 'pointer',
                      border: formData.type === t
                        ? '1px solid rgba(79,125,255,0.4)'
                        : '1px solid var(--clr-border)',
                      background: formData.type === t
                        ? 'rgba(79,125,255,0.15)'
                        : 'rgba(255,255,255,0.03)',
                      color: formData.type === t
                        ? 'var(--clr-primary-light)'
                        : 'var(--clr-text-secondary)',
                      fontSize: 13,
                      fontWeight: 600,
                      borderRadius: 'var(--radius-full)',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => setFormData({ ...formData, type: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cj-exp">Experience Level</label>
                <select
                  id="cj-exp"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                >
                  {EXPERIENCE_LEVELS.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="cj-deadline">Application Deadline (Optional)</label>
                <input
                  id="cj-deadline"
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cj-skills">Required Skills</label>
              <input
                id="cj-skills"
                type="text"
                name="skills"
                placeholder="e.g. React, Node.js, TypeScript, Docker"
                value={formData.skills}
                onChange={handleChange}
              />
              <span className="form-hint">Separate skills with commas (e.g. React, MongoDB)</span>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <input
                id="cj-featured"
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                style={{ width: 'auto', cursor: 'pointer' }}
              />
              <label htmlFor="cj-featured" style={{ marginBottom: 0, cursor: 'pointer', fontWeight: 600 }}>
                ⭐ Mark as Featured Listing (prominently highlighted to applicants)
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="cj-desc">Job Description *</label>
              <textarea
                id="cj-desc"
                name="description"
                placeholder="Describe the role, responsibilities, requirements, and benefits…"
                value={formData.description}
                onChange={handleChange}
                required
                style={{ minHeight: 160 }}
              />
              <span className="form-hint">
                💡 Tip: A detailed description gets 3× more qualified applicants.
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/jobs')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || success}
                style={{ minWidth: 140 }}
              >
                {success ? '✅ Posted!' : '🚀 Post Job'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateJob;
