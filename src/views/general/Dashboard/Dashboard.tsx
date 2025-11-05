// dashboard.tsx - Modern Dashboard with Glassmorphism Design

import React, { useState, useEffect } from "react";
import { Clipboard, Volume2, Clock, ChevronDown, Users, Zap, MapPin } from "lucide-react";
import { useSucursalActiva } from '../../../components/header/Header';
import { getApiBaseUrlWithApi } from '../../../../utils/util_baseUrl';

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

interface Sucursal {
  ck_sucursal: string;
  s_nombre_sucursal: string;
  s_domicilio: string;
  s_municipio?: string;
  s_estado?: string;
}

const Dashboard: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalActiva, setSucursalActiva] = useState<Sucursal | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [turnoActual, setTurnoActual] = useState<Turno | null>(null);
  const [turnosSiguientes, setTurnosSiguientes] = useState<Turno[]>([]);

  // Usar el hook personalizado para obtener la sucursal activa
  const sucursalSeleccionada = useSucursalActiva();

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Cargar sucursales
  useEffect(() => {
    cargarSucursales();
  }, []);

  // Usar la sucursal del header o cargar de localStorage
  useEffect(() => {
    if (sucursalSeleccionada) {
      setSucursalActiva(sucursalSeleccionada);
    } else {
      // Si no hay sucursal del header, intentar cargar de localStorage
      const sucursalGuardada = localStorage.getItem('sucursal_seleccionada');
      if (sucursalGuardada) {
        try {
          setSucursalActiva(JSON.parse(sucursalGuardada));
        } catch (error) {
          console.error('Error al cargar sucursal guardada:', error);
        }
      }
    }
  }, [sucursalSeleccionada]);

  // Cargar turnos cuando cambie la sucursal
  useEffect(() => {
    if (sucursalActiva) {
      cargarTurnos();

      // Actualizar turnos cada 3 segundos
      const interval = setInterval(cargarTurnos, 3000);
      return () => clearInterval(interval);
    }
  }, [sucursalActiva]);

  const cargarSucursales = async () => {
    try {
      const response = await fetch(`${getApiBaseUrlWithApi()}/operaciones/turnos/sucursales`);
      const data = await response.json();

      if (data.success) {
        setSucursales(data.sucursales);

        // Si no hay sucursal activa, seleccionar la primera
        if (!sucursalActiva && data.sucursales.length > 0) {
          const primeraSucursal = data.sucursales[0];
          setSucursalActiva(primeraSucursal);
          localStorage.setItem('sucursal_seleccionada', JSON.stringify(primeraSucursal));
        }
      }
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    }
  };

  const cargarTurnos = async () => {
    if (!sucursalActiva) return;

    try {
      const response = await fetch(
        `${getApiBaseUrlWithApi()}/operaciones/turnos/obtenerTurnos?sucursalId=${sucursalActiva.ck_sucursal}`
      );
      const data = await response.json();

      if (data.success) {
        const turnos = data.turnos;

        // Separar turno actual (en proceso) de los siguientes (activos)
        const turnoEnProceso = turnos.find((t: Turno) => t.ck_estatus === 'PROCES');
        const turnosActivos = turnos.filter((t: Turno) => t.ck_estatus === 'ACTIVO')
          .sort((a: Turno, b: Turno) => a.i_numero_turno - b.i_numero_turno);

        setTurnoActual(turnoEnProceso || null);
        setTurnosSiguientes(turnosActivos);
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
    }
  };

  const seleccionarSucursal = (sucursal: Sucursal) => {
    setSucursalActiva(sucursal);
    localStorage.setItem('sucursal_seleccionada', JSON.stringify(sucursal));
    setIsDropdownOpen(false);

    // Emitir evento para sincronizar con otros componentes
    window.dispatchEvent(new CustomEvent('sucursalCambiada', { detail: sucursal }));
  };

  // Formato de hora (12h con AM/PM)
  const formattedTime = time.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Formato de fecha en español
  const formattedDate = time.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F4F4F4 0%, #DFDFDF 50%, #CAC9C9 100%)'
      }}>
      {/* HEADER - Modernized with glassmorphism - Compacto */}
      <div className="relative backdrop-blur-md bg-[#3A554B]/95 px-3 md:px-4 py-2 flex justify-between items-center flex-shrink-0 border-b border-white/10 z-[100]"
        style={{ boxShadow: '0 4px 20px rgba(58, 85, 75, 0.3)' }}>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3A554B] via-[#5D7166] to-[#3A554B] opacity-50 pointer-events-none"></div>

        {/* Left side - Selector de sucursal - Compacto */}
        <div className="relative z-10 dropdown-container">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="group flex items-center space-x-1.5 md:space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-2 md:px-3 py-1.5 rounded-lg transition-all duration-300 border border-white/20 hover:border-[#B7F2DA]/40 shadow-lg"
          >
            <div className="p-0.5 bg-[#8ECAB2]/20 rounded group-hover:bg-[#8ECAB2]/30 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-[#B7F2DA]" />
            </div>
            <span className="font-semibold text-xs md:text-sm">
              {sucursalActiva ? sucursalActiva.s_nombre_sucursal : 'Seleccionar sucursal'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown - Modernized */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 backdrop-blur-xl bg-white/95 rounded-2xl overflow-hidden border border-white/20 z-[9999] max-h-80 shadow-2xl">
              {/* Header del dropdown */}
              <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-3 border-b border-white/20">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Sucursales Disponibles
                </h3>
              </div>

              {/* Lista de sucursales */}
              <div className="max-h-64 overflow-y-auto">
                {sucursales.length === 0 ? (
                  <div className="p-6 text-gray-500 text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay sucursales disponibles</p>
                  </div>
                ) : (
                  sucursales.map((sucursal) => (
                    <button
                      key={sucursal.ck_sucursal}
                      onClick={() => seleccionarSucursal(sucursal)}
                      className={`w-full text-left px-4 py-3 transition-all duration-200 border-b border-gray-100 last:border-b-0 group ${sucursalActiva?.ck_sucursal === sucursal.ck_sucursal
                        ? 'bg-gradient-to-r from-[#B7F2DA]/30 to-[#8ECAB2]/20 border-l-4 border-l-[#70A18E]'
                        : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-white'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 flex items-center gap-2">
                            {sucursal.s_nombre_sucursal}
                            {sucursalActiva?.ck_sucursal === sucursal.ck_sucursal && (
                              <span className="px-2 py-0.5 bg-[#70A18E] text-white text-[10px] rounded-full font-bold">
                                ACTIVA
                              </span>
                            )}
                          </div>
                          {sucursal.s_domicilio && (
                            <div className="text-xs text-gray-600 mt-1">
                              📍 {sucursal.s_domicilio}
                            </div>
                          )}
                          {(sucursal.s_municipio || sucursal.s_estado) && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {sucursal.s_municipio && sucursal.s_estado
                                ? `${sucursal.s_municipio}, ${sucursal.s_estado}`
                                : sucursal.s_municipio || sucursal.s_estado
                              }
                            </div>
                          )}
                        </div>
                        {sucursalActiva?.ck_sucursal === sucursal.ck_sucursal && (
                          <div className="flex-shrink-0 text-[#70A18E]">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Center - Title - Compacto */}
        <div className="relative z-10 hidden lg:block">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-[#8ECAB2] blur-lg opacity-40"></div>
              <div className="relative w-8 h-8 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-tight">
                PANEL DE TURNOS
              </h1>
              <p className="text-[10px] text-[#B7F2DA] font-medium">
                Sistema ITZEL • En Tiempo Real
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Fecha y hora - Compacto */}
        <div className="relative z-10 flex items-center gap-2 bg-white/10 backdrop-blur-sm px-2 md:px-3 py-1.5 rounded-lg border border-white/20">
          <div className="p-1 bg-[#8ECAB2]/20 rounded">
            <Clock className="w-4 h-4 text-[#B7F2DA]" />
          </div>
          <div className="text-right leading-tight">
            <div className="text-sm md:text-base font-bold text-white">
              {formattedTime}
            </div>
            <div className="text-[10px] text-[#B7F2DA] font-medium capitalize">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - Optimizado para pantalla fija sin scroll */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 p-3 overflow-hidden">
        {/* Columna IZQUIERDA - Turno Actual */}
        <div className="flex flex-col gap-2 h-full">
          {/* Encabezado turno actual - Compacto */}
          <div className="relative backdrop-blur-xl bg-white/40 rounded-xl overflow-hidden border border-white/20 shadow-xl flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#B7F2DA]/20 via-[#8ECAB2]/20 to-[#70A18E]/20 animate-pulse"></div>
            <div className="relative px-3 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3A554B] to-[#70A18E] uppercase tracking-tight">
                    Turno Actual
                  </h2>
                  {sucursalActiva && (
                    <p className="text-xs text-gray-700 font-medium">
                      📍 {sucursalActiva.s_nombre_sucursal}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-[#70A18E] blur-md opacity-40"></div>
                  <div className="relative w-8 h-8 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-lg flex items-center justify-center shadow-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Número de turno - Hero Card Compacto */}
          <div className="relative group flex-1 backdrop-blur-xl bg-white/50 rounded-2xl overflow-hidden border border-white/30 shadow-2xl min-h-0"
            style={{
              background: 'linear-gradient(135deg, rgba(183, 242, 218, 0.3) 0%, rgba(142, 202, 178, 0.2) 100%)'
            }}>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#B7F2DA]/30 via-[#8ECAB2]/20 to-[#70A18E]/30 animate-pulse"></div>

            {/* Decorative circles - Smaller */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#8ECAB2]/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#B7F2DA]/20 rounded-full -ml-16 -mb-16 blur-xl"></div>

            <div className="relative flex flex-col items-center justify-center h-full py-4">
              <div className="inline-block px-4 py-1 bg-white/40 backdrop-blur-sm rounded-full border border-white/30 mb-2">
                <span className="text-xs font-bold text-[#3A554B] uppercase tracking-wider">
                  Turno Actual
                </span>
              </div>

              {/* Large turn number with glow effect - Compact */}
              <div className="relative mb-3">
                <div className="absolute inset-0 blur-2xl opacity-50"
                  style={{
                    background: turnoActual
                      ? 'radial-gradient(circle, rgba(112, 161, 142, 0.6) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(142, 202, 178, 0.3) 0%, transparent 70%)'
                  }}>
                </div>
                <span className="relative text-6xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#3A554B] via-[#5D7166] to-[#70A18E]"
                  style={{ textShadow: '0 4px 20px rgba(58, 85, 75, 0.2)' }}>
                  {turnoActual ? turnoActual.i_numero_turno : "--"}
                </span>
              </div>

              {!turnoActual && (
                <div className="text-center">
                  <p className="text-xs text-gray-600 font-medium">En espera del siguiente turno...</p>
                  <div className="flex justify-center gap-1 mt-1.5">
                    <div className="w-1.5 h-1.5 bg-[#70A18E] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#8ECAB2] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#B7F2DA] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Área y servicio - Modern Cards Compactas */}
          <div className="grid grid-cols-2 gap-2 flex-shrink-0">
            <div className="relative group backdrop-blur-xl bg-white/40 rounded-xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#B7F2DA]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex flex-col justify-center items-center py-3">
                <span className="text-xs font-bold text-[#70A18E] uppercase tracking-wide mb-1">Área</span>
                <div className="p-1.5 bg-[#8ECAB2]/20 rounded-lg">
                  <Volume2 className="w-6 h-6 text-[#70A18E]" />
                </div>
              </div>
            </div>

            <div className="relative group backdrop-blur-xl rounded-xl overflow-hidden border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #70A18E 0%, #8ECAB2 100%)'
              }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center py-3">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-black text-white mb-0.5"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                    {turnoActual ? turnoActual.c_codigo_area : "--"}
                  </div>
                  {turnoActual && (
                    <div className="text-xs text-white/90 font-medium">
                      {turnoActual.s_area}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información adicional - Glass Card Compacta */}
          {turnoActual && (
            <div className="relative backdrop-blur-xl bg-white/60 rounded-xl overflow-hidden border border-white/30 shadow-lg flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#B7F2DA]/10 to-[#70A18E]/5"></div>
              <div className="relative p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-[#70A18E]/20 rounded">
                    <Clipboard className="w-4 h-4 text-[#70A18E]" />
                  </div>
                  <h3 className="font-bold text-[#3A554B] text-sm">Información del servicio</h3>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-[#70A18E] min-w-[90px]">Servicio:</span>
                    <span className="text-xs text-gray-700 font-medium">{turnoActual.s_servicio}</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-[#8ECAB2]/30 to-transparent"></div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-[#70A18E] min-w-[90px]">Hora llegada:</span>
                    <span className="text-xs text-gray-700 font-medium">
                      {new Date(turnoActual.t_tiempo_espera).toLocaleTimeString('es-MX')}
                    </span>
                  </div>
                  {turnoActual.d_fecha_atendido && (
                    <>
                      <div className="h-px bg-gradient-to-r from-transparent via-[#8ECAB2]/30 to-transparent"></div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-[#70A18E] min-w-[90px]">Inicio atención:</span>
                        <span className="text-xs text-gray-700 font-medium">
                          {new Date(turnoActual.d_fecha_atendido).toLocaleTimeString('es-MX')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Columna DERECHA - Próximos Turnos */}
        <div className="flex flex-col gap-2 h-full overflow-hidden">
          {/* Encabezado - Compacto */}
          <div className="relative backdrop-blur-xl bg-white/40 rounded-xl overflow-hidden border border-white/20 shadow-xl flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#70A18E]/20 via-[#8ECAB2]/20 to-[#B7F2DA]/20 animate-pulse"></div>
            <div className="relative px-3 py-2 flex items-center justify-between">
              <h2 className="text-base md:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3A554B] to-[#70A18E] uppercase tracking-tight">
                Próximos Turnos
              </h2>
              <div className="flex items-center gap-1.5 bg-white/40 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
                <Clipboard className="w-3.5 h-3.5 text-[#70A18E]" />
                <span className="text-xs font-bold text-[#3A554B]">
                  {turnosSiguientes.length}
                </span>
                <span className="text-[10px] font-medium text-gray-600">
                  en espera
                </span>
              </div>
            </div>
          </div>

          {/* Lista de turnos - Con scroll optimizado */}
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 custom-scrollbar min-h-0">
            {turnosSiguientes.length === 0 ? (
              <div className="relative backdrop-blur-xl bg-white/30 rounded-xl overflow-hidden border border-white/20 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B7F2DA]/10 to-[#70A18E]/5"></div>
                <div className="relative flex flex-col items-center justify-center py-8 px-4">
                  <div className="p-3 bg-[#8ECAB2]/20 rounded-xl mb-3">
                    <Users className="w-8 h-8 text-[#70A18E]/60" />
                  </div>
                  <p className="text-xs text-gray-600 font-medium text-center">No hay turnos en espera</p>
                  <div className="flex justify-center gap-1 mt-2">
                    <div className="w-1.5 h-1.5 bg-[#70A18E] rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-[#8ECAB2] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#B7F2DA] rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                </div>
              </div>
            ) : (
              turnosSiguientes.map((turno, index) => (
                <div
                  key={turno.ck_turno}
                  className="group relative backdrop-blur-xl rounded-xl overflow-hidden border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #70A18E 0%, #8ECAB2 100%)',
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="relative flex justify-between items-center px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      {/* Turn number with glow - Compact */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/30 blur-md rounded-full"></div>
                        <div className="relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                          <span className="text-xl font-black text-white"
                            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                            {turno.i_numero_turno}
                          </span>
                        </div>
                      </div>

                      {/* Turn info - Compact */}
                      <div className="text-left">
                        <div className="font-bold text-white text-sm mb-0.5">
                          {turno.s_area}
                        </div>
                        <div className="text-xs text-white/90 font-medium mb-0.5">
                          {turno.s_servicio}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-white/80">
                          <Users className="w-2.5 h-2.5" />
                          <span>{turno.nombre_cliente}</span>
                        </div>
                      </div>
                    </div>

                    {/* Area code and time - Compact */}
                    <div className="text-right">
                      <div className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 mb-1">
                        <div className="text-base font-black text-white">
                          {turno.c_codigo_area}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-0.5 text-[10px] text-white/80">
                        <Clock className="w-2.5 h-2.5" />
                        <span>
                          {new Date(turno.t_tiempo_espera).toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Position indicator - Compact */}
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-[10px] font-bold text-white">{index + 1}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Texto giratorio / publicidad - Compacto */}
      <div className="relative overflow-hidden flex-shrink-0"
        style={{
          background: 'linear-gradient(90deg, #B7F2DA 0%, #8ECAB2 50%, #B7F2DA 100%)'
        }}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        <div className="relative flex items-center gap-2 py-1.5 px-3">
          <div className="flex-shrink-0 p-1 bg-[#70A18E] rounded shadow-lg animate-pulse">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="inline-block text-[#0d4633] font-bold text-xs animate-marquee whitespace-nowrap">
            ⚡ Sistema ITZEL - Comisión Federal de Electricidad • Somos más que energía •
            Atención eficiente y de calidad para nuestros usuarios • Innovación al servicio de México ⚡
          </p>
        </div>
      </div>

      {/* Footer - Compacto */}
      <div className="relative backdrop-blur-md bg-[#3A554B]/95 border-t border-white/10 flex-shrink-0"
        style={{ boxShadow: '0 -4px 20px rgba(58, 85, 75, 0.2)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#3A554B] via-[#5D7166] to-[#3A554B] opacity-50"></div>
        <div className="relative py-1.5 px-3 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-[#B7F2DA] rounded-full animate-pulse"></div>
            <span className="text-white/90 text-[10px] md:text-xs font-medium">
              © 2024 ITZEL - Sistema de Gestión de Turnos CFE
            </span>
            <div className="w-1.5 h-1.5 bg-[#8ECAB2] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #70A18E 0%, #8ECAB2 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #5D7166 0%, #70A18E 100%);
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default Dashboard;