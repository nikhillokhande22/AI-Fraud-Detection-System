import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8082",
  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = (data) => API.post("/api/auth/register", data);
export const loginUser = (data) => API.post("/api/auth/login", data);

export const createTransaction = (data) => API.post("/api/transactions", data);
export const getTransactions = () => API.get("/api/transactions");
export const getFraudTransactions = () => API.get("/api/transactions/fraud");

export const getDashboard = () => API.get("/admin/dashboard");
export const getRiskGraph = () => API.get("/admin/risk-graph");
export const getUsers = () => API.get("/admin/users");
export const blockUser = (id) => API.post(`/admin/users/${id}/block`);
export const unblockUser = (id) => API.post(`/admin/users/${id}/unblock`);

export default API;
