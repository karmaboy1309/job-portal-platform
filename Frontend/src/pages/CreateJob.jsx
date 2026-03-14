import React, { useState } from "react";
import { createJob } from "../services/jobService";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const CreateJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    salary: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // basic client-side validation for salary and required location
    const salaryNumber = Number(formData.salary);
    if (Number.isNaN(salaryNumber)) {
      setError('Salary must be a number');
      return;
    }

    if (!formData.location || formData.location.trim() === '') {
      setError('Location is required');
      return;
    }

    const payload = { ...formData, salary: salaryNumber };

    try {
      setLoading(true);
      await createJob(payload);
      setLoading(false);
      navigate("/"); // back to job list
    } catch (err) {
      console.error(err);
      setLoading(false);
      const msg = err?.response?.data?.message || err.message || 'Failed to create job';
      setError(msg);
    }
  };

  return (
    <div className="create-job-container">
      <h2>Create New Job</h2>

      <form className="job-form" onSubmit={handleSubmit}>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading && <LoadingSpinner />}
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

        <label>Location</label>
        <input
          type="text"
          name="location"
          placeholder="City, Remote, etc."
          value={formData.location}
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

        <button type="submit" className="create-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
};

export default CreateJob;
