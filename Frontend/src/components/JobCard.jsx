import React from "react";

const JobCard = ({ job, onDelete }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p><strong>Company:</strong> {job.company}</p>
      <p><strong>Salary:</strong> {job.salary}</p>

      <div className="job-card-actions">
        <button className="delete-btn" onClick={() => onDelete(job._id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
