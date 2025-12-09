import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // correct backend port
});

// GET SALES WITH QUERY PARAMS
export const getSales = async (params) => {
  const response = await API.get("/sales", { params });
  return response.data;
};
