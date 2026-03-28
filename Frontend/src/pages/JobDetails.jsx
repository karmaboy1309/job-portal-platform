import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById, applyJob } from '../services/jobService';
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

  useEffect(() => {
    fetchJob();
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

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      setApplying(true);
      await applyJob(id, { coverLetter: '' });
      setApplied(true);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
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
                <span className="job-detail-meta">🏢 Full-time</span>
                <span className="job-detail-meta">🌍 Open to remote</span>
              </div>
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <span className="badge badge-blue">Full-time</span>
                <span className="badge badge-purple">Hybrid</span>
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
                onClick={handleApply}
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
            <button className="btn btn-secondary" onClick={() => navigate('/jobs')}>
              ← All Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
