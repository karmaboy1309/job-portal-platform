import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

export const getJobs = async (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((k) => {
    if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
      searchParams.append(k, params[k]);
    }
  });

  const url = `${API_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const res = await axios.get(url);
  return res.data; // { data, total, page, pages }
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

export const getStats = async () => {
  const res = await axios.get(`${API_URL}/stats`);
  return res.data;
};

export const applyJob = async (id, payload = {}) => {
  const res = await axios.post(`${API_URL}/${id}/apply`, payload);
  return res.data;
};
