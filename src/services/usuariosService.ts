import axios from 'axios';

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

export interface Usuario {
  ck_usuario: string;
  s_nombre: string;
  s_apellido_paterno?: string;
  s_apellido_materno?: string;
  s_correo_electronico: string;
  s_telefono?: string;
  s_foto?: string;
  i_tipo_usuario: number;
  ck_estatus: string;
  d_fecha_nacimiento?: string;
  s_rfc?: string;
  s_curp?: string;
  s_domicilio?: string;
}

export interface UsuarioFormData {
  s_nombre: string;
  s_apellido_paterno?: string;
  s_apellido_materno?: string;
  s_correo_electronico: string;
  s_telefono?: string;
  s_password?: string;
  i_tipo_usuario: number;
  ck_estatus: string;
  d_fecha_nacimiento?: string;
  s_rfc: string;
  s_curp: string;
  s_domicilio: string;
  s_foto?: File;
}

export interface UsuariosResponse {
  success: boolean;
  data: {
    usuarios: Usuario[];
    pagination: {
      total: number;
      currentPage: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface UsuarioStatsResponse {
  success: boolean;
  data: {
    total: number;
    activos: number;
    inactivos: number;
    porTipo: {
      administradores: number;
      ejecutivos: number;
      asesores: number;
    };
  };
}

export const usuariosService = {
  // Obtener todos los usuarios con filtros y paginación
  async getAllUsuarios(params: {
    page?: number;
    limit?: number;
    search?: string;
    tipo_usuario?: string;
    estatus?: string;
  } = {}): Promise<UsuariosResponse> {
    try {
      const response = await api.get('/catalogos/usuarios', { params });
      console.log("response.data: ", response.data)
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  // Obtener usuario por ID
  async getUsuarioById(id: string): Promise<{ success: boolean; data: Usuario }> {
    try {
      const response = await api.get(`/catalogos/usuarios/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  },

  // Crear nuevo usuario
  async createUsuario(userData: UsuarioFormData): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      
      // Agregar todos los campos al FormData
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 's_foto' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await api.post('/catalogos/usuarios', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  },

  // Actualizar usuario
  async updateUsuario(id: string, userData: UsuarioFormData): Promise<{ success: boolean; message: string }> {
    try {
      const formData = new FormData();
      
      // Agregar todos los campos al FormData
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 's_foto' && value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await api.put(`/catalogos/usuarios/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  },

  // Eliminar usuario (soft delete)
  async deleteUsuario(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/catalogos/usuarios/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  },

  // Obtener estadísticas de usuarios
  async getUsuariosStats(): Promise<UsuarioStatsResponse> {
    try {
      const response = await api.get('/catalogos/usuarios/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
    }
  },

  // Obtener URL de imagen
  getImageUrl(filename: string): string {
    if (!filename) return '';
    return `${API_BASE_URL.replace('/api', '')}/usuarios/${filename}`;
  }
}; 