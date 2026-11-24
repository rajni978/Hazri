
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function registerStudent(userData) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Keep the token for the current browser tab session.
  sessionStorage.setItem('hazri-token', data.token);
  sessionStorage.setItem('hazri-user', JSON.stringify(data.user));

  return data;
}

export function logoutUser() {
  sessionStorage.removeItem('hazri-token');
  sessionStorage.removeItem('hazri-user');
}

export function getCurrentUser() {
  const user = sessionStorage.getItem('hazri-user');
  return user ? JSON.parse(user) : null;
}

export function getToken() {
  return sessionStorage.getItem('hazri-token');
}
