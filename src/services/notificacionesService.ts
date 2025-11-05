import axios from "axios";
import { getApiBaseUrlWithApi } from '../../utils/util_baseUrl';

export interface Notificacion {
  id: number;
  mensaje: string;
  area: string;
  sucursal: string;
  sucursalId?: string;
  leida: boolean;
  fecha: string;
  servicio?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || getApiBaseUrlWithApi();

// Configurar axios con interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='))
      ?.split('=')[1];

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Trae todas las notificaciones filtradas por uk_usuario y sucursal
 */
export async function getNotificaciones(uk_usuario: string, ck_sucursal?: string): Promise<Notificacion[]> {
  try {
    const params = new URLSearchParams();
    params.append('uk_usuario', uk_usuario);
    if (ck_sucursal) params.append('ck_sucursal', ck_sucursal);

    const response = await fetch(`${API_BASE_URL}/operaciones/turnos/notificaciones?${params.toString()}`);
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
    await api.put(`/operaciones/turnos/leer/${id}`);
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    throw error;
  }
}
