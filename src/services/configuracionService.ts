export async function getConfiguracion() {
  const res = await fetch('/api/configuracion_sistema');
  if (!res.ok) throw new Error('Error al obtener configuración');
  return res.json();
}

export async function updateConfiguracion(data: any) {
  const res = await fetch('/api/configuracion_sistema', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar configuración');
  return res.json();
}