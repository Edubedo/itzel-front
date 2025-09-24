import axios from "axios";

const API_URL = "http://localhost:3000/api/servicios"; // 👈 cambia esto según tu backend



// Tipos de datos
export interface Servicio {
  id: string;
  s_servicio: string;
  s_descripcion_servicio?: string;
  c_codigo_servicio: string;
  ck_area: string; // id del área relacionada
  ck_estatus: "ACTIVO" | "INACTIVO";
}

export interface ServicioFormData {
  s_servicio: string;
  s_descripcion_servicio?: string;
  c_codigo_servicio: string;
  ck_area: string;
  ck_estatus: "ACTIVO" | "INACTIVO";
}




export const serviciosService = {
  // Obtener todos los servicios
 // serviciosService.ts
  async getAllServicios(params?: { page?: number; limit?: number; search?: string; estatus?: string; area?: string }) {
    try {
      const res = await axios.get(API_URL, { params });
      return { 
      success: true, 
      data: res.data.items as Servicio[], // 👈 ahora sí son los items
      total: res.data.total 
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
},

  // Crear servicio
  async createServicio(data: ServicioFormData) {
    try {
      const res = await axios.post(API_URL, data);
      return { success: true, data: res.data as Servicio };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  // Actualizar servicio
  async updateServicio(id: string, data: ServicioFormData) {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return { success: true, data: res.data as Servicio };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  // Eliminar servicio
  async deleteServicio(id: string) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },
};
