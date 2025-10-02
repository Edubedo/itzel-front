export async function getConfiguracion() {
  try {
    const res = await fetch('/api/configuracion_sistema/configuracion');
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Configuración obtenida:', data);
    return data;
  } catch (error) {
    console.error('Error en getConfiguracion:', error);
    throw error;
  }
}

export async function updateConfiguracion(data: any) {
  try {
    console.log('Enviando datos al servidor:', {
      ...data,
      s_logo_light: data.s_logo_light ? `Base64 (${data.s_logo_light.length} chars)` : 'null',
      s_logo_dark: data.s_logo_dark ? `Base64 (${data.s_logo_dark.length} chars)` : 'null'
    });

    const res = await fetch('/api/configuracion_sistema/configuracion', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    console.log('Respuesta del servidor:', res.status, res.statusText);

    if (!res.ok) {
      let errorMessage = `Error ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
        console.error('Detalles del error:', errorData);
      } catch (e) {
        console.error('Error parseando respuesta de error:', e);
      }
      throw new Error(errorMessage);
    }

    const responseData = await res.json();
    console.log('Configuración actualizada exitosamente:', responseData);
    return responseData;

  } catch (error) {
    console.error('Error en updateConfiguracion:', error);
    throw error;
  }
}