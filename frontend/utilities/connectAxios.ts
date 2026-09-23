import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Attach the JWT token to authenticated API requests.
 *
 * The token is stored by LoginPage after successful authentication.
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface ErrorResponse {
  error?: string;
}

export default api;