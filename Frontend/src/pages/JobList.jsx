import React, { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../services/jobService";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter(job => job._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div key={job._id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.company}</p>
          <p>{job.salary}</p>
          <button onClick={() => handleDelete(job._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default JobList;
