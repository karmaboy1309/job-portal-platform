import React, { useEffect, useState } from 'react';
import { getStats, getJobs } from '../services/jobService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [s, j] = await Promise.all([getStats(), getJobs({ limit: 6 })]);
      setStats(s);
      setJobs(j.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <LoadingSpinner text="Loading dashboard…" />;

  return (
    <div className="page-wrapper">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div className="profile-avatar-lg" style={{ width: 56, height: 56, fontSize: 22 }}>
            {initials}
          </div>
          <div>
            <h1>{greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: 14 }}>
              Here's what's happening in your job portal today.
            </p>
          </div>
        </div>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Stats cards */}
      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-card-icon blue">💼</div>
          <div className="stats-card-value" style={{ color: 'var(--clr-primary-light)' }}>
            {stats?.totalJobs ?? '—'}
          </div>
          <div className="stats-card-label">Total Jobs Listed</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-icon purple">📍</div>
          <div className="stats-card-value" style={{ color: 'var(--clr-accent)' }}>
            {stats?.byLocation?.length ?? '—'}
          </div>
          <div className="stats-card-label">Locations Covered</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-icon green">✅</div>
          <div className="stats-card-value" style={{ color: 'var(--clr-success)' }}>
            {jobs.length}
          </div>
          <div className="stats-card-label">Recent Postings</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-icon amber">💰</div>
          <div className="stats-card-value" style={{ color: 'var(--clr-warning)' }}>
            {stats?.byLocation?.length
              ? `$${Math.round(
                stats.byLocation.reduce((s, b) => s + (b.avgSalary || 0), 0) /
                stats.byLocation.length
              ).toLocaleString()}`
              : '—'}
          </div>
          <div className="stats-card-label">Avg. Salary</div>
        </div>
      </div>

      {/* Locations breakdown */}
      {stats?.byLocation?.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div className="dashboard-section-header">
            <span className="dashboard-section-title">📍 Jobs by Location</span>
            <span className="badge badge-blue">{stats.byLocation.length} locations</span>
          </div>
          <div className="card" style={{ padding: '16px 20px' }}>
            <ul className="location-list">
              {stats.byLocation.map((b) => (
                <li key={b._id} className="location-item">
                  <span className="location-name">📌 {b._id || 'Unknown'}</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span className="badge badge-blue">{b.count} jobs</span>
                    <span className="location-meta">
                      avg ${Math.round(b.avgSalary || 0).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recent jobs */}
      <div>
        <div className="dashboard-section-header">
          <span className="dashboard-section-title">🔥 Recent Listings</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/jobs')}>
            View all →
          </button>
        </div>
        <div className="recent-jobs-grid">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                className="mini-job-card"
                onClick={() => navigate(`/jobs/${job._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="mini-job-title">{job.title}</div>
                <div className="mini-job-meta">
                  🏢 {job.company} {job.location && `• 📍 ${job.location}`}
                  {job.salary && ` • 💰 $${Number(job.salary).toLocaleString()}`}
                </div>
                {job.description && (
                  <p className="mini-job-desc">{job.description}</p>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--clr-text-muted)', fontSize: 14 }}>No recent jobs found.</p>
          )}
        </div>
      </div>

      {/* Quick actions for employer */}
      {user && (user.role === 'employer' || user.role === 'admin') && (
        <div style={{ marginTop: 36, padding: '24px', background: 'var(--clr-surface-2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--clr-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Ready to hire? 🎯</div>
              <div style={{ color: 'var(--clr-text-muted)', fontSize: 13 }}>Post a new job listing and reach thousands of qualified candidates.</div>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/create')}>
              ✨ Post a Job
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
