import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getJobs, getSavedJobIds, toggleSaveJob } from '../services/jobService';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { BookmarkIcon } from '../components/Icons';
import { useToast } from '../context/ToastContext';

const SavedJobs = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      const savedIds = getSavedJobIds();
      if (savedIds.length === 0) {
        setSavedJobs([]);
        return;
      }
      const res = await getJobs();
      const allJobs = res?.data || res || [];
      const matched = allJobs.filter((j) => savedIds.includes(j._id));
      setSavedJobs(matched);
    } catch (err) {
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (jobId, title) => {
    toggleSaveJob(jobId);
    setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    toast.success(`Removed "${title || 'Job'}" from bookmarks`);
  };

  if (loading) return <LoadingSpinner text="Loading your bookmarked jobs…" />;

  return (
    <div className="page-wrapper">
      <div className="jobs-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ color: 'var(--clr-warning, #f59e0b)', display: 'inline-flex' }}>
              <BookmarkIcon size={24} fill="currentColor" />
            </span>
            <h1 className="page-title" style={{ margin: 0 }}>
              Saved <span>Jobs</span>
            </h1>
          </div>
          <p className="jobs-count">
            {savedJobs.length} role{savedJobs.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/jobs')}>
          ← Back to All Jobs
        </button>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs yet"
          description="Keep track of roles you're interested in by clicking the bookmark icon on any job listing."
          action={
            <Link to="/jobs" className="btn btn-primary">
              Explore Open Roles
            </Link>
          }
        />
      ) : (
        <div className="jobs-grid">
          {savedJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onDelete={() => handleRemove(job._id, job.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
