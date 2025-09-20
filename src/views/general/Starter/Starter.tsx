import React, { useState, useEffect } from 'react';
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
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
  const [turnoCreado, setTurnoCreado] = useState<Turno | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(20);

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
      setServicioSeleccionado(null);
      setCurrentStep('clientType');
    };

    window.addEventListener('sucursalCambiada', handleSucursalCambiada as EventListener);

    return () => {
      window.removeEventListener('sucursalCambiada', handleSucursalCambiada as EventListener);
    };
  }, []);

  // Cargar áreas cuando se seleccione una sucursal
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
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      regresarAlInicio();
    }
  }, [currentStep, countdown]);

  const cargarAreas = async () => {
    if (!sucursalSeleccionada) return;

    try {
      const response = await fetch(`http://localhost:3001/api/operaciones/turnos/areas/${sucursalSeleccionada.ck_sucursal}`);
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
  };

  const seleccionarArea = (area: Area) => {
    setAreaSeleccionada(area);
    setServicioSeleccionado(null);
    setServicios([]);
  };

  const crearTurno = async (servicio: Servicio) => {
    if (!sucursalSeleccionada || !areaSeleccionada) return;

    setLoading(true);
    setServicioSeleccionado(servicio);

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
      // Realizar petición para descargar el PDF
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

      // Obtener el blob del PDF
      const pdfBlob = await response.blob();
      
      // Crear URL para descarga
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
    setServicioSeleccionado(null);
    setTurnoCreado(null);
    setServicios([]);
    setCountdown(20);
  };

  const renderClientTypeSelection = () => (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#5D7166]">
      <div className="p-6 lg:p-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#0A1310]">
            TIPO DE CLIENTE
          </h2>
          <p className="text-gray-600 mt-2">
            Seleccione el tipo de cliente para continuar
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          <button 
            onClick={() => handleClientTypeSelection(false)}
            className="bg-[#B7F2DA] hover:bg-[#8ECAB2] rounded-lg p-6 border-2 border-[#8ECAB2] transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 bg-[#8ECAB2] rounded-full flex items-center justify-center border-3 border-[#70A18E] p-2">
                <div className="w-full h-full bg-[#70A18E] rounded-full flex items-center justify-center p-3">
                  <img 
                    src="/images/icons/NoCliente.png" 
                    alt="No cliente" 
                    className="w-32 h-32 object-contain"
                  /> 
                </div>
              </div>
              <span className="text-[#0A1310] font-bold text-center text-base">
                NO SOY CLIENTE
              </span>
            </div>
          </button>
          
          <button 
            onClick={() => handleClientTypeSelection(true)}
            className="bg-[#70A18E] hover:bg-[#547A6B] rounded-lg p-6 border-2 border-[#547A6B] transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 bg-[#8ECAB2] rounded-full flex items-center justify-center border-3 border-[#B7F2DA] p-2">
                <div className="w-full h-full bg-[#B7F2DA] rounded-full flex items-center justify-center p-3">
                  <img 
                    src="/images/icons/Cliente.png" 
                    alt="Cliente" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
              <span className="text-white font-bold text-center text-base">
                SOY CLIENTE
              </span>
            </div>
          </button>
        </div>

        {!sucursalSeleccionada && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="text-center">
              <strong>Importante:</strong> Por favor seleccione una sucursal en el menú superior antes de continuar.
            </p>
          </div>
        )}
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
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  areaSeleccionada?.ck_area === area.ck_area
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

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div className="w-full max-w-6xl">
            
            {/* Welcome Message */}
            <div className="bg-[#CFF4DE] rounded-lg p-4 mb-4 text-center border-2 border-[#5D7166] max-w-2xl mx-auto">
              <h1 className="text-[#0A1310] font-bold text-xl md:text-2xl">
                EL SISTEMA ITZEL LES DA LA BIENVENIDA
              </h1>
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