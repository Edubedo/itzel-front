// src/services/dashboardService.ts

import axios from "axios";
import { ServicioStatsResponse } from "./serviciosService"; // ✅ usar tipos existentes
import { getApiBaseUrlWithApi } from '../../utils/util_baseUrl';

const API_URL = import.meta.env.VITE_API_URL || getApiBaseUrlWithApi();

export interface DashboardResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}


export const dashboardService = {



    // 📊 2. Turnos emitidos hoy agrupados por área
  getTurnosPorAreaHoy: async (): Promise<
    DashboardResponse<{
      labels: string[];
      series: { name: string; data: number[] }[];
    }>
  > => {
    try {
      const res = await axios.get(`${API_URL}/operaciones/turnos/por-area/hoy`);
      return { success: true, data: res.data.data };
    } catch (error: any) {
      console.error("Error en getTurnosPorAreaHoy:", error);
      return { success: false, data: { labels: [], series: [] }, message: error.message };
    }
  },


  
  // 📊 1. Estadísticas de turnos del día
  getTurnosDelDia: async (): Promise<DashboardResponse<number>> => {
    try {
      const res = await axios.get(`${API_URL}/operaciones/turnos/estadisticas/hoy`);
      const total = Number(res.data.data.total) || 0; // 👈 convierte el string a número
      return { success: true, data: total };
    } catch (error: any) {
      console.error("Error en getTurnosDelDia:", error);
      return { success: false, data: 0, message: error.message };
    }
  },

 

 getServiciosMensuales: async (): Promise<ServicioStatsResponse> => {
    try {
      const res = await axios.get(`${API_URL}/operaciones/servicios-mensuales`);
      return { success: true, data: res.data.data };
    } catch (error: any) {
      console.error("Error en getServiciosMensuales:", error);
      return {
        success: false,
        data: {
          labels: [],
          series: []
        },
        message: error.message
      };
    }
  },

  

  // 📊 3. Clientes registrados hoy
  getClientesDelDia: async (): Promise<DashboardResponse<number>> => {
    try {
      const res = await axios.get(`${API_URL}/operaciones/clientes/del-dia`);
      return { success: true, data: res.data.data.total };
    } catch (error: any) {
      console.error("Error en getClientesDelDia:", error);
      return { success: false, data: 0, message: error.message };
    }
  },

  getEstadisticasMensuales: async (): Promise<ServicioStatsResponse> => {
    try {
      const res = await axios.get(`${API_URL}/operaciones/turnos/estadisticas-mensuales`);
      return { success: true, data: res.data.data };
    } catch (error: any) {
      console.error("Error en getServiciosMensuales:", error);
      return {
        success: false,
        data: {
          labels: [],
          series: []
        },
        message: error.message
      };
    }
  },


    // 📊 4. Turnos atendidos y cancelados por día
  getTurnosAtendidosCanceladosPorDia: async (): Promise<
    DashboardResponse<{
      labels: string[];
      series: { name: string; data: number[] }[];
    }>
  > => {
    try {
      const res = await axios.get(`${API_URL}/operaciones/turnos/atendidos-cancelados-dia`);
      return { success: true, data: res.data.data };
    } catch (error: any) {
      console.error("Error en getTurnosAtendidosCanceladosPorDia:", error);
      return { success: false, data: { labels: [], series: [] }, message: error.message };
    }
  },


 
};

export default dashboardService;
