import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_URL = `${API_BASE_URL}/sucursales`;

export const sucursalesService = {
  createSucursal: async (data: any) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },
  getSucursales: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
};
