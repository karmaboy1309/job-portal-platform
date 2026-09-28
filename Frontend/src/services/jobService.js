import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

// Fetch jobs with optional filters: search, type, location, minSalary, maxSalary
export const getJobs = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
      searchParams.append(k, params[k]);
    }
  });

  const url = `${API_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const res = await axios.get(url);
  return res.data; // { data, total }
};

export const getJobById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createJob = async (jobData) => {
  // backend expects POST to /api/jobs/create
  const res = await axios.post(`${API_URL}/create`, jobData);
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const updateJob = async (id, jobData) => {
  const res = await axios.put(`${API_URL}/${id}`, jobData);
  return res.data;
};

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/stats`);
  return res.data;
};

export const applyJob = async (id, payload = {}) => {
  const res = await axios.post(`${API_URL}/${id}/apply`, payload);
  return res.data;
};

export const getMyApplications = async () => {
  const res = await axios.get(`${API_URL}/my-applications`);
  return res.data;
};

export const getJobApplications = async (jobId) => {
  const res = await axios.get(`${API_URL}/${jobId}/applications`);
  return res.data;
};

export const updateApplicationStatus = async (jobId, appId, { status, note }) => {
  const res = await axios.patch(`${API_URL}/${jobId}/applications/${appId}`, { status, note });
  return res.data;
};

// Local bookmark helpers
export const getSavedJobIds = () => {
  try {
    return JSON.parse(localStorage.getItem('savedJobs') || '[]');
  } catch {
    return [];
  }
};

export const isJobSaved = (jobId) => {
  return getSavedJobIds().includes(jobId);
};

export const toggleSaveJob = (jobId) => {
  const saved = getSavedJobIds();
  const exists = saved.includes(jobId);
  const updated = exists ? saved.filter(id => id !== jobId) : [...saved, jobId];
  localStorage.setItem('savedJobs', JSON.stringify(updated));
  window.dispatchEvent(new Event('savedJobsUpdated'));
  return !exists;
};

// Convenience helper: fetch only jobs within a salary range
export const getJobsBySalary = async (minSalary, maxSalary, extraParams = {}) => {
  return getJobs({ ...extraParams, minSalary, maxSalary });
};
