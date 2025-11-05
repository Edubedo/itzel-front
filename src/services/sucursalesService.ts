import axios from "axios";
import { getApiBaseUrlWithApi } from '../../utils/util_baseUrl';

const API_BASE_URL = import.meta.env.VITE_API_URL || getApiBaseUrlWithApi();
const API_URL = `${API_BASE_URL}/catalogos/sucursales`;

export interface Estado {
  ck_estado: string;
  s_estado: string;
  s_descripcion_estado?: string;
  c_codigo_estado?: string;
}

export interface Municipio {
  ck_municipio: string;
  s_municipio: string;
  s_descripcion_municipio?: string;
  c_codigo_municipio?: string;
  ck_estado: string;
}

export interface SucursalData {
  ck_sucursal?: string;
  s_nombre_sucursal: string;
  s_domicilio: string;
  ck_municipio?: string;
  s_telefono?: string;
  s_codigo_postal?: string;
  ck_estatus?: string;
  ejecutivos?: number;
  asesores?: number;
  municipio?: {
    ck_municipio: string;
    s_municipio: string;
    estado?: {
      ck_estado: string;
      s_estado: string;
    }
  };
}

export interface SucursalFormData {
  s_nombre_sucursal: string;
  s_domicilio: string;
  ck_municipio: string;
  s_telefono?: string;
  s_codigo_postal?: string;
  ejecutivos?: Array<{
    ck_usuario: string;
    ck_area?: string;
    ck_servicio?: string;
  }>;
  asesores?: Array<{
    ck_usuario: string;
  }>;
}

export const sucursalesService = {
  // Obtener todos los estados
  getEstados: async () => {
    const response = await axios.get(`${API_URL}/estados`);
    return response.data;
  },

  // Obtener municipios por estado
  getMunicipiosByEstado: async (estadoId: string) => {
    const response = await axios.get(`${API_URL}/estados/${estadoId}/municipios`);
    return response.data;
  },

  // Crear nueva sucursal
  createSucursal: async (data: SucursalFormData) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  // Obtener todas las sucursales
  getSucursales: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Obtener sucursal por ID
  getSucursalById: async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Actualizar sucursal
  updateSucursal: async (id: string, data: SucursalFormData) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  // Eliminar sucursal
  deleteSucursal: async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};
