import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyApplications } from '../services/jobService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyApplications();
      setApplications(res.applications || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="badge badge-green">🎉 Accepted</span>;
      case 'rejected':
        return <span className="badge badge-red">❌ Not Selected</span>;
      default:
        return <span className="badge badge-amber">⏳ Pending Review</span>;
    }
  };

  const filtered = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const countByStatus = (status) => applications.filter(a => a.status === status).length;

  if (loading) return <LoadingSpinner text="Loading your job applications…" />;

  return (
    <div className="page-wrapper">
      <div className="jobs-page-header">
        <div>
          <h1 className="page-title">My <span>Applications</span></h1>
          <p className="jobs-count">
            Track the progress of roles you've applied to ({applications.length} total)
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchApplications}>
          🔄 Refresh
        </button>
      </div>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Summary stats */}
      <div className="stats-cards" style={{ marginBottom: 28 }}>
        <div
          className="stats-card"
          style={{ cursor: 'pointer', border: statusFilter === 'all' ? '1px solid var(--clr-primary)' : undefined }}
          onClick={() => setStatusFilter('all')}
        >
          <div className="stats-card-icon blue">📁</div>
          <div className="stats-card-value" style={{ color: 'var(--clr-primary-light)' }}>{applications.length}</div>
          <div className="stats-card-label">Total Applied</div>
        </div>
        <div
          className="stats-card"
          style={{ cursor: 'pointer', border: statusFilter === 'pending' ? '1px solid var(--clr-warning)' : undefined }}
          onClick={() => setStatusFilter('pending')}
        >
          <div className="stats-card-icon amber">⏳</div>
          <div className="stats-card-value" style={{ color: 'var(--clr-warning)' }}>{countByStatus('pending')}</div>
          <div className="stats-card-label">Pending Review</div>
        </div>
        <div
          className="stats-card"
          style={{ cursor: 'pointer', border: statusFilter === 'accepted' ? '1px solid var(--clr-success)' : undefined }}
          onClick={() => setStatusFilter('accepted')}
        >
          <div className="stats-card-icon green">✅</div>
          <div className="stats-card-value" style={{ color: 'var(--clr-success)' }}>{countByStatus('accepted')}</div>
          <div className="stats-card-label">Accepted</div>
        </div>
        <div
          className="stats-card"
          style={{ cursor: 'pointer', border: statusFilter === 'rejected' ? '1px solid var(--clr-danger, #ef4444)' : undefined }}
          onClick={() => setStatusFilter('rejected')}
        >
          <div className="stats-card-icon red">❌</div>
          <div className="stats-card-value" style={{ color: 'var(--clr-danger, #ef4444)' }}>{countByStatus('rejected')}</div>
          <div className="stats-card-label">Not Selected</div>
        </div>
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <EmptyState
          title={statusFilter === 'all' ? 'No applications yet' : `No ${statusFilter} applications`}
          description={
            statusFilter === 'all'
              ? "You haven't submitted any job applications yet. Discover open roles and apply today!"
              : `You don't have any applications marked as ${statusFilter}.`
          }
          action={
            <Link to="/jobs" className="btn btn-primary">
              🔍 Explore Jobs
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(app => {
            const job = app.job || {};
            return (
              <div
                key={app._id}
                className="card"
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px 0' }}>
                      <Link to={`/jobs/${job._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {job.title || 'Untitled Job'}
                      </Link>
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--clr-text-secondary)', fontSize: 14 }}>
                      <span>🏢 {job.company || 'Unknown Company'}</span>
                      {job.location && <span>📍 {job.location}</span>}
                      {job.type && <span className="badge badge-blue">{job.type}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {getStatusBadge(app.status)}
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                    >
                      View Job →
                    </button>
                  </div>
                </div>

                {app.coverLetter && (
                  <div style={{ padding: '12px 14px', background: 'var(--clr-surface-2)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--clr-text-secondary)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--clr-text-primary)' }}>Cover Note: </span>
                    {app.coverLetter}
                  </div>
                )}

                {app.note && (
                  <div style={{ padding: '12px 14px', background: 'rgba(79, 125, 255, 0.08)', borderLeft: '3px solid var(--clr-primary)', borderRadius: 'var(--radius-md)', fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>Employer Feedback: </span>
                    {app.note}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--clr-text-muted)', paddingTop: 6, borderTop: '1px solid var(--clr-border)' }}>
                  <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                  {app.reviewedAt && (
                    <span>Reviewed on {new Date(app.reviewedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
