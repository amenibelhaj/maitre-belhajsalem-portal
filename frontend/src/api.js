import axios from "axios";

const api = axios.create({
   baseURL: "http://localhost:5000/api", 
});


api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const getClients = () => api.get("/clients");
export const getCases = () => api.get("/cases");

export default api;
