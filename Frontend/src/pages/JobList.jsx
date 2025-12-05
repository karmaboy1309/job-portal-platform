import React, { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../services/jobService";
import JobCard from "../components/JobCard";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  };

  const handleDelete = async (id) => {
    await deleteJob(id);
    setJobs(jobs.filter((job) => job._id !== id));
  };

  return (
    <div className="job-list-container">
      <h2>Available Jobs</h2>

      <div className="job-grid">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default JobList;
