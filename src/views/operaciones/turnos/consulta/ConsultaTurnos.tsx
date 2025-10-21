import React, { useCallback, useEffect, useState } from "react";
import { ClipboardList, CheckCircle, Play, Square, RotateCcw, Filter } from "lucide-react";
import { useSucursalActiva } from '../../../../components/header/Header';
import { useAuth } from '../../../../contexts/AuthContext';

interface Turno {
  ck_turno: string;
  i_numero_turno: number;
  ck_area: string;
  s_area: string;
  c_codigo_area: string;
  ck_estatus: string;
  nombre_cliente: string;
  s_servicio: string;
  t_tiempo_espera: string;
  d_fecha_atendido: string;
  nombre_asesor: string;
}

interface Area {
  ck_area: string;
  s_area: string;
  s_descripcion_area: string;
  c_codigo_area: string;
}

function ConsultaTurnos() {
  const { user } = useAuth();
  const sucursalActiva = useSucursalActiva();
  
  const [areas, setAreas] = useState<Area[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState<string>('');
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnoActual, setTurnoActual] = useState<Turno | null>(null);
  const [turnosSiguientes, setTurnosSiguientes] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState({
    total_turnos: 0,
    turnos_pendientes: 0,
    turnos_en_proceso: 0,
    turnos_atendidos: 0,
    tiempo_promedio_atencion: 0
  });

  // Cargar áreas cuando hay sucursal activa
  useEffect(() => {
    if (sucursalActiva) {
      cargarAreas();
    }
  }, [sucursalActiva]);

  const cargarDatos = useCallback(async () => {
    if (!sucursalActiva) return;
    
    await cargarTurnos();
    await cargarEstadisticas();
  }, [sucursalActiva, areaSeleccionada]); 

  // Cargar turnos cuando cambie el área seleccionada
  useEffect(() => {
    if (sucursalActiva) {
      cargarDatos();
    }
  }, [ cargarDatos]);

  const cargarAreas = async () => {
    if (!sucursalActiva) return;

    try {
      const response = await fetch(`http://localhost:3001/api/operaciones/turnos/areas/${sucursalActiva.ck_sucursal}`);
      const data = await response.json();
      
      if (data.success) {
        setAreas(data.areas);
        
        // Si es administrador, puede ver todas las áreas
        // Si es ejecutivo, solo las áreas que tiene asignadas (por ahora todas)
        if (user?.tipo_usuario === 1) { // Administrador
          // Agregar opción "Todas las áreas"
          setAreas([
            { ck_area: '', s_area: 'Todas las áreas', s_descripcion_area: 'Ver todos los turnos', c_codigo_area: 'ALL' },
            ...data.areas
          ]);
        }
      }
    } catch (error) {
      console.error('Error al cargar áreas:', error);
    }
  };

  const cargarTurnos = async () => {
    if (!sucursalActiva) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        sucursalId: sucursalActiva.ck_sucursal
      });

      if (areaSeleccionada) {
        params.append('areaId', areaSeleccionada);
      }

      const response = await fetch(`http://localhost:3001/api/operaciones/turnos/obtenerTurnos?${params}`);
      const data = await response.json();
      
      if (data.success) {
        const todosLosTurnos = data.turnos;
        setTurnos(todosLosTurnos);
        
        // Separar por estado
        const turnoEnProceso = todosLosTurnos.find((t: Turno) => t.ck_estatus === 'PROCES');
        const turnosActivos = todosLosTurnos
          .filter((t: Turno) => t.ck_estatus === 'ACTIVO')
          .sort((a: Turno, b: Turno) => a.i_numero_turno - b.i_numero_turno);
        
        setTurnoActual(turnoEnProceso || null);
        setTurnosSiguientes(turnosActivos);
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    if (!sucursalActiva) return;

    try {
      const response = await fetch(`http://localhost:3001/api/operaciones/turnos/estadisticas?sucursalId=${sucursalActiva.ck_sucursal}`);
      const data = await response.json();
      
      if (data.success) {
        setEstadisticas(data.estadisticas);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const atenderTurno = async (turnoId: string) => {
    if (!turnoId || !user) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/operaciones/turnos/atender/${turnoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ck_usuario_atendio: user.uk_usuario
        }),
      });

      const data = await response.json();

      if (data.success) {
        await cargarTurnos();
        await cargarEstadisticas();
      } else {
        alert('Error al atender turno: ' + data.message);
      }
    } catch (error) {
      console.error('Error al atender turno:', error);
      alert('Error al atender turno');
    } finally {
      setLoading(false);
    }
  };

  const finalizarTurno = async (turnoId: string) => {
    if (!turnoId) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/operaciones/turnos/finalizar/${turnoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        await cargarTurnos();
        await cargarEstadisticas();
      } else {
        alert('Error al finalizar turno: ' + data.message);
      }
    } catch (error) {
      console.error('Error al finalizar turno:', error);
      alert('Error al finalizar turno');
    } finally {
      setLoading(false);
    }
  };

  const atenderProximoTurno = () => {
    if (turnosSiguientes.length > 0) {
      atenderTurno(turnosSiguientes[0].ck_turno);
    }
  };

  if (!sucursalActiva) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            No hay sucursal seleccionada
          </div>
          <p className="text-gray-600">
            Por favor seleccione una sucursal en el menú superior.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Gestión de Turnos</h1>
            <p className="text-gray-600">
              Sucursal: {sucursalActiva.s_nombre_sucursal}
              {user?.tipo_usuario === 1 && ' (Administrador)'}
              {user?.tipo_usuario === 2 && ' (Ejecutivo)'}
            </p>
          </div>
          
          {/* Filtro de área */}
          {user?.tipo_usuario === 1 && areas.length > 0 && (
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-300 px-3 py-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={areaSeleccionada}
                onChange={(e) => setAreaSeleccionada(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium"
              >
                {areas.map((area) => (
                  <option key={area.ck_area} value={area.ck_area}>
                    {area.s_area}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-600 text-sm font-medium">Total Hoy</div>
            <div className="text-2xl font-bold text-blue-800">{estadisticas.total_turnos}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-600 text-sm font-medium">En Espera</div>
            <div className="text-2xl font-bold text-yellow-800">{estadisticas.turnos_pendientes}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-600 text-sm font-medium">En Proceso</div>
            <div className="text-2xl font-bold text-green-800">{estadisticas.turnos_en_proceso}</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="text-gray-600 text-sm font-medium">Atendidos</div>
            <div className="text-2xl font-bold text-gray-800">{estadisticas.turnos_atendidos}</div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={atenderProximoTurno}
          disabled={loading || turnosSiguientes.length === 0 || turnoActual !== null}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          Atender Próximo Turno
        </button>
        
        {turnoActual && (
          <button
            onClick={() => finalizarTurno(turnoActual.ck_turno)}
            disabled={loading}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Square className="w-4 h-4" />
            Finalizar Atención
          </button>
        )}
        
        <button
          onClick={() => {
            cargarTurnos();
            cargarEstadisticas();
          }}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turno Actual */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="w-6 h-6" />
              Turno en Atención
            </h2>
          </div>
          
          <div className="p-6">
            {turnoActual ? (
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600 mb-4">
                  {turnoActual.i_numero_turno}
                </div>
                
                <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Área:</span>
                    <span className="font-bold">{turnoActual.s_area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Servicio:</span>
                    <span>{turnoActual.s_servicio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Cliente:</span>
                    <span>{turnoActual.nombre_cliente}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Atendido por:</span>
                    <span>{turnoActual.nombre_asesor || 'Sistema'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Inicio:</span>
                    <span>
                      {turnoActual.d_fecha_atendido 
                        ? new Date(turnoActual.d_fecha_atendido).toLocaleTimeString('es-MX')
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No hay turno en atención</p>
                <p className="text-sm">Seleccione "Atender Próximo Turno" para comenzar</p>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Próximos Turnos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
            <h2 className="text-xl font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ClipboardList className="w-6 h-6" />
                Próximos Turnos
              </span>
              <span className="text-sm bg-blue-700 px-2 py-1 rounded">
                {turnosSiguientes.length}
              </span>
            </h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {turnosSiguientes.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p className="text-lg font-medium">No hay turnos en espera</p>
                <p className="text-sm">Los nuevos turnos aparecerán aquí</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {turnosSiguientes.map((turno, index) => (
                  <div 
                    key={turno.ck_turno}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      index === 0 ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl font-bold ${
                          index === 0 ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {turno.i_numero_turno}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {turno.s_area}
                          </div>
                          <div className="text-sm text-gray-600">
                            {turno.s_servicio}
                          </div>
                          <div className="text-xs text-gray-500">
                            {turno.nombre_cliente}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {turno.c_codigo_area}
                        </div>
                        <div className="text-xs text-gray-500">
                          {turno.t_tiempo_espera}
                        
                        </div>
                        {index === 0 && (
                          <div className="text-xs font-medium text-blue-600 mt-1">
                            Siguiente
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => atenderTurno(turno.ck_turno)}
                          disabled={loading || turnoActual !== null}
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm"
                        >
                          Atender Ahora
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Información del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Última actualización:</strong><br />
            {new Date().toLocaleString('es-MX')}
          </div>
          <div>
            <strong>Tiempo promedio de atención:</strong><br />
            {estadisticas.tiempo_promedio_atencion ? 
              `${Math.round(estadisticas.tiempo_promedio_atencion)} minutos` : 
              'N/A'
            }
          </div>
          <div>
            <strong>Estado del sistema:</strong><br />
            <span className="text-green-600 font-medium">Operativo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultaTurnos;
