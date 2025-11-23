
import React, { useState, useEffect } from "react";
import { Clipboard, Volume2, Clock, Users, Zap, MapPin } from "lucide-react";
import { useSucursalActiva } from '../../../components/header/Header';
import { getApiBaseUrlWithApi } from '../../../../utils/util_baseUrl';
import Cookies from 'js-cookie';
import { useLogo } from '../../../contexts/LogoContext';

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
  const [sucursalActiva, setSucursalActiva] = useState<Sucursal | null>(null);

  const [turnoActual, setTurnoActual] = useState<Turno | null>(null);
  const [turnosSiguientes, setTurnosSiguientes] = useState<Turno[]>([]);

  // Usar el hook personalizado para obtener la sucursal activa
  const sucursalSeleccionada = useSucursalActiva();
  const { logoLight } = useLogo();

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Cargar sucursal guardada primero (antes de cargar sucursales)
  useEffect(() => {
    // Prioridad: 1) sucursal del header, 2) localStorage
    if (sucursalSeleccionada) {
      setSucursalActiva(sucursalSeleccionada);
    } else {
      // Si no hay sucursal del header, intentar cargar de localStorage
      const sucursalGuardada = localStorage.getItem('sucursal_seleccionada');
      if (sucursalGuardada) {
        try {
          const sucursal = JSON.parse(sucursalGuardada);
          setSucursalActiva(sucursal);
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


  const cargarTurnos = async () => {
    if (!sucursalActiva) return;

    try {
      const token = Cookies.get('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };

      // Agregar token si está disponible
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${getApiBaseUrlWithApi()}/operaciones/turnos/obtenerTurnos?sucursalId=${sucursalActiva.ck_sucursal}&dashboard=true`,
        {
          headers
        }
      );
      const data = await response.json();

      if (data.success) {
        const turnos = data.turnos || [];

        // Separar turno actual (en proceso) de los siguientes (activos)
        const turnoEnProceso = turnos.find((t: Turno) => t.ck_estatus === 'PROCES');
        const turnosActivos = turnos.filter((t: Turno) => t.ck_estatus === 'ACTIVO')
          .sort((a: Turno, b: Turno) => a.i_numero_turno - b.i_numero_turno);

        setTurnoActual(turnoEnProceso || null);
        setTurnosSiguientes(turnosActivos);
      } else {
        console.error('Error en la respuesta del servidor:', data.message);
        setTurnoActual(null);
        setTurnosSiguientes([]);
      }
    } catch (error) {
      console.error('Error al cargar turnos:', error);
      setTurnoActual(null);
      setTurnosSiguientes([]);
    }
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

  // Función helper para formatear tiempo de espera
  const formatearTiempoEspera = (tiempoEspera: string | null | undefined): string => {
    if (!tiempoEspera) return '--:--';

    // Si es un string de tiempo (HH:MM:SS o HH:MM), extraer solo horas y minutos
    const tiempoMatch = tiempoEspera.match(/(\d{1,2}):(\d{2})(?::\d{2})?/);
    if (tiempoMatch) {
      const horas = parseInt(tiempoMatch[1], 10);
      const minutos = tiempoMatch[2];
      return `${String(horas).padStart(2, '0')}:${minutos}`;
    }

    // Si es una fecha válida, formatearla
    const fecha = new Date(tiempoEspera);
    if (!isNaN(fecha.getTime())) {
      return fecha.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return '--:--';
  };

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

        {/* Left side - Indicador de sucursal (solo lectura) */}
        <div className="relative z-10">
          <div className="flex items-center space-x-1.5 md:space-x-2 bg-white/10 backdrop-blur-sm text-white px-2 md:px-3 py-1.5 rounded-lg border border-white/20 shadow-lg cursor-default">
            <div className="p-0.5 bg-[#8ECAB2]/20 rounded">
              <MapPin className="w-3.5 h-3.5 text-[#B7F2DA]" />
            </div>
            <span className="font-semibold text-xs md:text-sm">
              {sucursalActiva ? sucursalActiva.s_nombre_sucursal : 'Sucursal no seleccionada'}
            </span>
          </div>
        </div>

        {/* Center - Title con Logo - Compacto */}
        <div className="relative z-10 hidden lg:block">
          <div className="flex items-center gap-3">
            {/* Logo ITZEL con efecto glassmorphism */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#8ECAB2] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-[#B7F2DA]/30 group-hover:border-[#B7F2DA]/60 transition-all duration-300 group-hover:scale-110">
                {logoLight && (
                  <img
                    src={logoLight}
                    alt="ITZEL Logo"
                    className="w-full h-full object-cover p-1.5"
                  />
                )}
              </div>
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-tight">
                PANEL DE TURNOS
              </h1>
              <p className="text-[10px] text-[#B7F2DA] font-medium">
                Sistema ITZEL • Lista de Espera
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

            {/* Logo ITZEL como watermark sutil */}
            {logoLight && (
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-15 transition-opacity duration-300">
                <img
                  src={logoLight}
                  alt="ITZEL Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
            )}

            <div className="relative flex flex-col items-center justify-center h-full py-4">
              <div className="inline-block px-4 py-1 bg-white/40 backdrop-blur-sm rounded-full border border-white/30 mb-2">
                <span className="text-xs font-bold text-[#3A554B] uppercase tracking-wider">
                  Turno en Atención
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
                      {formatearTiempoEspera(turnoActual.t_tiempo_espera)}
                    </span>
                  </div>
                  {turnoActual.d_fecha_atendido && (
                    <>
                      <div className="h-px bg-gradient-to-r from-transparent via-[#8ECAB2]/30 to-transparent"></div>
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-[#70A18E] min-w-[90px]">Inicio atención:</span>
                        <span className="text-xs text-gray-700 font-medium">
                          {new Date(turnoActual.d_fecha_atendido).toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
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
                          {formatearTiempoEspera(turno.t_tiempo_espera)}
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
              © 2025 ITZEL - Sistema de Gestión de Turnos CFE
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