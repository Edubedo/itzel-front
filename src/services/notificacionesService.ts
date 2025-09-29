import axios from "axios";

export interface Notificacion {
  id: number;
  mensaje: string;
  area: string;
  sucursal: string;
  leida: boolean;
  fecha: string;
  servicio?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  area?: string;
  tipo: number; // 1=Admin, 2=Ejecutivo, 4=Asesor
  sucursal?: string;
}

/**
 * Trae todas las notificaciones filtradas según el tipo de usuario
 */
export async function getNotificaciones(usuario: Usuario): Promise<Notificacion[]> {
  try {
    const response = await axios.get("/api/notificaciones", {
      params: {
        rol: usuario.tipo,
        area: usuario.area || "",
        sucursal: usuario.sucursal || "",
      },
    });
    return response.data.notificaciones || [];
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
    await axios.put(`/api/turnos/notificaciones/${id}/leer`);
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    throw error;
  }
}
