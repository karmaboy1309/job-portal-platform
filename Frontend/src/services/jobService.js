import axios from 'axios';

const API_URL = "http://localhost:5000/api/jobs"; // backend URL

export const getJobs = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const getJobById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
};

export const createJob = async (jobData) => {
  try {
    const res = await axios.post(API_URL, jobData);
    return res.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
