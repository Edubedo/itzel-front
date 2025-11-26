import React, { useCallback, useEffect, useState } from "react";
import { ClipboardList, CheckCircle, Play, X, Square, RotateCcw, Filter } from "lucide-react";
import { useSucursalActiva } from '../../../../components/header/Header';
import { useAuth } from '../../../../contexts/AuthContext';
import { useLanguage } from '../../../../context/LanguageContext';
import Cookies from 'js-cookie';
  import { getApiBaseUrlWithApi } from '../../../../../utils/util_baseUrl';
interface Turno {
  ck_turno: string;
  i_numero_turno: number;
  c_codigo_turno?: string;
  c_codigo_servicio?: string;
  ck_area: string;
  s_area: string;
  c_codigo_area: string;
  ck_estatus: string;
  nombre_cliente: string;
  s_servicio: string;
  t_tiempo_espera: string;
  d_fecha_atendido: string;
  nombre_asesor: string;
  nombre_usuario_atendiendo?: string;
  ck_usuario_atendiendo?: string;
}

interface Area {
  ck_area: string;
  s_area: string;
  s_descripcion_area: string;
  c_codigo_area: string;
  turnos_pendientes?: number;
}

function ConsultaTurnos() {
  const { user } = useAuth();
  const sucursalActiva = useSucursalActiva();
  const { t } = useLanguage();
  
  // Helper function to normalize text (remove accents and convert to lowercase)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Helper function to format time from HH:MM:SS to 12-hour format with AM/PM
  const formatTime = (timeString: string | null | undefined): string => {
    if (!timeString) return 'N/A';
    
    // Parse time string (HH:MM:SS or HH:MM)
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (!timeMatch) return timeString;
    
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    const seconds = timeMatch[3] || '00';
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'p.m.' : 'a.m.';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    
    return `${hours}:${minutes}:${seconds} ${period}`;
  };
  
  // Helper function to translate area names
  const translateArea = (areaName: string): string => {
    if (!areaName) return '';
    
    // Eliminar puntos entre palabras
    let cleanAreaName = areaName.replace(/\./g, ' ').replace(/\s+/g, ' ').trim();
    
    // Si ya es "Todas las áreas" o "All areas" (ya traducido), devolverlo tal cual
    const normalized = normalizeText(cleanAreaName);
    if (normalized === normalizeText(t("shifts.allAreas")) || normalized === 'todas las areas' || normalized === 'all areas') {
      return t("shifts.allAreas");
    }
    
    // Traducir nombres de áreas del backend
    if (normalized.includes('atencion al cliente') || normalized.includes('atencion cliente') || normalized.includes('customer service')) {
      return t("area.atencionCliente");
    }
    if (normalized.includes('cobranza') || normalized.includes('collections')) {
      return t("area.cobranza");
    }
    if (normalized.includes('facturacion') || normalized.includes('billing')) {
      return t("area.facturacion");
    }
    if (normalized.includes('conexiones') || normalized.includes('connections')) {
      return t("area.conexiones");
    }
    if (normalized.includes('servicios tecnicos') || normalized.includes('servicio tecnico') || normalized.includes('technical services')) {
      return t("area.serviciosTecnicos");
    }
    if (normalized.includes('contratacion') || normalized.includes('contratación') || normalized.includes('contracting')) {
      return t("area.contratacion");
    }
    if ((normalized.includes('informacion') || normalized.includes('información')) && (normalized.includes('consultas') || normalized.includes('inquiries'))) {
      return t("area.informacionConsultas");
    }
    if (normalized.includes('recursos humanos') || normalized.includes('human resources')) {
      return t("area.recursosHumanos");
    }
    if (normalized.includes('reportes') || normalized.includes('reports')) {
      return t("area.reportes");
    }
    // If no translation found, return original without dots
    return cleanAreaName;
  };
  
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
    turnos_cancelados: 0
  });

  useEffect(() => {
    if (sucursalActiva && user) {
      cargarAreas();
      setAreaSeleccionada(''); 
    }
  }, [sucursalActiva?.ck_sucursal, user?.uk_usuario]);

  // Efecto para cargar datos cuando cambia la sucursal o el área
  useEffect(() => {
    if (!sucursalActiva) return;
    
    const cargarDatos = async () => {
      await cargarTurnos();
      await cargarEstadisticas();
    };
    
    cargarDatos();
  }, [sucursalActiva?.ck_sucursal, areaSeleccionada]);

  const cargarAreas = async () => {
    if (!sucursalActiva || !user) return;
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${getApiBaseUrlWithApi()}/operaciones/turnos/areas-usuario/${sucursalActiva.ck_sucursal}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        const areasConDatos: Area[] = data.areas || [];

        if (user.tipo_usuario === 1) {
          const totalPendientes = areasConDatos.reduce((sum: number, area: Area) => sum + (area.turnos_pendientes || 0), 0);
          setAreas([
            {
              ck_area: '',
              s_area: t("shifts.allAreas") || 'Todas las áreas',
              s_descripcion_area: t("shifts.viewAllShifts") || 'Ver todos los turnos',
              c_codigo_area: 'ALL',
              turnos_pendientes: totalPendientes
            },
            ...areasConDatos
          ]);
        } else {
          setAreas(areasConDatos);
          // NO seleccionar ninguna área por defecto - mostrar todas
          // El usuario puede filtrar manualmente si lo desea
        }
      }
    } catch (error) {
      console.error('Error al cargar áreas:', error);
    }
  };

  const cargarTurnos = async () => {
    if (!sucursalActiva || !user) return;
    setLoading(true);
    try {
      const token = Cookies.get('authToken');
      const params = new URLSearchParams({ sucursalId: sucursalActiva.ck_sucursal });
      // Solo agregar areaId si está seleccionada y no es vacía
      if (areaSeleccionada && areaSeleccionada.trim() !== '') {
        params.append('areaId', areaSeleccionada.trim());
        console.log('🔍 Filtrando por área:', areaSeleccionada);
      } else {
        console.log('📋 Mostrando todas las áreas permitidas');
      }

      const response = await fetch(`${getApiBaseUrlWithApi()}/operaciones/turnos/obtenerTurnos?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('📊 Turnos recibidos:', data.turnos?.length || 0, 'turnos');
      
      if (data.success) {
        const todosLosTurnos = data.turnos || [];
        console.log('🔑 Usuario actual ID:', user.uk_usuario);
        console.log('📋 Todos los turnos:', todosLosTurnos.map(t => ({
          numero: t.i_numero_turno,
          estatus: t.ck_estatus,
          atendiendo: t.ck_usuario_atendiendo
        })));
        
        setTurnos(todosLosTurnos);
        
        // Buscar turno en proceso que esté siendo atendido por el usuario actual
        const turnoEnProceso = todosLosTurnos.find((t: Turno) => 
          t.ck_estatus === 'PROCES' && t.ck_usuario_atendiendo === user.uk_usuario
        );
        console.log('🎯 Turno en proceso encontrado:', turnoEnProceso ? turnoEnProceso.i_numero_turno : 'Ninguno');
        
        // Filtrar solo turnos activos disponibles (no asignados a otros usuarios)
        const turnosActivos = todosLosTurnos
          .filter((t: Turno) => 
            t.ck_estatus === 'ACTIVO' && 
            (!t.ck_usuario_atendiendo || t.ck_usuario_atendiendo === user.uk_usuario)
          )
          .sort((a: Turno, b: Turno) => a.i_numero_turno - b.i_numero_turno);
        console.log('✅ Turnos activos filtrados:', turnosActivos.length);
        
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
      const response = await fetch(`${getApiBaseUrlWithApi()}/operaciones/turnos/estadisticas?sucursalId=${sucursalActiva.ck_sucursal}`);
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
      const token = Cookies.get('authToken');
      const response = await fetch(`${getApiBaseUrlWithApi()}/operaciones/turnos/atender/${turnoId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ck_usuario_atendio: user.uk_usuario }),
      });
      const data = await response.json();
      if (data.success) {
        await cargarTurnos();
        await cargarEstadisticas();
        await cargarAreas(); // Recargar áreas para actualizar contadores
      } else {
        alert(t("shifts.errorAttendingShift") + ': ' + data.message);
      }
    } catch (error) {
      console.error('Error al atender turno:', error);
      alert(t("shifts.errorAttendingShift"));
    } finally {
      setLoading(false);
    }
  };

  const finalizarTurno = async (turnoId: string) => {
    if (!turnoId || !user) return;
    setLoading(true);
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${getApiBaseUrlWithApi()}/operaciones/turnos/finalizar/${turnoId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (data.success) {
        await cargarTurnos();
        await cargarEstadisticas();
        await cargarAreas(); // Recargar áreas para actualizar contadores
      } else {
        alert(t("shifts.errorFinishingShift") + ': ' + data.message);
      }
    } catch (error) {
      console.error('Error al finalizar turno:', error);
      alert(t("shifts.errorFinishingShift"));
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
            </p>
          </div>
          
          {areas.length > 0 && (
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-300" />
              <select 
                value={areaSeleccionada}
                onChange={(e) => {
                  console.log('🔄 Cambiando área de', areaSeleccionada, 'a', e.target.value);
                  setAreaSeleccionada(e.target.value);
                }}
                className="bg-transparent border-none outline-none text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                <option value="">{t("shifts.allAreas")}</option>
                {areas.map((area) => (
                  <option key={area.ck_area} value={area.ck_area}>
                    {translateArea(area.s_area)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-4">
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

          {/* Cancelados */}
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-600/10 to-red-400/10 rounded-bl-full"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center shadow-sm">
                <X className="w-6 h-6 text-white"/>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("shifts.canceled")}</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{estadisticas.turnos_cancelados}</p>
            <div className="w-8 h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-full mt-3"></div>
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
          onClick={() => { cargarTurnos(); cargarEstadisticas(); cargarAreas(); }}
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
        {turnoActual.c_codigo_turno || turnoActual.i_numero_turno}
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
          <span className="text-gray-800 dark:text-gray-100">{turnoActual.nombre_usuario_atendiendo || turnoActual.nombre_asesor || 'Sistema'}</span>
        </div>
        {turnoActual.s_area && (
          <div className="flex justify-between">
            <span className="font-medium text-gray-600 dark:text-gray-300">Área actual:</span>
            <span className="text-gray-800 dark:text-gray-100 font-bold">{turnoActual.s_area}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-medium text-gray-600 dark:text-gray-300">{t("shifts.start")}:</span>
          <span className="text-gray-800 dark:text-gray-100">
            {formatTime(turnoActual.t_tiempo_espera)}
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
                <p className="text-lg font-medium">{t("shifts.noWaitingShifts")}</p>
                <p className="text-sm">{t("shifts.newShiftsWillAppear")}</p>
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
                        {index === 0 && <div className="text-xs font-medium text-[#405950] dark:text-gray-200 mt-1">{t("shifts.next")}</div>}
                      </div>
                    </div>
                    
                    {index === 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => atenderTurno(turno.ck_turno)}
                          disabled={loading || turnoActual !== null}
                          className="w-full bg-[#457B68] hover:bg-[#65AC93] disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:cursor-not-allowed text-sm"
                        >
                          {t("shifts.attendNow")}
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
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">{t("shifts.systemInfo")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <strong>{t("shifts.lastUpdate")}</strong><br />
            {new Date().toLocaleString('es-MX')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultaTurnos;