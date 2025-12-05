import React, { useState } from "react";
import { createJob } from "../services/jobService";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    salary: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createJob(formData);
      alert("Job created successfully!");
      navigate("/"); // back to job list
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="create-job-container">
      <h2>Create New Job</h2>

      <form className="job-form" onSubmit={handleSubmit}>
        <label>Job Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Company</label>
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <label>Salary</label>
        <input
          type="number"
          name="salary"
          placeholder="e.g. 1500000"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter job details"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <button type="submit" className="create-btn">
          Create Job
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
