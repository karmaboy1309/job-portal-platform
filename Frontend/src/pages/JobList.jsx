import React, { useEffect, useState } from 'react';
import { getJobs, deleteJob } from '../services/jobService';
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

const JobList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchJobs();
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
  const filtered = search.trim()
    ? displayJobs.filter(j =>
      [j.title, j.company, j.location].join(' ')
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    : displayJobs;

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
        </div>
        <button className="btn btn-secondary" onClick={fetchJobs}>
          🔄 Refresh
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
