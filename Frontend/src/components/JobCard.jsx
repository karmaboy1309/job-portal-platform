import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applyJob } from '../services/jobService';

const COMPANY_COLORS = [
  'linear-gradient(135deg,#4f7dff,#7c3aed)',
  'linear-gradient(135deg,#06b6d4,#4f7dff)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#22c55e,#06b6d4)',
  'linear-gradient(135deg,#a78bfa,#ec4899)',
];

const JobCard = ({ job, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async (e) => {
    e.stopPropagation();
    try {
      setApplying(true);
      await applyJob(job._id, { coverLetter: '' });
      setApplied(true);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${job.title}"?`)) {
      onDelete(job._id);
    }
  };

  const isOwner =
    user &&
    (user.role === 'admin' ||
      String(job.owner || '') === String(user.id || user._id || ''));

  // Pick a color based on company name
  const colorIdx =
    job.company
      ? job.company.charCodeAt(0) % COMPANY_COLORS.length
      : 0;

  const initial = job.company ? job.company[0].toUpperCase() : '?';

  const formattedSalary = job.salary
    ? `$${Number(job.salary).toLocaleString()}`
    : null;

  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
      {/* Top row */}
      <div className="job-card-top">
        <div
          className="company-logo"
          style={{ background: COMPANY_COLORS[colorIdx] }}
        >
          {initial}
        </div>
        <div className="job-card-info">
          <div className="job-card-title">{job.title}</div>
          <div className="job-card-company">{job.company}</div>
        </div>
      </div>

      {/* Meta */}
      <div className="job-card-meta">
        {job.location && (
          <span className="job-meta-item">
            <span className="icon">📍</span> {job.location}
          </span>
        )}
        <span className="badge badge-blue">Full-time</span>
        <span className="badge badge-purple">Remote</span>
      </div>

      {/* Description */}
      {job.description && (
        <p className="job-card-desc">{job.description}</p>
      )}

      {/* Footer */}
      <div className="job-card-footer">
        {formattedSalary ? (
          <span className="salary-badge">{formattedSalary}/yr</span>
        ) : (
          <span className="salary-badge">Competitive</span>
        )}

        <div className="job-card-actions" onClick={e => e.stopPropagation()}>
          {user && user.role === 'seeker' && (
            <button
              className={`btn ${applied ? 'btn-success' : 'btn-primary'} btn-sm`}
              onClick={handleApply}
              disabled={applying || applied}
            >
              {applied ? '✅ Applied' : applying ? 'Applying…' : 'Apply Now'}
            </button>
          )}
          {isOwner && onDelete && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              🗑️
            </button>
          )}
          {!user && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={e => { e.stopPropagation(); navigate('/login'); }}
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
