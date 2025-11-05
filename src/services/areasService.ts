import axios from 'axios';
import { getApiBaseUrlWithApi } from '../../utils/util_baseUrl';

const API_BASE_URL = import.meta.env.VITE_API_URL || getApiBaseUrlWithApi();

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

export interface Area {
  ck_area: string;
  c_codigo_area: string;
  s_area: string;
  s_descripcion_area: string;
  ck_estatus: string;
  ck_sucursal: string;
  sucursal_nombre?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AreaStats {
  total: number;
  activas: number;
  inactivas: number;
  porSucursal: {
    [key: string]: number;
  };
}

export interface AreasResponse {
  success: boolean;
  data: {
    areas: Area[];
    pagination: {
      total: number;
      currentPage: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface AreaFormData {
  c_codigo_area: string;
  s_area: string;
  s_descripcion_area: string;
  ck_sucursal: string;
  ck_estatus: string;
}

export interface Sucursal {
  s_nombre_sucursal: string;
  ck_sucursal: string;
  s_nombre: string;
}

export const areasService = {
  // Obtener todas las áreas con filtros y paginación
  async getAllAreas(params: {
    page?: number;
    limit?: number;
    search?: string;
    ck_estatus?: string;
    ck_sucursal?: string;
  } = {}): Promise<AreasResponse> {
    try {
      const response = await api.get('/catalogos/areas', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener áreas');
    }
  },

  // Obtener área por ID
  async getAreaById(id: string): Promise<{ success: boolean; data: Area }> {
    try {
      const response = await api.get(`/catalogos/areas/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener área');
    }
  },

  // Crear nueva área
  async createArea(areaData: AreaFormData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/catalogos/areas', areaData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear área');
    }
  },

  // Actualizar área
  async updateArea(id: string, areaData: AreaFormData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.put(`/catalogos/areas/${id}`, areaData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar área');
    }
  },

  // Eliminar área
  async deleteArea(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/catalogos/areas/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar área');
    }
  },

  // Obtener estadísticas de áreas
  async getAreasStats(): Promise<{ success: boolean; data: AreaStats }> {
    try {
      const response = await api.get('/catalogos/areas/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  // Obtener sucursales
  async getSucursales(): Promise<{ success: boolean; data: Sucursal[] }> {
    try {
      const response = await api.get('/catalogos/areas/sucursales');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener sucursales');
    }
  },

  // NUEVO MÉTODO: Obtener todas las áreas sin paginación (para dropdowns)
  async getAreas(): Promise<{ success: boolean; data: Area[] }> {
    try {
      const response = await api.get('/catalogos/areas/list');
      return response.data;
    } catch (error: any) {
      // Si el endpoint no existe, usar getAllAreas con límite alto
      try {
        const response = await api.get('/catalogos/areas', { 
          params: { limit: 1000 } 
        });
        return {
          success: true,
          data: response.data.data?.areas || response.data.data || []
        };
      } catch (fallbackError: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener áreas');
      }
    }
  }
};