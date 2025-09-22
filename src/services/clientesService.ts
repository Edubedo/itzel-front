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
  s_descripcion?: string;
}

export interface ClienteStats {
  totalClientes: number;
  clientesActivos: number;
  clientesInactivos: number;
  clientesPremium: number;
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

// Servicio actualizado
export const clientesService = {
  async getAllClientes(params?: any): Promise<ClientesResponse> {
    try {
      const queryParams = params ? `?${new URLSearchParams(params)}` : '';
      const response = await fetch(`/api/clientes${queryParams}`);
      return await response.json();
    } catch (error) {
      throw new Error('Error al cargar clientes');
    }
  },

  async getClientesStats(): Promise<ClientesStatsResponse> {
    try {
      const response = await fetch('/api/clientes/stats');
      return await response.json();
    } catch (error) {
      throw new Error('Error al cargar estadísticas');
    }
  },

  async getTiposContrato(): Promise<TiposContratoResponse> {
    try {
      const response = await fetch('/api/clientes/tipos-contrato');
      return await response.json();
    } catch (error) {
      throw new Error('Error al cargar tipos de contrato');
    }
  },

  async deleteCliente(clienteId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`/api/clientes/${clienteId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      throw new Error('Error al inactivar cliente');
    }
  },
};