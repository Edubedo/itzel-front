import axios from "axios";

export interface Notificacion {
  id: number;
  mensaje: string;
  area: string;
  sucursal: string;
  leida: boolean;
  fecha: string;
  servicio?: string;
}

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

/**
 * Trae todas las notificaciones filtradas por uk_usuario
 */
export async function getNotificaciones(uk_usuario: string): Promise<Notificacion[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/operaciones/turnos/notificaciones?uk_usuario=${uk_usuario}`);
    const data = await response.json();
    return data.notificaciones || [];
  } catch (error) {
    console.error("Error al traer notificaciones:", error);
    return [];
  }
}

/**
 * Marca una notificación como leída
 */
export async function marcarComoLeida(id: number): Promise<void> {
  try {
    await api.put(`/operaciones/turnos/notificaciones/${id}/leer`);
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    throw error;
  }
}
