import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyJob, isJobSaved, toggleSaveJob } from '../services/jobService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';

const COMPANY_COLORS = [
  'linear-gradient(135deg,#4f7dff,#7c3aed)',
  'linear-gradient(135deg,#06b6d4,#4f7dff)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#22c55e,#06b6d4)',
  'linear-gradient(135deg,#a78bfa,#ec4899)',
];

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(() => isJobSaved(id));
  const [copied, setCopied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJob();
    setSaved(isJobSaved(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobById(id);
      setJob(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!user) { navigate('/login'); return; }
    setShowApplyModal(true);
  };

  const submitApplication = async (e) => {
    if (e) e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      setApplying(true);
      await applyJob(id, { coverLetter: coverLetter.trim() });
      setApplied(true);
      setShowApplyModal(false);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleToggleSave = () => {
    const nextSaved = toggleSaveJob(id);
    setSaved(nextSaved);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <LoadingSpinner text="Loading job details…" />;

  const colorIdx = job?.company
    ? job.company.charCodeAt(0) % COMPANY_COLORS.length
    : 0;

  return (
    <div className="page-wrapper-md">
      {/* Back */}
      <button className="job-details-back" onClick={() => navigate(-1)}>
        ← Back to Jobs
      </button>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {job && (
        <div className="job-details-card">
          {/* Header */}
          <div className="job-details-header">
            <div
              className="job-details-company-logo"
              style={{ background: COMPANY_COLORS[colorIdx] }}
            >
              {job.company?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="job-details-title">{job.title}</h1>
              <div className="job-details-company">{job.company}</div>
              <div className="job-details-meta-row">
                {job.location && (
                  <span className="job-detail-meta">📍 {job.location}</span>
                )}
                <span className="job-detail-meta">🏢 {job.type || 'Full-time'}</span>
                {job.createdAt && (
                  <span className="job-detail-meta">📅 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                )}
                {job.deadline && (() => {
                  const daysLeft = Math.ceil((new Date(job.deadline) - Date.now()) / 86400000);
                  const isUrgent = daysLeft >= 0 && daysLeft <= 3;
                  const isExpired = daysLeft < 0;
                  return (
                    <span className="job-detail-meta" style={{ color: isExpired ? 'var(--clr-danger, #ef4444)' : isUrgent ? 'var(--clr-warning, #f59e0b)' : 'inherit' }}>
                      ⏰ Deadline: {new Date(job.deadline).toLocaleDateString()}
                      {isUrgent && !isExpired && <span className="badge badge-red" style={{ marginLeft: 6 }}>Closing soon!</span>}
                      {isExpired && <span className="badge badge-red" style={{ marginLeft: 6 }}>Closed</span>}
                    </span>
                  );
                })()}
              </div>
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span className="badge badge-blue">{job.type || 'Full-time'}</span>
                {job.location && job.location.toLowerCase().includes('remote') && (
                  <span className="badge badge-purple">Remote</span>
                )}
                {job.experience && (
                  <span className="badge badge-green">{job.experience}</span>
                )}
                {Array.isArray(job.skills) && job.skills.slice(0, 4).map(s => (
                  <span key={s} className="badge badge-purple">{s}</span>
                ))}
                <span className="badge badge-green">Actively Hiring</span>
              </div>
              {job.salary && (
                <div className="job-details-salary-big">
                  ${Number(job.salary).toLocaleString()}
                  <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--clr-text-muted)', marginLeft: 6 }}>/ year</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="job-details-desc-heading">JOB DESCRIPTION</p>
          <p className="job-details-desc">
            {job.description || 'No description provided.'}
          </p>

          {/* Apply section */}
          <div className="job-details-apply-row">
            {user?.role === 'seeker' ? (
              <button
                className={`btn btn-lg ${applied ? 'btn-success' : 'btn-primary'}`}
                onClick={handleApplyClick}
                disabled={applying || applied}
              >
                {applied
                  ? '✅ Application Sent!'
                  : applying
                    ? 'Submitting…'
                    : '🚀 Apply Now'}
              </button>
            ) : user ? (
              <div className="error-box" style={{ marginBottom: 0, flex: 1 }}>
                <span className="error-icon">ℹ️</span>
                <span>Only job seekers can apply. Log in as a seeker to apply.</span>
              </div>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                🔐 Sign in to Apply
              </button>
            )}
            <button
              className={`btn ${saved ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={handleToggleSave}
              title={saved ? 'Remove from saved jobs' : 'Save this job'}
            >
              {saved ? '🔖 Saved' : '🤍 Save Job'}
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleShare}
              title="Copy share link"
            >
              {copied ? '✅ Copied!' : '🔗 Share'}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/jobs')}>
              ← All Jobs
            </button>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showApplyModal && job && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}
          onClick={() => setShowApplyModal(false)}
        >
          <div
            className="card"
            style={{
              maxWidth: 540,
              width: '100%',
              padding: 24,
              background: 'var(--clr-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--clr-border)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Apply for {job.title}</h2>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--clr-text-muted)', fontSize: 20, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <p style={{ color: 'var(--clr-text-secondary)', fontSize: 13, marginBottom: 16 }}>
              Submitting application to <strong>{job.company}</strong> as <strong>{user?.name}</strong> ({user?.email}).
            </p>
            <form onSubmit={submitApplication}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label htmlFor="modal-cover" style={{ fontSize: 13, fontWeight: 600 }}>
                  Cover Note / Introduction (Optional)
                </label>
                <textarea
                  id="modal-cover"
                  rows={5}
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself, highlight relevant experience, and explain why you're a great fit for this position…"
                  style={{ width: '100%', padding: '10px 12px', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowApplyModal(false)}
                  disabled={applying}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={applying}
                >
                  {applying ? 'Submitting…' : '🚀 Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
