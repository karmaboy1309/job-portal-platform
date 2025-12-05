import React, { useEffect, useState } from "react";
import { getJobs, deleteJob } from "../services/jobService";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);
      setJobs(jobs.filter((job) => job._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="job-list">
      <h2>All Jobs</h2>
      {jobs.map((job) => (
        <div className="job-card" key={job._id}>
          <h3>{job.title}</h3>
          <p><b>Company:</b> {job.company}</p>
          <p><b>Salary:</b> {job.salary}</p>
          <button onClick={() => handleDelete(job._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default JobList;
