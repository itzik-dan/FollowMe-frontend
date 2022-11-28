import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://followme-api.onrender.com",
});
