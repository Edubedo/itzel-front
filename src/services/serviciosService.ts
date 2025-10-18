import axios from "axios";

const API_URL = "http://localhost:3001/api";

// Tipos de datos
export interface Servicio {
  ck_servicio: string;
  s_servicio: string;
  s_descripcion_servicio?: string;
  c_codigo_servicio: string;
  ck_area: string; // id del área relacionada
  ck_estatus: "ACTIVO" | "INACTI";
  area_nombre?: string; // nombre del área para mostrar
  i_es_para_clientes: number;
}

export interface ServicioFormData {
  s_servicio: string;
  s_descripcion_servicio?: string;
  c_codigo_servicio: string;
  ck_area: string;
  ck_estatus: "ACTIVO" | "INACTI";
  i_es_para_clientes: number;
}

// Interfaces nuevas
export interface ServicioEstadistica {
  name: string;
  data: number[];
}

export interface ServicioStatsResponse {
  success: boolean;
  data?: {
    labels: string[];
    series: ServicioEstadistica[];
  };
  message?: string;
}

export interface ServiciosResponse {
  success: boolean;
  data: Servicio[];
  total?: number;
  message?: string;
}

export const serviciosService = {
  // Obtener todos los servicios
  async getAllServicios(params?: {
    page?: number;
    limit?: number;
    search?: string;
    estatus?: string;
    area?: string
  }): Promise<ServiciosResponse> {
    try {
      const res = await axios.get(`${API_URL}/catalogos/servicios`, { params });
      return {
        success: true,
        data: res.data.getServicios || res.data.data || res.data,
        total: res.data.total
      };
    } catch (error: any) {
      console.error("Error en getAllServicios:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: []
      };
    }
  },

  // Obtener servicio por ID 
  async getServicioById(id: string): Promise<{ success: boolean; data: Servicio; message?: string }> {
    try {
      const res = await axios.get(`${API_URL}/catalogos/servicios/${id}`);
      return {
        success: true,
        data: res.data.data || res.data
      };
    } catch (error: any) {
      console.error("Error en getServicioById:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: {} as Servicio
      };
    }
  },

  // Crear servicio
  async createServicio(data: ServicioFormData): Promise<{ success: boolean; data: Servicio; message?: string }> {
    try {
      const res = await axios.post(`${API_URL}/catalogos/servicios`, data);
      return {
        success: true,
        data: res.data.data || res.data
      };
    } catch (error: any) {
      console.error("Error en createServicio:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: {} as Servicio
      };
    }
  },

  // Actualizar servicio
  async updateServicio(id: string, data: ServicioFormData): Promise<{ success: boolean; data: Servicio; message?: string }> {
    try {
      const res = await axios.put(`${API_URL}/catalogos/servicios/${id}`, data);
      return {
        success: true,
        data: res.data.data || res.data
      };
    } catch (error: any) {
      console.error("Error en updateServicio:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: {} as Servicio
      };
    }
  },

  // Eliminar servicio
  async deleteServicio(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      await axios.delete(`${API_URL}/catalogos/servicios/${id}`);
      return { success: true };
    } catch (error: any) {
      console.error("Error en deleteServicio:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  },

  // Obtener estadísticas de servicios mensuales
  async getServicioStatsMensual(): Promise<ServicioStatsResponse> {
    try {
      const res = await axios.get(`${API_URL}/operaciones/turnos/servicios-mensual`);
      return {
        success: true,
        data: res.data.data,
      };
    } catch (error: any) {
      console.error("Error en getServicioStatsMensual:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }
};