// services/clientesService.ts
export interface Cliente {
  ck_cliente: string;
  c_codigo_cliente: string;
  s_nombre: string;
  s_apellido_paterno: string;
  s_apellido_materno: string;
  s_tipo_contrato: string;
  s_domicilio: string;
  s_description_cliente?: string;
  l_cliente_premium: boolean;
  ck_estatus: string;
  c_codigo_contrato?: string;
}

export interface TipoContrato {
  s_tipo_contrato: string;
}

export interface ClienteStats {
  totalClientes: number;
  clientesActivos: number;
  clientesInactivos: number;
  clientesPremium: number;
  porTipoContrato?: { [key: string]: number };
}

export interface ClientesResponse {
  success: boolean;
  data?: {
    clientes: Cliente[];
    pagination?: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      hasNext?: boolean;
      hasPrev?: boolean;
    };
  };
  message?: string;
}

export interface ClientesStatsResponse {
  success: boolean;
  data?: ClienteStats;
  message?: string;
}

export interface TiposContratoResponse {
  success: boolean;
  data?: TipoContrato[];
  message?: string;
}

// Servicio actualizado para conectar con el backend
export const clientesService = {
  async getAllClientes(params?: any): Promise<ClientesResponse> {
    try {
      // Construir query parameters
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
            queryParams.append(key, params[key].toString());
          }
        });
      }
      
      const url = `/api/catalogos/clientes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('Fetching clientes from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Clientes response:', data);
      return data;
      
    } catch (error) {
      console.error('Error en getAllClientes:', error);
      throw new Error('Error al cargar clientes');
    }
  },

  async getClientesStats(): Promise<ClientesStatsResponse> {
    try {
      const response = await fetch('/api/catalogos/clientes/stats');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getClientesStats:', error);
      throw new Error('Error al cargar estadísticas');
    }
  },

  async getTiposContrato(): Promise<TiposContratoResponse> {
    try {
      const response = await fetch('/api/catalogos/clientes/tipos-contrato');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getTiposContrato:', error);
      throw new Error('Error al cargar tipos de contrato');
    }
  },

  async deleteCliente(clienteId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`/api/catalogos/clientes/${clienteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en deleteCliente:', error);
      throw new Error('Error al inactivar cliente');
    }
  },

  // Métodos adicionales que puedes necesitar
  async getClienteById(clienteId: string): Promise<{ success: boolean; data?: Cliente; message?: string }> {
    try {
      const response = await fetch(`/api/catalogos/clientes/${clienteId}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en getClienteById:', error);
      throw new Error('Error al cargar cliente');
    }
  },

  async createCliente(clienteData: Omit<Cliente, 'ck_cliente'>): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
      const response = await fetch('/api/catalogos/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en createCliente:', error);
      throw new Error('Error al crear cliente');
    }
  },

  async updateCliente(clienteId: string, clienteData: Partial<Cliente>): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`/api/catalogos/clientes/${clienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en updateCliente:', error);
      throw new Error('Error al actualizar cliente');
    }
  },

  async getClientesDelDia(): Promise<{ success: boolean; data?: { total: number } }> {
    try {
      const response = await fetch('/api/operaciones/clientes/del-dia');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: data.success,
        data: {
          total: data?.total_clientes || 0,
        },
      };
    } catch (error) {
      console.error('Error en getClientesDelDia:', error);
      return { success: false, data: { total: 0 } };
    }
  }


};