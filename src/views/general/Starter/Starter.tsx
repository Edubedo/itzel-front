import { useState, useEffect } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import Header from '../../../components/header/Header';

interface Sucursal {
  ck_sucursal: string;
  s_nombre_sucursal: string;
  s_domicilio: string;
}

interface Area {
  ck_area: string;
  s_area: string;
  s_descripcion_area: string;
  c_codigo_area: string;
}

interface Servicio {
  ck_servicio: string;
  s_servicio: string;
  s_descripcion_servicio: string;
  c_codigo_servicio: string;
  i_es_para_clientes: number;
}

interface Turno {
  ck_turno: string;
  i_numero_turno: number;
  s_area: string;
  s_servicio: string;
  s_nombre_sucursal: string;
  s_domicilio: string;
  t_tiempo_espera: string;
}

export default function Starter() {
  const [currentStep, setCurrentStep] = useState<'clientType' | 'serviceSelection' | 'ticket'>('clientType');
  const [esCliente, setEsCliente] = useState<boolean | null>(null);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState<Area | null>(null);
  
  const [turnoCreado, setTurnoCreado] = useState<Turno | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(20);

  const INACTIVITY_TIME = 30;
  const [timer, setTimer] = useState(INACTIVITY_TIME);


  // Cargar sucursal seleccionada desde localStorage
  useEffect(() => {
    const sucursalGuardada = localStorage.getItem('sucursal_seleccionada');
    if (sucursalGuardada) {
      try {
        setSucursalSeleccionada(JSON.parse(sucursalGuardada));
      } catch (error) {
        console.error('Error al cargar sucursal:', error);
      }
    }

    // Escuchar cambios de sucursal
    const handleSucursalCambiada = (event: CustomEvent) => {
      setSucursalSeleccionada(event.detail);
      // Resetear selecciones cuando cambie la sucursal
      setAreas([]);
      setServicios([]);
      setAreaSeleccionada(null);
      
      setCurrentStep('clientType');
    };

    window.addEventListener('sucursalCambiada', handleSucursalCambiada as EventListener);

    return () => {
      window.removeEventListener('sucursalCambiada', handleSucursalCambiada as EventListener);
    };
  }, []);

  // Cargar áreas cuando se seleccione una sucursal y se defina el tipo de cliente
  useEffect(() => {
    if (sucursalSeleccionada && esCliente !== null) {
      cargarAreas();
    }
  }, [sucursalSeleccionada, esCliente]);

  // Cargar servicios cuando se seleccione un área
  useEffect(() => {
    if (areaSeleccionada && esCliente !== null) {
      cargarServicios();
    }
  }, [areaSeleccionada, esCliente]);

  // Countdown para regresar al inicio desde el ticket
  useEffect(() => {
    if (currentStep === 'ticket' && countdown > 0) {
      const timerId = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else if (countdown === 0) {
      regresarAlInicio();
    }
  }, [currentStep, countdown]);

  // useEffect para el temporizador de inactividad
  useEffect(() => {
    if (currentStep !== 'serviceSelection') {
      return;
    }

    if (timer <= 0) {
      console.log('Tiempo de inactividad agotado. Regresando al inicio.');
      regresarAlInicio();
      return;
    }

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentStep, timer]);

  const cargarAreas = async () => {
    if (!sucursalSeleccionada) return;

    try {
      const response = await fetch(`http://localhost:3001/api/operaciones/turnos/areas/${sucursalSeleccionada.ck_sucursal}?esCliente=${esCliente ? 1 : 0}`);
      const data = await response.json();

      if (data.success) {
        setAreas(data.areas);
      }
    } catch (error) {
      console.error('Error al cargar áreas:', error);
    }
  };

  const cargarServicios = async () => {
    if (!areaSeleccionada) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/operaciones/turnos/servicios/${areaSeleccionada.ck_area}?esCliente=${esCliente ? 1 : 0}`
      );
      const data = await response.json();

      if (data.success) {
        setServicios(data.servicios);
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
    }
  };

  const handleClientTypeSelection = (isClient: boolean) => {
    if (!sucursalSeleccionada) {
      alert('Por favor seleccione una sucursal primero');
      return;
    }

    setEsCliente(isClient);
    setCurrentStep('serviceSelection');
    setTimer(INACTIVITY_TIME);
  };

  const seleccionarArea = (area: Area) => {
    setAreaSeleccionada(area);
    setServicios([]);
  };

  const crearTurno = async (servicio: Servicio) => {
    if (!sucursalSeleccionada || !areaSeleccionada) return;

    setLoading(true);
    

    try {
      const response = await fetch('http://localhost:3001/api/operaciones/turnos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ck_area: areaSeleccionada.ck_area,
          ck_sucursal: sucursalSeleccionada.ck_sucursal,
          ck_servicio: servicio.ck_servicio,
          es_cliente: esCliente,
          ck_cliente: null // Por ahora sin cliente específico
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTurnoCreado(data.turno);
        setCurrentStep('ticket');
        setCountdown(20);
      } else {
        alert('Error al crear el turno: ' + data.message);
      }
    } catch (error) {
      console.error('Error al crear turno:', error);
      alert('Error al crear el turno');
    } finally {
      setLoading(false);
    }
  };

  const descargarTicket = async () => {
    if (!turnoCreado) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/operaciones/turnos/ticket/${turnoCreado.ck_turno}/pdf`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/pdf',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al descargar el ticket');
      }

      const pdfBlob = await response.blob();

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket-turno-${turnoCreado.i_numero_turno}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error al descargar ticket:', error);
      alert('Error al descargar el ticket. Por favor, intente nuevamente.');
    }
  };

  const regresarAlInicio = () => {
    setCurrentStep('clientType');
    setEsCliente(null);
    setAreaSeleccionada(null);
    setTurnoCreado(null);
    setServicios([]);
    setCountdown(20);
    setTimer(INACTIVITY_TIME);
  };

  

  const renderClientTypeSelection = () => (
    <div className="relative">
      {/* Glassmorphism Container */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B7F2DA]/20 via-[#8ECAB2]/10 to-[#70A18E]/20 animate-pulse"></div>

        <div className="relative p-4 md:p-6 lg:p-8">
          {/* Header with modern styling - Compacto */}
          <div className="text-center mb-6">
            <div className="inline-block mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] blur-xl opacity-50 animate-pulse"></div>
                <h2 className="relative text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3A554B] via-[#5D7166] to-[#70A18E] tracking-tight">
                  TIPO DE CLIENTE
                </h2>
              </div>
            </div>
            <p className="text-gray-700 text-sm md:text-base font-medium max-w-2xl mx-auto">
              Seleccione su perfil para acceder a nuestros servicios personalizados
            </p>
          </div>

          {/* Cards Grid with hover effects - Más compacto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 max-w-5xl mx-auto">

            {/* Card No Cliente - Compacto */}
            <button
              onClick={() => handleClientTypeSelection(false)}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#8ECAB2]/50"
              style={{
                background: 'linear-gradient(135deg, #B7F2DA 0%, #8ECAB2 100%)',
                boxShadow: '0 20px 60px -15px rgba(142, 202, 178, 0.5)'
              }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <div className="relative p-6 md:p-8">
                {/* Icon Container with 3D effect - Más pequeño */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-[#70A18E] blur-xl opacity-50 scale-75 group-hover:scale-100 transition-transform duration-500"></div>
                  <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8ECAB2] to-[#70A18E] rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#70A18E] to-[#547A6B] rounded-2xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500"></div>
                    <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                      <img
                        src="/images/icons/NoCliente.png"
                        alt="No cliente"
                        className="w-16 h-16 md:w-18 md:h-18 object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-[#0A1310] group-hover:text-[#3A554B] transition-colors">
                    NO SOY CLIENTE
                  </h3>
                  <p className="text-xs md:text-sm text-[#3A554B]/80 font-medium">
                    Acceso a servicios públicos y atención general
                  </p>

                  {/* Arrow indicator */}
                  <div className="pt-2 flex items-center justify-center gap-2 text-[#3A554B] group-hover:gap-4 transition-all">
                    <span className="text-xs md:text-sm font-bold">SELECCIONAR</span>
                    <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-bl-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#70A18E]/20 rounded-tr-full -ml-10 -mb-10"></div>
            </button>

            {/* Card Cliente CFE - Compacto */}
            <button
              onClick={() => handleClientTypeSelection(true)}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#70A18E]/50"
              style={{
                background: 'linear-gradient(135deg, #70A18E 0%, #547A6B 100%)',
                boxShadow: '0 20px 60px -15px rgba(112, 161, 142, 0.6)'
              }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Glowing badge - Más pequeño */}
              <div className="absolute top-4 right-4 px-2 py-0.5 bg-[#B7F2DA] rounded-full text-[10px] md:text-xs font-bold text-[#3A554B] shadow-lg animate-pulse">
                ⭐ PREMIUM
              </div>

              <div className="relative p-6 md:p-8">
                {/* Icon Container with 3D effect - Más pequeño */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-[#B7F2DA] blur-xl opacity-50 scale-75 group-hover:scale-100 transition-transform duration-500"></div>
                  <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B7F2DA] to-[#8ECAB2] rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8ECAB2] to-[#CFF4DE] rounded-2xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500"></div>
                    <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                      <img
                        src="/images/icons/Cliente.png"
                        alt="Cliente CFE"
                        className="w-16 h-16 md:w-18 md:h-18 object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-[#CFF4DE] transition-colors">
                    SOY CLIENTE CFE
                  </h3>
                  <p className="text-xs md:text-sm text-[#B7F2DA] font-medium">
                    Atención preferencial y servicios exclusivos
                  </p>

                  {/* Arrow indicator */}
                  <div className="pt-2 flex items-center justify-center gap-2 text-white group-hover:gap-4 transition-all">
                    <span className="text-xs md:text-sm font-bold">SELECCIONAR</span>
                    <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -mr-12 -mt-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#B7F2DA]/20 rounded-tr-full -ml-10 -mb-10"></div>
            </button>

          </div>

          {/* Warning message with modern style - Compacto */}
          {!sucursalSeleccionada && (
            <div className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 p-[2px] animate-pulse">
                <div className="bg-white rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-1">¡Atención!</h4>
                      <p className="text-xs md:text-sm text-gray-700">
                        Por favor seleccione una <strong>sucursal</strong> en el menú superior antes de continuar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#8ECAB2] rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#B7F2DA] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#70A18E] rounded-full opacity-50 animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );

  const renderServiceSelection = () => (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#5D7166]">
      <div className="p-6 lg:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#0A1310]">
            SELECCIÓN DE SERVICIO
          </h2>
          <p className="text-gray-600 mt-2">
            Cliente: {esCliente ? 'Cliente CFE' : 'No cliente'} | Sucursal: {sucursalSeleccionada?.s_nombre_sucursal}
          </p>
        </div>

        {/* Selección de Área */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#0A1310] mb-4">1. Seleccione el área:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area) => (
              <button
                key={area.ck_area}
                onClick={() => seleccionarArea(area)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${areaSeleccionada?.ck_area === area.ck_area
                    ? 'bg-[#70A18E] text-white border-[#547A6B]'
                    : 'bg-[#B7F2DA] hover:bg-[#8ECAB2] text-[#0A1310] border-[#8ECAB2]'
                  }`}
              >
                <div className="text-center">
                  <div className="font-bold text-sm">{area.c_codigo_area}</div>
                  <div className="font-semibold">{area.s_area}</div>
                  {area.s_descripcion_area && (
                    <div className="text-xs mt-1 opacity-90">{area.s_descripcion_area}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selección de Servicio */}
        {areaSeleccionada && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#0A1310] mb-4">
              2. Seleccione el servicio en {areaSeleccionada.s_area}:
            </h3>
            {servicios.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay servicios disponibles para esta área
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {servicios.map((servicio) => (
                  <button
                    key={servicio.ck_servicio}
                    onClick={() => crearTurno(servicio)}
                    disabled={loading}
                    className="bg-[#CFF4DE] hover:bg-[#B7F2DA] rounded-lg p-4 border-2 border-[#8ECAB2] transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-left">
                      <div className="font-bold text-[#0A1310]">{servicio.s_servicio}</div>
                      {servicio.s_descripcion_servicio && (
                        <div className="text-sm text-gray-600 mt-1">
                          {servicio.s_descripcion_servicio}
                        </div>
                      )}
                      {servicio.c_codigo_servicio && (
                        <div className="text-xs text-gray-500 mt-1">
                          Código: {servicio.c_codigo_servicio}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botón de regreso */}
        <div className="flex justify-center">
          <button
            onClick={regresarAlInicio}
            className="bg-[#5D7166] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#4A5B52] transition-colors"
          >
            ← Regresar al inicio
          </button>
        </div>
      </div>
    </div>
  );

  const renderTicket = () => (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#5D7166] max-w-md mx-auto">
      <div className="bg-[#3A554B] text-white p-4 text-center">
        <h2 className="text-xl font-bold">¡SERVICIO ASIGNADO!</h2>
        <p className="text-[#B7F2DA]">Su turno ha sido generado exitosamente</p>
      </div>

      <div className="p-6">
        {/* Ticket Visual */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <img
              src="/images/Logo2/Logo%20Itzel%20CFE%20Redondo.png"
              alt="ITZEL Logo"
              className="w-32 h-32 mx-auto mb-2"
            />
            <h3 className="font-bold text-lg text-[#0A1310]">SISTEMA ITZEL</h3>
            <p className="text-sm text-gray-600">Comisión Federal de Electricidad</p>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-[#3A554B] mb-2">
                TURNO No. {turnoCreado?.i_numero_turno}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div><strong>Área:</strong> {turnoCreado?.s_area}</div>
              <div><strong>Servicio:</strong> {turnoCreado?.s_servicio}</div>
              <div><strong>Sucursal:</strong> {turnoCreado?.s_nombre_sucursal}</div>
              <div><strong>Tipo:</strong> {esCliente ? 'Cliente CFE' : 'No cliente'}</div>
              <div><strong>Fecha:</strong> {new Date().toLocaleDateString('es-MX')}</div>
              <div><strong>Hora:</strong> {new Date().toLocaleTimeString('es-MX')}</div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 mt-4 text-center">
            <p className="text-xs text-gray-600">
              Por favor conserve este ticket y espere a ser llamado
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={descargarTicket}
            className="w-full bg-[#70A18E] hover:bg-[#547A6B] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            📄 Descargar Ticket
          </button>

          <button
            onClick={regresarAlInicio}
            className="w-full bg-[#5D7166] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#4A5B52] transition-colors"
          >
            ← Regresar al inicio
          </button>
        </div>

        {/* Countdown */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Regresando automáticamente en {countdown} segundos...
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#F4F4F4] to-[#CAC9C9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3A554B] mx-auto mb-4"></div>
          <p className="text-[#3A554B] font-semibold">Generando su turno...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Starter Users - ITZEL"
        description="Sistema de gestión de turnos ITZEL - Página inicial de selección de tipo de cliente"
      />

      <div className="h-screen flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F4F4F4 0%, #DFDFDF 50%, #CAC9C9 100%)'
        }}>

        <Header showBranchSelector={true} title="Solicitud de Turnos" />

        {/* Main Content - Optimizado para caber en pantalla */}
        <div className="flex-1 flex items-center justify-center px-4 py-2 overflow-auto relative z-0">
          <div className="w-full max-w-6xl my-auto">

            {/* Welcome Message - Compacto */}
            <div className="relative max-w-3xl mx-auto mb-4 z-0">
              <div className="backdrop-blur-xl bg-white/30 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#70A18E]/20 via-[#8ECAB2]/20 to-[#B7F2DA]/20 animate-pulse"></div>

                <div className="relative py-3 px-6">
                  <div className="flex items-center justify-center gap-3">
                    {/* Icon/Logo side - Más pequeño */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#8ECAB2] blur-xl opacity-40"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-6 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Text side - Compacto */}
                    <div className="text-center">
                      <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3A554B] to-[#70A18E] tracking-tight">
                        BIENVENIDO A ITZEL
                      </h1>
                      <p className="text-xs md:text-sm text-gray-700 font-medium">
                        Sistema Inteligente de Turnos • CFE
                      </p>
                    </div>

                    {/* Decorative element */}
                    <div className="hidden md:flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[#70A18E] rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-[#8ECAB2] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-[#B7F2DA] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Content Based on Step */}
            {currentStep === 'clientType' && renderClientTypeSelection()}
            {currentStep === 'serviceSelection' && renderServiceSelection()}
            {currentStep === 'ticket' && renderTicket()}

          </div>
        </div>
      </div>
    </>
  );
}