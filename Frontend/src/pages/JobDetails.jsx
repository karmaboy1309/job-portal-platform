import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobById } from '../services/jobService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || err.message || 'Failed to load job');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: 16 }}>Back to Jobs</button>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {job && (
        <div style={{ background: '#fff', padding: 20, borderRadius: 8 }}>
          <h2>{job.title}</h2>
          <p><strong>Company:</strong> {job.company}</p>
          {job.location && <p><strong>Location:</strong> {job.location}</p>}
          <p><strong>Salary:</strong> {job.salary}</p>
          <div style={{ marginTop: 12 }}>
            <h4>Description</h4>
            <p style={{ whiteSpace: 'pre-wrap', color: '#333' }}>{job.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
