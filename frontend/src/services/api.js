const API_URL = "http://localhost:5000/api";

export const api = {
  // Auth
  register: (data) => fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json()),

  login: (data) => fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json()),

  getCurrentUser: (token) => fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json()),

  // Users
  getUsers: (token) => fetch(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json()),

  createUser: (data, token) => fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()),

  updateUser: (id, data, token) => fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()),

  deleteUser: (id, token) => fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json()),

  updateUserRole: (id, role, token) => fetch(`${API_URL}/users/${id}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  }).then((res) => res.json()),

  // Categories
  getCategories: () => fetch(`${API_URL}/categories`).then((res) => res.json()),

  createCategory: (data, token) => fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()),

  updateCategory: (id, data, token) => fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()),

  deleteCategory: (id, token) => fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json()),

  // Products
  getProducts: () => fetch(`${API_URL}/products`).then((res) => res.json()),

  createProduct: (data, token) => fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()),

  updateProduct: (id, data, token) => fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json()),

  deleteProduct: (id, token) => fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => res.json()),
  // Password reset
  forgotPassword: (data) => fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json()),

  resetPassword: (data) => fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json()),
};
