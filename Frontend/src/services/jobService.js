import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";

export const getJobs = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getJobById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export const createJob = async (jobData) => {
  const res = await axios.post(API_URL, jobData);
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
