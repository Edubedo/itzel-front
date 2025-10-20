// src/services/turnosService.ts
// services/turnosService.ts







export const turnosService = {
  getTurnosDelDia: async () => {
    try {
      const response = await fetch("http://localhost:3001/api/operaciones/turnos/estadisticas/hoy");

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      // Suponemos que el backend responde con un objeto tipo:
      // { success: true, data: { total: number } }

      return {
        success: data.success,
        data: {
          total: data?.data?.total_turnos ?? 0,
        },
      };
    } catch (error) {
      console.error("Error en getTurnosDelDia:", error);
      return { success: false, data: { total: 0 } };
    }
  },

  getEstadisticasMensuales: async (sucursalId?: string) => {
  try {
    let url = "http://localhost:3001/api/operaciones/turnos/estadisticas-mensuales";
    if (sucursalId) {
      url += `?ck_sucursal=${sucursalId}`; // 👈 Asegúrate de que coincida con lo que espera el backend
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");

    const data = await response.json();

    return {
      success: data.success,
      data: data.data ?? [], // ✅ aquí estaba el error
    };
  } catch (error) {
    console.error("Error en getEstadisticasMensuales:", error);
    return { success: false, data: [] };
  }
}

};


