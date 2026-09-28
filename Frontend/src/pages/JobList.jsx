import React, { useEffect, useState } from 'react';
import { getJobs, deleteJob, getSavedJobIds } from '../services/jobService';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

const SAMPLE_JOBS = [
  { _id: 's1', title: 'Frontend Developer', company: 'Acme Corp', location: 'Remote', salary: 80000, description: 'Build beautiful, performant React UIs. Collaborate with designers and backend engineers.' },
  { _id: 's2', title: 'Backend Engineer', company: 'DataWorks', location: 'New York', salary: 95000, description: 'Design scalable APIs and distributed systems. Experience with Node.js and PostgreSQL preferred.' },
  { _id: 's3', title: 'Product Designer', company: 'StudioX', location: 'San Francisco', salary: 90000, description: 'Craft exceptional user experiences from wireframe to pixel-perfect prototype.' },
  { _id: 's4', title: 'DevOps Engineer', company: 'CloudScale', location: 'Austin', salary: 105000, description: 'Own our cloud infrastructure on AWS. Implement CI/CD pipelines and Kubernetes clusters.' },
  { _id: 's5', title: 'Data Scientist', company: 'InsightAI', location: 'Boston', salary: 115000, description: 'Build predictive models and data pipelines that power our ML-driven features.' },
  { _id: 's6', title: 'iOS Developer', company: 'AppForge', location: 'Remote', salary: 98000, description: 'Develop and ship high-quality iOS applications using Swift and SwiftUI.' },
];

const FILTER_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Remote'];

const JobList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [savedIds, setSavedIds] = useState(() => getSavedJobIds());
  const [onlySaved, setOnlySaved] = useState(false);

  useEffect(() => {
    fetchJobs();
    const handleSavedChange = () => setSavedIds(getSavedJobIds());
    window.addEventListener('savedJobsUpdated', handleSavedChange);
    return () => window.removeEventListener('savedJobsUpdated', handleSavedChange);
  }, []);

  const fetchJobs = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getJobs();
      setJobs(data?.data || data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      setJobs(prev => prev.filter(job => job._id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to delete job');
    }
  };

  const displayJobs = (jobs.length > 0 ? jobs : (error ? SAMPLE_JOBS : []));
  const filtered = displayJobs.filter(j => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || [j.title, j.company, j.location, j.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(term);

    const jobType = j.type || 'Full-time';
    const matchesType = selectedType === 'All'
      ? true
      : selectedType === 'Remote'
        ? (j.location && j.location.toLowerCase().includes('remote'))
        : jobType.toLowerCase() === selectedType.toLowerCase();

    const matchesSaved = !onlySaved || savedIds.includes(j._id);

    return matchesSearch && matchesType && matchesSaved;
  });

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="jobs-page-header">
        <div>
          <h1 className="page-title">Browse <span>Jobs</span></h1>
          <p className="jobs-count">
            {loading ? 'Loading…' : `${filtered.length} opportunities available`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>
          ✨ Post a Job
        </button>
      </div>

      {/* Search bar */}
      <div className="search-filter-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search jobs, companies, locations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)', fontSize: 14 }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <button className="btn btn-secondary" onClick={fetchJobs}>
          🔄 Refresh
        </button>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        {FILTER_TYPES.map(type => {
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`badge ${isActive ? 'badge-blue' : ''}`}
              style={{
                padding: '7px 14px',
                cursor: 'pointer',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: 600,
                border: isActive
                  ? '1px solid var(--clr-primary)'
                  : '1px solid var(--clr-border)',
                background: isActive
                  ? 'rgba(79, 125, 255, 0.18)'
                  : 'var(--clr-surface-2)',
                color: isActive
                  ? 'var(--clr-primary-light)'
                  : 'var(--clr-text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              {type === 'Remote' ? '🌍 Remote' : type}
            </button>
          );
        })}

        {/* Saved Jobs filter toggle */}
        <button
          type="button"
          onClick={() => setOnlySaved(!onlySaved)}
          className={`badge ${onlySaved ? 'badge-amber' : ''}`}
          style={{
            marginLeft: 'auto',
            padding: '7px 14px',
            cursor: 'pointer',
            borderRadius: 'var(--radius-full)',
            fontSize: 13,
            fontWeight: 600,
            border: onlySaved ? '1px solid var(--clr-warning, #f59e0b)' : '1px solid var(--clr-border)',
            background: onlySaved ? 'rgba(245, 158, 11, 0.2)' : 'var(--clr-surface-2)',
            color: onlySaved ? 'var(--clr-warning, #f59e0b)' : 'var(--clr-text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          {onlySaved ? '🔖 Saved Only' : '🔖 Saved'} ({savedIds.length})
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div style={{ marginBottom: 20 }}>
          <ErrorMessage>
            {error} — Showing sample listings below.
          </ErrorMessage>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner text="Finding the best jobs for you…" />}

      {/* Empty */}
      {!loading && filtered.length === 0 && !error && (
        <EmptyState
          title="No jobs found"
          description={search ? `No results for "${search}". Try a different keyword.` : 'No job postings available yet. Be the first to create one!'}
          action={
            <button className="btn btn-primary" onClick={() => navigate('/create')}>
              ✨ Post First Job
            </button>
          }
        />
      )}

      {/* Job grid */}
      {!loading && filtered.length > 0 && (
        <div className="jobs-grid">
          {filtered.map(job => (
            <JobCard key={job._id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
