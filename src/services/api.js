import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", // correct backend port
});

// GET SALES WITH QUERY PARAMS
export const getSales = async (params) => {
  const response = await API.get("/sales", { params });
  return response.data;
};
