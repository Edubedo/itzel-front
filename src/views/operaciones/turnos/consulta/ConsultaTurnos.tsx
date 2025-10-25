import React, { useCallback, useEffect, useState } from "react";
import { ClipboardList, CheckCircle, Play, Square, RotateCcw, Filter } from "lucide-react";
import { useSucursalActiva } from '../../../../components/header/Header';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../context/LanguageContext';

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
  const { t } = useLanguage();
  
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
        if (user?.tipo_usuario === 1) { 
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
      const params = new URLSearchParams({ sucursalId: sucursalActiva.ck_sucursal });
      if (areaSeleccionada) params.append('areaId', areaSeleccionada);

      const response = await fetch(`http://localhost:3001/api/operaciones/turnos/obtenerTurnos?${params}`);
      const data = await response.json();
      
      if (data.success) {
        const todosLosTurnos = data.turnos;
        setTurnos(todosLosTurnos);
        
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
      if (data.success) setEstadisticas(data.estadisticas);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ck_usuario_atendio: user.uk_usuario }),
      });
      const data = await response.json();
      if (data.success) {
        await cargarTurnos();
        await cargarEstadisticas();
      } else alert('Error al atender turno: ' + data.message);
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
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        await cargarTurnos();
        await cargarEstadisticas();
      } else alert('Error al finalizar turno: ' + data.message);
    } catch (error) {
      console.error('Error al finalizar turno:', error);
      alert('Error al finalizar turno');
    } finally {
      setLoading(false);
    }
  };

  const atenderProximoTurno = () => {
    if (turnosSiguientes.length > 0) atenderTurno(turnosSiguientes[0].ck_turno);
  };

  if (!sucursalActiva) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {t("shifts.noBranchSelected")}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t("shifts.selectBranchMessage")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("shifts.shiftManagement")}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("shifts.branch")}: {sucursalActiva.s_nombre_sucursal}
              {user?.tipo_usuario === 1 && ` (${t("userRoles.1")})`}
              {user?.tipo_usuario === 2 && ` (${t("userRoles.2")})`}
            </p>
          </div>
          
          {user?.tipo_usuario === 1 && areas.length > 0 && (
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-300" />
              <select 
                value={areaSeleccionada}
                onChange={(e) => setAreaSeleccionada(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium text-gray-800 dark:text-gray-200"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {/* Total */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-bl-full"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <ClipboardList className="w-6 h-6 text-white"/>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("shifts.totalToday")}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{estadisticas.total_turnos}</p>
            <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mt-3"></div>
          </div>

          {/* Pendientes */}
          <div className="bg-white rounded-xl shadow-sm border border-yellow-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-300/10 to-yellow-400/10 rounded-bl-full"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-sm">
                <Play className="w-6 h-6 text-white"/>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("shifts.waiting")}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{estadisticas.turnos_pendientes}</p>
            <div className="w-8 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mt-3"></div>
          </div>

          {/* En Proceso */}
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-300/10 to-green-400/10 rounded-bl-full"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center shadow-sm">
                <RotateCcw className="w-6 h-6 text-white"/>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("shifts.inProgress")}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{estadisticas.turnos_en_proceso}</p>
            <div className="w-8 h-1 bg-gradient-to-r from-green-400 to-green-500 rounded-full mt-3"></div>
          </div>

          {/* Atendidos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-200/10 to-gray-400/10 rounded-bl-full"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-sm">
                <CheckCircle className="w-6 h-6 text-white"/>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("shifts.attended")}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{estadisticas.turnos_atendidos}</p>
            <div className="w-8 h-1 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mt-3"></div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={atenderProximoTurno}
          disabled={loading || turnosSiguientes.length === 0 || turnoActual !== null}
          className="flex items-center gap-2 bg-[#457B68] hover:bg-[#65AC93] disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {t("shifts.attendNextShift")}
        </button>
        
        {turnoActual && (
          <button
            onClick={() => finalizarTurno(turnoActual.ck_turno)}
            disabled={loading}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-900 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Square className="w-4 h-4" />
            {t("shifts.finishAttention")}
          </button>
        )}
        
        <button
          onClick={() => { cargarTurnos(); cargarEstadisticas(); }}
          disabled={loading}
          className="flex items-center gap-2 bg-[#1EC2EC] hover:bg-[#119ABD] disabled:bg-gray-400 text-gray-800 dark:text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t("shifts.update")}
        </button>
      </div>

      {/* Turno Actual y Siguientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turno Actual */}
        <div className="bg-[#D3EEE3] dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#263731] to-[#64917F] text-white p-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="w-6 h-6" />
              {t("shifts.shiftInAttention")}
            </h2>
          </div>
          
         <div className="p-6">
  {turnoActual ? (
    <div className="text-center">
      <div className="text-6xl font-bold text-[#3A554B] dark:text-gray-200 mb-4">
        {turnoActual.i_numero_turno}
      </div>
      
      <div className="space-y-3 text-left bg-[#D3EEE3] dark:bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600 dark:text-gray-300">{t("shifts.area")}:</span>
          <span className="font-bold text-gray-800 dark:text-gray-100">{turnoActual.s_area}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600 dark:text-gray-300">{t("shifts.service")}:</span>
          <span className="text-gray-800 dark:text-gray-100">{turnoActual.s_servicio}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600 dark:text-gray-300">{t("shifts.client")}:</span>
          <span className="text-gray-800 dark:text-gray-100">{turnoActual.nombre_cliente}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600 dark:text-gray-300">{t("shifts.attendedBy")}:</span>
          <span className="text-gray-800 dark:text-gray-100">{turnoActual.nombre_asesor || 'Sistema'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600 dark:text-gray-300">{t("shifts.start")}:</span>
          <span className="text-gray-800 dark:text-gray-100">
            {turnoActual.d_fecha_atendido
              ? new Date(turnoActual.d_fecha_atendido).toLocaleTimeString('es-MX')
              : 'N/A'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <CheckCircle className="w-12 h-12 text-[#3A554B] dark:text-gray-200" />
      </div>
    </div>
  ) : (
    <div className="text-center py-12 text-gray-500 dark:text-gray-200">
      <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p className="text-lg font-medium">{t("shifts.noShiftInAttention")}</p>
      <p className="text-sm">{t("shifts.selectNextShiftMessage")}</p>
    </div>
  )}
</div>

        </div>

        {/* Próximos Turnos */}
        <div className="bg-[#D3EEE3] dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#263731] to-[#64917F] text-white p-4">
            <h2 className="text-xl font-bold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ClipboardList className="w-6 h-6" />
                {t("shifts.nextShifts")}
              </span>
              <span className="text-sm bg-[#89BBA8] px-2 py-1 rounded">
                {turnosSiguientes.length}
              </span>
            </h2>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {turnosSiguientes.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg font-medium">No hay turnos en espera</p>
                <p className="text-sm">Los nuevos turnos aparecerán aquí</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-600">
                {turnosSiguientes.map((turno, index) => (
                  <div 
                    key={turno.ck_turno}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                      index === 0 ? 'bg-[#D3EEE3] dark:bg-gray-700 border-l-4 border-[#70A18E]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl font-bold ${index === 0 ? 'text-[#3A554B] dark:text-gray-200' : 'text-[#224236] dark:text-gray-300'}`}>
                          {turno.i_numero_turno}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{turno.s_area}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{turno.s_servicio}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{turno.nombre_cliente}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{turno.c_codigo_area}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{turno.t_tiempo_espera}</div>
                        {index === 0 && <div className="text-xs font-medium text-[#405950] dark:text-gray-200 mt-1">Siguiente</div>}
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => atenderTurno(turno.ck_turno)}
                          disabled={loading || turnoActual !== null}
                          className="w-full bg-[#457B68] hover:bg-[#65AC93] disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm"
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
      <div className="mt-6 bg-[#D3EEE3] dark:bg-gray-700 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Información del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <strong>Última actualización:</strong><br />
            {new Date().toLocaleString('es-MX')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultaTurnos;
