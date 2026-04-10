import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4040/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── AUTH ──────────────────────────────────────────────────────────────────────
export const registerMainAdmin = (data) => API.post('/auth/register-main-admin', data);
export const loginAdmin = (data) => API.post('/auth/login', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);

// ─── MAIN ADMIN ────────────────────────────────────────────────────────────────
export const createLocalAdmin = (data) => API.post('/main-admin/create-local-admin', data);
export const getLocalAdmins = () => API.get('/main-admin/local-admins');
export const updateLocalAdmin = (id, data) => API.put(`/main-admin/local-admin/${id}`, data);
export const deleteLocalAdmin = (id) => API.delete(`/main-admin/local-admin/${id}`);

// ─── LOCAL ADMIN ───────────────────────────────────────────────────────────────
export const getLocalAdminProfile = () => API.get('/local-admin/profile');
export const updateLocalAdminProfile = (data) => API.put('/local-admin/profile', data);
export const deleteLocalAdminAccount = () => API.delete('/local-admin/delete-account');

// ─── PROPOSALS ─────────────────────────────────────────────────────────────────
export const createProposal = (data) => API.post('/proposals/create', data);
export const getMyProposals = () => API.get('/proposals/my-proposals');
export const getAllProposals = () => API.get('/proposals/all');
export const getProposalById = (id) => API.get(`/proposals/${id}`);

// ─── VOTES ─────────────────────────────────────────────────────────────────────
export const castVote = (proposalId, data) => API.post(`/votes/${proposalId}`, data);
export const getProposalVotes = (proposalId) => API.get(`/votes/proposal/${proposalId}`);

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const getMyNotifications = () => API.get('/notifications/my');
export const markNotificationRead = (id) => API.put(`/notifications/read/${id}`);
export const deleteNotification = (id) => API.delete(`/notifications/delete/${id}`);

// ─── TRANSACTIONS ──────────────────────────────────────────────────────────────
export const createPayout = (proposalId) => API.post(`/transactions/payout/${proposalId}`);
export const getAllTransactions = () => API.get('/transactions/all');
export const getMyTransactions = () => API.get('/transactions/my-transactions');

export default API;
