import React, { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../services/jobService";
import JobCard from "../components/JobCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || err.message || 'Failed to load jobs');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Failed to delete job');
    }
  };

  return (
    <div className="job-list-container">
      <h2>Available Jobs</h2>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading && <LoadingSpinner />}

      {!loading && jobs.length === 0 && (
        <EmptyState title="No jobs found" description="No job postings available. Create one!" />
      )}

      <div className="job-grid">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default JobList;
