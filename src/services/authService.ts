import axios from 'axios';
import { LoginCredentials } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configurar axios con interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      document.cookie = 'authToken=; Max-Age=0; path=/';
      localStorage.removeItem('userData');
      if (window.location.pathname !== '/signin') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export interface LoginResponse {
  message: string;
  uk_usuario: string;
  s_nombre: string;
  s_usuario: string;
  s_correo_electronico: string;
  tipo_usuario: number;
  uk_cliente?: string;
  token: string;
}

export interface RegisterData {
  s_usuario: string;
  s_contrasena: string;
  s_correo_electronico: string;
  s_nombre: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Response login:', response.data);
      return response.data;
    } catch (error: any) {
      const errData = error.response?.data;
      const customError = new Error(errData?.message || 'Credenciales Incorrectas') as any;
      if (errData?.code) customError.code = errData.code;
      throw customError;
    }
  },

  async register(userData: RegisterData): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  },

  async refreshToken(token: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/refresh-token', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al refrescar token');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Log error but don't throw, logout should always succeed locally
      console.error('Error during logout:', error);
    }
  },

  async validateToken(token: string): Promise<any> {
    try {
      const response = await api.post('/auth/protected', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token inválido');
    }
  },

  async sendRecoveryCode(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'No se pudo enviar el código');
    }
  },

  async verifyRecoveryCode(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/verify-code', { email, code, newPassword });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Código incorrecto o error');
    }
  }

}; 