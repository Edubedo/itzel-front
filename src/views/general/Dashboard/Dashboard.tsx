// dashboard.tsx   !!!!

import React, { useState, useEffect } from "react";
import { Clipboard, Volume2, Clock, ChevronDown } from "lucide-react";
import { useSucursalActiva } from '../../../components/header/Header';

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
  const [loading, setLoading] = useState(false);

  // Usar el hook personalizado para obtener la sucursal activa
  const sucursalSeleccionada = useSucursalActiva();

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
      const response = await fetch('http://localhost:3001/api/operaciones/turnos/sucursales');
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

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/operaciones/turnos/obtenerTurnos?sucursalId=${sucursalActiva.ck_sucursal}`
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
    } finally {
      setLoading(false);
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-[#1b3528] text-white px-6 py-3 relative">
        {/* Selector de sucursal */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-base md:text-lg font-semibold hover:bg-[#2d4a37] px-3 py-2 rounded transition-colors"
          >
            <span>
              {sucursalActiva ? sucursalActiva.s_nombre_sucursal : 'Seleccionar sucursal'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute mt-2 bg-white text-black rounded shadow-lg z-50 w-80 max-h-64 overflow-y-auto">
              {sucursales.length === 0 ? (
                <div className="p-4 text-gray-500 text-center">
                  No hay sucursales disponibles
                </div>
              ) : (
                sucursales.map((sucursal) => (
                  <button
                    key={sucursal.ck_sucursal}
                    className={`block w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 ${
                      sucursalActiva?.ck_sucursal === sucursal.ck_sucursal ? 'bg-green-50' : ''
                    }`}
                    onClick={() => seleccionarSucursal(sucursal)}
                  >
                    <div className="font-medium text-gray-900">
                      {sucursal.s_nombre_sucursal}
                    </div>
                    {sucursal.s_domicilio && (
                      <div className="text-sm text-gray-600">
                        {sucursal.s_domicilio}
                      </div>
                    )}
                    {(sucursal.s_municipio || sucursal.s_estado) && (
                      <div className="text-xs text-gray-500">
                        {sucursal.s_municipio && sucursal.s_estado 
                          ? `${sucursal.s_municipio}, ${sucursal.s_estado}`
                          : sucursal.s_municipio || sucursal.s_estado
                        }
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Fecha y hora */}
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5" />
          <div className="text-right leading-tight">
            <div className="text-sm md:text-base font-semibold">
              {formattedTime}
            </div>
            <div className="text-xs md:text-sm">{formattedDate}</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 p-4 bg-[#f5f5f0]">
        {/* Columna IZQUIERDA - Turno Actual */}
        <div className="flex flex-col gap-4">
          {/* Encabezado turno actual */}
          <div className="bg-[#f0e7c8] px-4 py-3 rounded shadow">
            <h2 className="text-xl md:text-2xl font-bold uppercase">
              Turno Actual
            </h2>
            {sucursalActiva && (
              <p className="text-sm text-gray-600 mt-1">
                {sucursalActiva.s_nombre_sucursal}
              </p>
            )}
          </div>

          {/* Número de turno */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#eaf4e2] to-[#d6e5c7] rounded shadow flex-1 py-10">
            <span className="text-lg font-semibold mb-2">TURNO ACTUAL</span>
            <span className="text-8xl font-bold text-black">
              {turnoActual ? turnoActual.i_numero_turno : "--"}
            </span>
            {turnoActual && (
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-600">Cliente:</div>
                <div className="font-medium">{turnoActual.nombre_cliente}</div>
                {turnoActual.nombre_asesor && (
                  <>
                    <div className="text-sm text-gray-600 mt-2">Atendido por:</div>
                    <div className="font-medium">{turnoActual.nombre_asesor}</div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Área y servicio */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-center items-center bg-[#f0e7c8] rounded shadow py-3">
              <span className="text-sm font-semibold uppercase">Área</span>
              <Volume2 className="w-6 h-6 mt-1" />
            </div>
            <div className="flex items-center justify-center bg-[#a7c08d] rounded shadow">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {turnoActual ? turnoActual.c_codigo_area : "--"}
                </div>
                {turnoActual && (
                  <div className="text-sm text-white opacity-90">
                    {turnoActual.s_area}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información adicional */}
          {turnoActual && (
            <div className="bg-white rounded shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Información del servicio</h3>
              <div className="text-sm text-gray-600">
                <div><strong>Servicio:</strong> {turnoActual.s_servicio}</div>
                <div><strong>Hora de llegada:</strong> {
                  new Date(turnoActual.t_tiempo_espera).toLocaleTimeString('es-MX')
                }</div>
                {turnoActual.d_fecha_atendido && (
                  <div><strong>Inicio de atención:</strong> {
                    new Date(turnoActual.d_fecha_atendido).toLocaleTimeString('es-MX')
                  }</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Columna DERECHA - Próximos Turnos */}
        <div className="flex flex-col gap-4">
          {/* Encabezado */}
          <div className="bg-[#f0e7c8] px-4 py-3 rounded shadow flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold uppercase">
              Próximos Turnos
            </h2>
            <div className="flex items-center gap-2">
              <Clipboard className="w-5 h-5" />
              <span className="text-sm">
                {loading ? `${turnosSiguientes.length} en espera` : `${turnosSiguientes.length} en espera`}
              </span>
            </div>
          </div>

          {/* Lista de turnos */}
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {turnosSiguientes.length === 0 ? (
              <div className="flex items-center justify-center h-32 bg-gray-100 rounded text-gray-500">
                No hay turnos en espera
              </div>
            ) : (
              turnosSiguientes.slice(0, 8).map((turno) => (
                <div
                  key={turno.ck_turno}
                  className="flex justify-between items-center bg-[#a7c08d] hover:bg-[#91ab78] text-white rounded shadow px-6 py-4 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold">{turno.i_numero_turno}</span>
                    <div className="text-left">
                      <div className="font-medium">{turno.s_area}</div>
                      <div className="text-sm opacity-90">{turno.s_servicio}</div>
                      <div className="text-xs opacity-75">{turno.nombre_cliente}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium">{turno.c_codigo_area}</div>
                    <div className="text-xs opacity-75">
                      {new Date(turno.t_tiempo_espera).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Más turnos indicador */}
          {turnosSiguientes.length > 8 && (
            <div className="bg-gray-200 rounded shadow p-3 text-center text-gray-600">
              + {turnosSiguientes.length - 8} turnos más en espera
            </div>
          )}
        </div>
      </div>

      {/* Texto giratorio / publicidad */}
      <div className="bg-[#d5f2dd] overflow-hidden whitespace-nowrap">
        <p className="inline-block text-[#0d4633] font-bold text-sm md:text-base animate-marquee py-2">
          Sistema ITZEL - Comisión Federal de Electricidad — Somos más que energía — 
          Atención eficiente y de calidad para nuestros usuarios
        </p>
      </div>

      {/* Footer */}
      <div className="bg-[#1b3528] text-white text-xs text-center p-2">
        © ITZEL - Sistema de Gestión de Turnos CFE
      </div>
    </div>
  );
};

export default Dashboard;
