import { useState, useEffect } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import Header from '../../../components/header/Header';
import { useNavigate } from 'react-router';
import QRCode from 'qrcode';
import ContractValidationModal from '../../../components/modals/ContractValidationModal';
import { useLanguage } from '../../../context/LanguageContext';
import { useLogo } from '../../../contexts/LogoContext';
import { getApiBaseUrlWithApi } from '../../../../utils/util_baseUrl';

interface Sucursal {
  ck_sucursal: string;
  s_nombre_sucursal: string;
  s_domicilio: string;
}
// ... (interfaces Area, Servicio, Turno - sin cambios)
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
  const { t } = useLanguage();
  const { logoLight } = useLogo();
  
  // Helper function to normalize text (remove accents and convert to lowercase)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };
  
  // Helper function to translate area names
  const translateArea = (areaName: string): string => {
    if (!areaName) return '';
    const normalized = normalizeText(areaName);
    
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
    // If no translation found, return original
    return areaName;
  };
  
  // Helper function to translate area descriptions
  const translateAreaDesc = (areaName: string, desc: string): string => {
    if (!desc) return '';
    const normalizedArea = normalizeText(areaName);
    const normalizedDesc = normalizeText(desc);
    
    if (normalizedArea.includes('atencion al cliente') || normalizedArea.includes('atencion cliente') || normalizedArea.includes('customer service')) {
      return t("area.atencionClienteDesc");
    }
    if (normalizedArea.includes('cobranza') || normalizedArea.includes('collections')) {
      return t("area.cobranzaDesc");
    }
    if (normalizedArea.includes('facturacion') || normalizedArea.includes('billing')) {
      return t("area.facturacionDesc");
    }
    if (normalizedArea.includes('conexiones') || normalizedArea.includes('connections')) {
      return t("area.conexionesDesc");
    }
    if (normalizedArea.includes('servicios tecnicos') || normalizedArea.includes('servicio tecnico') || normalizedArea.includes('technical services')) {
      // Check if description matches first type (medidores, revision, cambio, calibracion)
      if (normalizedDesc.includes('revision') || normalizedDesc.includes('cambio') || normalizedDesc.includes('medidores') || normalizedDesc.includes('calibracion') || normalizedDesc.includes('meters') || normalizedDesc.includes('calibration')) {
        return t("area.serviciosTecnicosDesc1");
      }
      // Default to second type (inspecciones, dictamenes, asesoria)
      if (normalizedDesc.includes('inspeccion') || normalizedDesc.includes('dictamen') || normalizedDesc.includes('asesoria') || normalizedDesc.includes('inspection') || normalizedDesc.includes('opinion') || normalizedDesc.includes('advice')) {
        return t("area.serviciosTecnicosDesc2");
      }
      // If description doesn't match, try to infer from area name or return second type
      return t("area.serviciosTecnicosDesc2");
    }
    // If no translation found, return original
    return desc;
  };
  
  // Helper function to translate service names
  const translateService = (serviceName: string): string => {
    if (!serviceName) return '';
    const normalized = normalizeText(serviceName);
    
    // Dictamen Técnico
    if (normalized.includes('dictamen tecnico') || normalized.includes('dictamen') || normalized.includes('technical opinion')) {
      return t("service.dictamenTecnico");
    }
    // Inspección de Instalación
    if ((normalized.includes('inspeccion') || normalized.includes('inspection')) && (normalized.includes('instalacion') || normalized.includes('installation'))) {
      return t("service.inspeccionInstalacion");
    }
    // Consulta de Recibo
    if (normalized.includes('consulta') && (normalized.includes('recibo') || normalized.includes('receipt'))) {
      return t("service.consultaRecibo");
    }
    // Reporte de Fallas
    if ((normalized.includes('reporte') || normalized.includes('report')) && (normalized.includes('fallas') || normalized.includes('failure') || normalized.includes('fault'))) {
      return t("service.reporteFallas");
    }
    // Cambio de Titularidad
    if ((normalized.includes('cambio') || normalized.includes('change')) && (normalized.includes('titularidad') || normalized.includes('ownership') || normalized.includes('owner'))) {
      return t("service.cambioTitularidad");
    }
    // If no translation found, return original
    return serviceName;
  };
  
  // Helper function to translate service descriptions
  const translateServiceDesc = (serviceName: string, desc: string): string => {
    if (!desc) return '';
    const normalized = normalizeText(serviceName);
    
    // Dictamen Técnico
    if (normalized.includes('dictamen tecnico') || normalized.includes('dictamen') || normalized.includes('technical opinion')) {
      return t("service.dictamenTecnicoDesc");
    }
    // Inspección de Instalación
    if ((normalized.includes('inspeccion') || normalized.includes('inspection')) && (normalized.includes('instalacion') || normalized.includes('installation'))) {
      return t("service.inspeccionInstalacionDesc");
    }
    // Consulta de Recibo
    if (normalized.includes('consulta') && (normalized.includes('recibo') || normalized.includes('receipt'))) {
      return t("service.consultaReciboDesc");
    }
    // Reporte de Fallas
    if ((normalized.includes('reporte') || normalized.includes('report')) && (normalized.includes('fallas') || normalized.includes('failure') || normalized.includes('fault'))) {
      return t("service.reporteFallasDesc");
    }
    // Cambio de Titularidad
    if ((normalized.includes('cambio') || normalized.includes('change')) && (normalized.includes('titularidad') || normalized.includes('ownership') || normalized.includes('owner'))) {
      return t("service.cambioTitularidadDesc");
    }
    // If no translation found, return original
    return desc;
  };
  const [currentStep, setCurrentStep] = useState<'clientType' | 'serviceSelection' | 'ticket'>('clientType');
  const [esCliente, setEsCliente] = useState<boolean | null>(null);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState<Area | null>(null);

  const [turnoCreado, setTurnoCreado] = useState<Turno | null>(null);
  const [notificacion, setNotificacion] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'creating' | 'canceling'>('idle');
  const [countdown, setCountdown] = useState(20);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const INACTIVITY_TIME = 60;
  const [timer, setTimer] = useState(INACTIVITY_TIME);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [validatedClient, setValidatedClient] = useState<any>(null);

  // Estado para controlar el modal de privacidad. Se inicia en true.
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Controlar navegación
  const navigate = useNavigate();

  // ... (todos los useEffect - sin cambios)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      navigate("/"); // redirige a la página principal
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate]);


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
      setShowConfirmation(false);
      setServicioSeleccionado(null);
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

  // useEffect para generar el QR cuando se crea el turno
  useEffect(() => {
    if (turnoCreado && currentStep === 'ticket') {
      generarQR();
    }
  }, [turnoCreado, currentStep]);


  // ... (todas las funciones de carga y manejo de lógica - sin cambios)
  const cargarAreas = async () => {
    if (!sucursalSeleccionada) return;

    try {
      const response = await fetch(`${getApiBaseUrlWithApi()}/operaciones/turnos/areas/${sucursalSeleccionada.ck_sucursal}?esCliente=${esCliente ? 1 : 0}`);
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
        `${getApiBaseUrlWithApi()}/operaciones/turnos/servicios/${areaSeleccionada.ck_area}?esCliente=${esCliente ? 1 : 0}`
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

    if (isClient) {
      // Si es cliente, abrir modal de validación de contrato
      setShowContractModal(true);
    } else {
      // Si no es cliente, continuar directamente
      setEsCliente(false);
      setCurrentStep('serviceSelection');
      setTimer(INACTIVITY_TIME);
      setShowConfirmation(false);
      setServicioSeleccionado(null);
    }
  };

  const handleContractValidationSuccess = (clientData: any) => {
    setValidatedClient(clientData);
    setEsCliente(true);
    setCurrentStep('serviceSelection');
    setTimer(INACTIVITY_TIME);
    setShowConfirmation(false);
    setServicioSeleccionado(null);
    setShowContractModal(false);
  };

  const seleccionarArea = (area: Area) => {
    if (areaSeleccionada?.ck_area === area.ck_area) return;
    setAreaSeleccionada(area);
    setServicios([]);
    setTimer(INACTIVITY_TIME);
  };

  const handleServicioClick = (servicio: Servicio) => {
    setServicioSeleccionado(servicio);
    setShowConfirmation(true);
  };

  const confirmarTurno = async () => {
    if (!servicioSeleccionado) return;

    setShowConfirmation(false);
    await crearTurno(servicioSeleccionado);
  };

  const cancelarTurno = () => {
    setShowConfirmation(false);
    setServicioSeleccionado(null);
    setTimer(INACTIVITY_TIME);
  };

  const crearTurno = async (servicio: Servicio) => {
    if (!sucursalSeleccionada || !areaSeleccionada) return;

    setLoadingState('creating');

    
    try {
      const response = await fetch(`${getApiBaseUrlWithApi()}/operaciones/turnos/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ck_area: areaSeleccionada.ck_area,
          ck_sucursal: sucursalSeleccionada.ck_sucursal,
          ck_servicio: servicio.ck_servicio,
          es_cliente: esCliente,
          ck_cliente: null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTurnoCreado(data.turno);
        setCurrentStep('ticket');
        setCountdown(30);
      } else {
        alert('Error al crear el turno: ' + data.message);
      }
    } catch (error) {
      console.error('Error al crear turno:', error);
      alert('Error al crear el turno');
    } finally {

      setLoadingState('idle');
    }
  };

  const descargarTicket = async () => {
    if (!turnoCreado) return;

    try {
      const response = await fetch(
        `${getApiBaseUrlWithApi()}/operaciones/turnos/ticket/${turnoCreado.ck_turno}/pdf`,
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

  const generarQR = async () => {
    if (!turnoCreado) return;

    try {
      // URL que apunta al endpoint de descarga del PDF
      const downloadUrl = `${getApiBaseUrlWithApi()}/operaciones/turnos/ticket/${turnoCreado.ck_turno}/pdf`;

      // Generar el código QR
      const qrDataURL = await QRCode.toDataURL(downloadUrl, {
        width: 150,
        margin: 2,
        color: {
          dark: '#3A554B', // Color del QR
          light: '#FFFFFF' // Color de fondo
        }
      });

      setQrCodeUrl(qrDataURL);
    } catch (error) {
      console.error('Error al generar el QR:', error);
    }
  };

  const handleCancelarTurno = async () => {
    // Asegurarnos que hay un turno creado
    if (!turnoCreado) {
      alert("No hay un turno seleccionado para cancelar.");
      return;
    }

    setLoadingState('canceling');

    try {
      // Llamamos a la API pública
      const response = await fetch(
        `${getApiBaseUrlWithApi()}/operaciones/turnos/cancelar/${turnoCreado.ck_turno}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (response.ok) {
        setLoadingState('idle');
        setNotificacion(data.message || 'Turno cancelado exitosamente');
        setTimeout(() => {
          setNotificacion(null);
          regresarAlInicio();
        }, 1500);
      } else {
        setLoadingState('idle');
        throw new Error(data.message || 'Error al cancelar el turno');
      }

    } catch (error) {

      console.error('Error al cancelar el turno:', error);

      let errorMessage = 'No se pudo cancelar el turno.';
      if (error instanceof Error) {
        // Si es un error estándar, usamos su mensaje
        errorMessage = `Error: ${error.message}`;
      }

      alert(errorMessage);
      setLoadingState('idle');
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
    setShowConfirmation(false);
    setServicioSeleccionado(null);
    setShowPrivacyModal(false); // Muestra el modal al regresar al inicio
  };


  // ... (renderCancelModal, - sin cambios)
  const renderCancelModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto border border-white/20">

        {/* Header (Rojo para 'cancelar') */}
        <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-6 rounded-t-2xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Confirmar Cancelación</h3>
          <p className="text-white/80 text-sm">
            ¿Estás seguro de que deseas cancelar este turno?
          </p>
        </div>

        {/* Detalles y Botones */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-center">
              <div className="text-xs text-gray-500">{t("starter.turnToCancel")}</div>
              <div className="font-semibold text-[#3A554B] text-lg">
                {t("starter.turnNumber")} {turnoCreado?.i_numero_turno}
              </div>
              <div className="font-semibold text-gray-600 text-sm">
                {turnoCreado?.s_servicio ? translateService(turnoCreado.s_servicio) : ''}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowCancelModal(false)} // <-- Solo cierra el modal
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              No, regresar
            </button>
            <button
              onClick={() => {
                setShowCancelModal(false); // Cierra el modal
                handleCancelarTurno();     // Llama a la lógica
              }}
              className="flex-1 bg-gradient-to-r from-[#e66f6f] to-[#ef2525] hover:from-[#ef2525] hover:to-[#e66f6f] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              Sí, cancelar turno
            </button>
          </div>
        </div>
      </div>
    </div>
  );



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
                  {t("starter.clientType")}
                </h2>
              </div>
            </div>
            <p className="text-gray-700 text-sm md:text-base font-medium max-w-2xl mx-auto">
              {t("starter.selectProfile")}
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
                    {t("starter.notClient")}
                  </h3>
                  <p className="text-xs md:text-sm text-[#3A554B]/80 font-medium">
                    {t("starter.notClientDesc")}
                  </p>

                  {/* Arrow indicator */}
                  <div className="pt-2 flex items-center justify-center gap-2 text-[#3A554B] group-hover:gap-4 transition-all">
                    <span className="text-xs md:text-sm font-bold">{t("starter.select")}</span>
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
                <div className="flex items-center gap-2 px-2 py-0.5 bg-[#B7F2DA] rounded-full text-xs font-bold text-[#3A554B] shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polygon points="12,2 22,9 12,22 2,9" stroke="#3A554B" strokeWidth="2" fill="#B7F2DA" />
                  </svg>
                  {t("starter.largeUsers")}
                </div>
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
                    {t("starter.cfeClient")}
                  </h3>
                  <p className="text-xs md:text-sm text-[#B7F2DA] font-medium">
                    {t("starter.cfeClientDesc")}
                  </p>

                  {/* Arrow indicator */}
                  <div className="pt-2 flex items-center justify-center gap-2 text-white group-hover:gap-4 transition-all">
                    <span className="text-xs md:text-sm font-bold">{t("starter.select")}</span>
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

          </div> {/* <<< FIN DEL GRID DE BOTONES */}


           {/* +++ INICIO: BOTÓN DE AVISO DE PRIVACIDAD +++ */}
           <div className="text-center mt-6">
             <button
               // Al hacer clic, mostramos el modal de privacidad
               onClick={() => setShowPrivacyModal(true)}
               className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] hover:from-[#547A6B] hover:to-[#70A18E] text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#8ECAB2]/50 text-sm"
             >
               {t("starter.privacyNotice")}
             </button>
           </div>
           {/* +++ FIN: BOTÓN DE AVISO DE PRIVACIDAD +++ */}


          {/* Warning message with modern style - Compacto */}
          {!sucursalSeleccionada && (
            <div className="max-w-2xl mx-auto mt-6"> {/* Añadido mt-6 para separarlo del nuevo botón */}
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
                      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-1">{t("starter.attention")}</h4>
                      <p className="text-xs md:text-sm text-gray-700">
                        {t("starter.selectBranchFirst")}
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


  // Función para obtener el icono del servicio
  const getServiceIcon = (servicio: string) => {
    const serviceName = servicio.toLowerCase();
    if (serviceName.includes('administracion') || serviceName.includes('administración')) {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      );
    } else if (serviceName.includes('bajas')) {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      );
    } else if (serviceName.includes('cobranza')) {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
      );
    } else if (serviceName.includes('contabilidad')) {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      );
    } else if (serviceName.includes('recursos humanos') || serviceName.includes('humanos')) {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      );
    } else if (serviceName.includes('ventas')) {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }
  };

  const renderServiceSelection = () => (
    <div className="relative">
      {/* Glassmorphism Container */}
      <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#B7F2DA]/20 via-[#8ECAB2]/10 to-[#70A18E]/20 animate-pulse"></div>

        <div className="relative p-6 lg:p-8">
          {/* Header with modern styling */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] blur-xl opacity-50 animate-pulse"></div>
                <h2 className="relative text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3A554B] via-[#5D7166] to-[#70A18E] tracking-tight">
                  {t("starter.serviceSelection")}
                </h2>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-white/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-[#3A554B]">{t("starter.client")}: {esCliente ? t("starter.cfeClientType") : t("starter.notClientType")}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-white/30">
                <svg className="w-4 h-4 text-[#70A18E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold text-[#3A554B]">{t("starter.branch")}: {sucursalSeleccionada?.s_nombre_sucursal}</span>
              </div>
            </div>
          </div>

          {/* CONTADOR */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/30 w-full max-w-sm">
              {/* Línea superior con indicador y texto */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${timer <= 10 ? 'bg-red-500' : timer <= 20 ? 'bg-amber-500' : 'bg-green-500'
                    }`}></div>
                  <span className="text-sm font-medium text-[#3A554B]">
                    {t("starter.timeRemaining")}
                    <span className={`font-bold ml-1 ${timer <= 10 ? 'text-red-600' : timer <= 20 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                      {timer}s
                    </span>
                  </span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-white/30 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-1 rounded-full transition-all duration-1000 ${timer <= 10 ? 'bg-red-500' : timer <= 20 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                  style={{ width: `${(timer / INACTIVITY_TIME) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Selección de Área */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#0A1310]">{t("starter.selectArea")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {areas.map((area) => (
                <button
                  key={area.ck_area}
                  onClick={() => seleccionarArea(area)}
                  className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#8ECAB2]/50 ${areaSeleccionada?.ck_area === area.ck_area
                      ? 'bg-gradient-to-br from-[#70A18E] to-[#547A6B] text-white shadow-2xl'
                      : 'bg-gradient-to-br from-[#B7F2DA] to-[#8ECAB2] text-[#0A1310] hover:shadow-xl'
                    }`}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <div className="relative p-6">
                    <div className="text-center">
                      <div className="font-bold text-lg mb-2">{translateArea(area.s_area)}</div>
                      {area.s_descripcion_area && (
                        <div className="text-sm opacity-90">{translateAreaDesc(area.s_area, area.s_descripcion_area)}</div>
                      )}
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full -mr-8 -mt-8"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Selección de Servicio */}
          {areaSeleccionada && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <h3 className="text-xl font-bold text-[#0A1310]">
                  {t("starter.selectService")} {translateArea(areaSeleccionada.s_area)}:
                </h3>
              </div>

              {servicios.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6H9a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V8a2 2 0 00-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">{t("starter.noServicesAvailable")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {servicios.map((servicio) => (
                    <button
                      key={servicio.ck_servicio}
                      onClick={() => handleServicioClick(servicio)}
                      disabled={loadingState !== 'idle'}
                      className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-[#8ECAB2]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
                      style={{
                        background: 'linear-gradient(135deg, #CFF4DE 0%, #B7F2DA 100%)',
                        boxShadow: '0 10px 40px -15px rgba(142, 202, 178, 0.4)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                      <div className="relative p-6">
                        {/* Icon and Header */}
                        <div className="flex items-start gap-4">
                          {getServiceIcon(servicio.s_servicio)}
                          <div className="flex-1">
                            <div className="font-bold text-lg text-[#0A1310] mb-2 group-hover:text-[#3A554B] transition-colors">
                              {translateService(servicio.s_servicio)}
                            </div>

                            {/* Description - Más cerca del título */}
                            {servicio.s_descripcion_servicio && (
                              <div className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors"> {/* mt-1 en lugar de mb-4 */}
                                {translateServiceDesc(servicio.s_servicio, servicio.s_descripcion_servicio)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action indicator - Movido fuera del flex container */}
                        <div className="flex items-center justify-between mt-4"> {/* Agregado mt-4 */}
                          <div className="flex items-center gap-2 text-[#70A18E] group-hover:gap-3 transition-all">
                            <span className="text-sm font-bold">{t("starter.select")}</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                          {loadingState === 'creating' && servicioSeleccionado?.ck_servicio === servicio.ck_servicio && (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#70A18E]"></div>
                          )}
                        </div>
                      </div>

                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-bl-full -mr-10 -mt-10"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#70A18E]/20 rounded-tr-full -ml-8 -mb-8"></div>
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
              className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#5D7166]/50"
              style={{
                background: 'linear-gradient(135deg, #5D7166 0%, #4A5B52 100%)',
                boxShadow: '0 8px 30px -10px rgba(93, 113, 102, 0.4)'
              }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <div className="relative flex items-center gap-3 px-8 py-3">
                <svg className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-white font-bold">{t("starter.returnToStart")}</span>
              </div>
            </button>
          </div>
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

  // MODAL DE CONFIRMACIÓN 
  const renderConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-6 rounded-t-2xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">¿Confirmar turno?</h3>
          <p className="text-white/80 text-sm">
            Está a punto de generar un turno para el servicio seleccionado
          </p>
        </div>

        {/* Detalles del turno */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-center mb-4">
              <h4 className="font-bold text-[#3A554B] text-lg">{servicioSeleccionado ? translateService(servicioSeleccionado.s_servicio) : ''}</h4>
              <p className="text-sm text-gray-600 mt-1">{servicioSeleccionado?.s_descripcion_servicio ? translateServiceDesc(servicioSeleccionado.s_servicio, servicioSeleccionado.s_descripcion_servicio) : ''}</p>
            </div>

            {/* Información contextual */}
            <div className="space-y-3">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-xs text-gray-500">{t("starter.area")}</div>
                <div className="font-semibold text-[#3A554B]">
                  {areaSeleccionada ? translateArea(areaSeleccionada.s_area) : ''}
                </div>
              </div>

            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <button
              onClick={cancelarTurno}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={confirmarTurno}
              disabled={loadingState !== 'idle'}
              className="flex-1 bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] hover:from-[#547A6B] hover:to-[#70A18E] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingState === 'creating' ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generando...
                </div>
              ) : (
                'Sí, confirmar turno'
              )}
            </button>
          </div>

          {/* Mensaje de advertencia */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-700">
                Una vez confirmado, el turno será generado en el sistema y deberá esperar su atención.
              </p>
            </div>
          </div>
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
              src={logoLight || "/images/Logo2/Logo%20Itzel%20CFE%20Redondo.png"}
              alt="ITZEL Logo"
              className="w-32 h-32 mx-auto mb-2 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/Logo2/Logo%20Itzel%20CFE%20Redondo.png";
              }}
            />
            <h3 className="font-bold text-lg text-[#0A1310]">SISTEMA ITZEL</h3>
            <p className="text-sm text-gray-600">{t("starter.cfe")}</p>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-[#3A554B] mb-2">
                {t("starter.turnNumber")} {turnoCreado?.i_numero_turno}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div><strong>{t("starter.area")}:</strong> {turnoCreado?.s_area ? translateArea(turnoCreado.s_area) : ''}</div>
              <div><strong>{t("starter.service")}:</strong> {turnoCreado?.s_servicio ? translateService(turnoCreado.s_servicio) : ''}</div>
              <div><strong>{t("starter.branch")}:</strong> {turnoCreado?.s_nombre_sucursal}</div>
              <div><strong>{t("starter.type")}:</strong> {esCliente ? t("starter.cfeClientType") : t("starter.notClientType")}</div>
              <div><strong>{t("starter.date")}:</strong> {new Date().toLocaleDateString('es-MX')}</div>
              <div><strong>{t("starter.time")}:</strong> {new Date().toLocaleTimeString('es-MX')}</div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-4 mt-4 text-center">
            <p className="text-xs text-gray-600">
              Por favor conserve este ticket y espere a ser llamado
            </p>
          </div>

          <div className="border-t border-gray-300 pt-4 mt-4 text-center">
            <p className="text-xs text-gray-600 mb-3">
              Escanee el código QR para descargar su ticket
            </p>
            {qrCodeUrl && (
              <div className="flex justify-center">
                <img
                  src={qrCodeUrl}
                  alt="Código QR para descargar ticket"
                  className="w-32 h-32 border border-gray-300 rounded-lg"
                />
              </div>
            )}
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
            onClick={handleCancelarTurno}
            className="w-full bg-[#e66f6f] hover:bg-[#ef2525] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Cancelar turno
          </button>


          <button
            onClick={regresarAlInicio}
            className="w-full bg-[#5D7166] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#4A5B52] transition-colors"
          >
            ← {t("starter.returnToStart")}
          </button>
        </div>

        {/* Countdown */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Regresando automáticamente en {countdown} segundos...
        </div>
      </div>
    </div>
  );

  // Función para renderizar el modal de aviso de privacidad
  const renderPrivacyModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 pt-24 pb-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-auto border border-white/20 max-h-[85vh] flex flex-col">

         {/* Header */}
         <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-6 rounded-t-2xl text-center flex-shrink-0">
           <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
             {/* Icono de privacidad (escudo) */}
             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
           </div>
           <h3 className="text-2xl font-bold text-white mb-2">{t("privacy.title")}</h3>
           <p className="text-white/90 text-sm">
             {t("privacy.subtitle")}
           </p>
         </div>

        {/* Contenido del Aviso - Con Scroll */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            
             {/* Sección 1: Responsable */}
             <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
               <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                 <span className="w-2 h-2 bg-[#70A18E] rounded-full"></span>
                 {t("privacy.dataResponsible")}
               </h4>
               <p className="text-sm text-gray-700 leading-relaxed">
                 {t("privacy.dataResponsibleText")}
               </p>
             </div>

             {/* Sección 2: Finalidad */}
             <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
               <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                 <span className="w-2 h-2 bg-[#70A18E] rounded-full"></span>
                 {t("privacy.purposeTitle")}
               </h4>
               <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                 {t("privacy.purposeText")}
               </p>
               <div className="space-y-2">
                 <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
                   <span className="text-[#70A18E] font-bold">•</span>
                   <span className="text-sm text-gray-700">{t("privacy.purpose1")}</span>
                 </div>
                 <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
                   <span className="text-[#70A18E] font-bold">•</span>
                   <span className="text-sm text-gray-700">{t("privacy.purpose2")}</span>
                 </div>
                 <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
                   <span className="text-[#70A18E] font-bold">•</span>
                   <span className="text-sm text-gray-700">{t("privacy.purpose3")}</span>
                 </div>
                 <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
                   <span className="text-[#70A18E] font-bold">•</span>
                   <span className="text-sm text-gray-700">{t("privacy.purpose4")}</span>
                 </div>
               </div>
             </div>

             {/* Sección 3: Términos y Condiciones */}
             <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
               <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                 <span className="w-2 h-2 bg-[#70A18E] rounded-full"></span>
                 {t("privacy.termsTitle")}
               </h4>
               <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                 {t("privacy.termsText")}
               </p>
               <div className="space-y-2">
                 <div className="bg-white/70 p-3 rounded-lg border-l-4 border-[#70A18E]">
                   <p className="text-sm text-gray-700"><strong className="text-gray-800">{t("privacy.term1Title")}</strong> {t("privacy.term1Text")}</p>
                 </div>
                 <div className="bg-white/70 p-3 rounded-lg border-l-4 border-[#70A18E]">
                   <p className="text-sm text-gray-700"><strong className="text-gray-800">{t("privacy.term2Title")}</strong> {t("privacy.term2Text")}</p>
                 </div>
                 <div className="bg-white/70 p-3 rounded-lg border-l-4 border-[#70A18E]">
                   <p className="text-sm text-gray-700"><strong className="text-gray-800">{t("privacy.term3Title")}</strong> {t("privacy.term3Text")}</p>
                 </div>
                 <div className="bg-white/70 p-3 rounded-lg border-l-4 border-[#70A18E]">
                   <p className="text-sm text-gray-700"><strong className="text-gray-800">{t("privacy.term4Title")}</strong> {t("privacy.term4Text")}</p>
                 </div>
                 <div className="bg-white/70 p-3 rounded-lg border-l-4 border-[#70A18E]">
                   <p className="text-sm text-gray-700"><strong className="text-gray-800">{t("privacy.term5Title")}</strong> {t("privacy.term5Text")}</p>
                 </div>
               </div>
             </div>

             {/* Sección 4: Derechos ARCO */}
             <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
               <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                 <span className="w-2 h-2 bg-[#70A18E] rounded-full"></span>
                 {t("privacy.arcoTitle")}
               </h4>
               <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                 {t("privacy.arcoText")}
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div className="bg-white p-4 rounded-lg border-l-4 border-[#70A18E] shadow-sm">
                   <h5 className="font-bold text-gray-800 mb-1 text-sm">{t("privacy.arcoAccess")}</h5>
                   <p className="text-xs text-gray-600">{t("privacy.arcoAccessDesc")}</p>
                 </div>
                 <div className="bg-white p-4 rounded-lg border-l-4 border-[#70A18E] shadow-sm">
                   <h5 className="font-bold text-gray-800 mb-1 text-sm">{t("privacy.arcoRectification")}</h5>
                   <p className="text-xs text-gray-600">{t("privacy.arcoRectificationDesc")}</p>
                 </div>
                 <div className="bg-white p-4 rounded-lg border-l-4 border-[#70A18E] shadow-sm">
                   <h5 className="font-bold text-gray-800 mb-1 text-sm">{t("privacy.arcoCancellation")}</h5>
                   <p className="text-xs text-gray-600">{t("privacy.arcoCancellationDesc")}</p>
                 </div>
                 <div className="bg-white p-4 rounded-lg border-l-4 border-[#70A18E] shadow-sm">
                   <h5 className="font-bold text-gray-800 mb-1 text-sm">{t("privacy.arcoOpposition")}</h5>
                   <p className="text-xs text-gray-600">{t("privacy.arcoOppositionDesc")}</p>
                 </div>
               </div>
             </div>

             {/* Sección 5: Protección de Datos */}
             <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
               <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                 <span className="w-2 h-2 bg-[#70A18E] rounded-full"></span>
                 {t("privacy.protectionTitle")}
               </h4>
               <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                 {t("privacy.protectionText")}
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 <div className="bg-white/70 p-3 rounded-lg text-center border border-amber-200">
                   <p className="text-xs text-gray-700 font-medium">{t("privacy.protection1")}</p>
                 </div>
                 <div className="bg-white/70 p-3 rounded-lg text-center border border-amber-200">
                   <p className="text-xs text-gray-700 font-medium">{t("privacy.protection2")}</p>
                 </div>
                 <div className="bg-white/70 p-3 rounded-lg text-center border border-amber-200">
                   <p className="text-xs text-gray-700 font-medium">{t("privacy.protection3")}</p>
                 </div>
                 <div className="bg-white/70 p-3 rounded-lg text-center border border-amber-200">
                   <p className="text-xs text-gray-700 font-medium">{t("privacy.protection4")}</p>
                 </div>
               </div>
             </div>

          </div>
        </div>

         {/* Footer con Botón */}
         <div className="p-6 border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-2xl">
           <button
             onClick={() => setShowPrivacyModal(false)}
             className="relative w-full bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] hover:from-[#547A6B] hover:to-[#70A18E] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 group overflow-hidden shadow-lg hover:shadow-xl"
           >
             {/* Efecto de brillo */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B7F2DA]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
             <span className="relative z-10 flex items-center justify-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               {t("privacy.acceptButton")}
             </span>
           </button>
           <p className="text-center text-xs text-gray-500 mt-3">
             {t("privacy.acceptFooter")}
           </p>
         </div>
      </div>
    </div>
  );


  if (loadingState !== 'idle') {
    // Determina el texto basado en el estado
    const loadingText = loadingState === 'creating'
      ? 'Generando su turno...'
      : 'Cancelando su turno...';

    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#F4F4F4] to-[#CAC9C9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3A554B] mx-auto mb-4"></div>
          {/* Usa la variable de texto dinámico */}
          <p className="text-[#3A554B] font-semibold">{loadingText}</p>
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

      {/* --- CONTENEDOR DE MODALES --- */}
      {/* Todos los modales se agrupan aquí para que se rendericen 
           por encima del contenido de la página y el blur funcione. */}

      {notificacion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-r from-[#e66f6f] to-[#ef2525] text-white font-bold text-center p-4 rounded-xl shadow-2xl border border-white/30">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{notificacion}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cancelar (ya estaba aquí) */}
      {showCancelModal && renderCancelModal()}

      {/* Modal de Privacidad (AHORA SE RENDERIZA AQUÍ) */}
      {showPrivacyModal && renderPrivacyModal()}
      
      {/* Modal de Confirmación (movido aquí para consistencia) */}
      {showConfirmation && currentStep === 'serviceSelection' && renderConfirmationModal()}
      
      {/* --- FIN CONTENEDOR DE MODALES --- */}


      <div className="h-screen flex flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F4F4F4 0%, #DFDFDF 50%, #CAC9C9 100%)'
        }}>

        <Header showBranchSelector={false} title={t("starter.title")} showLanguageToggle={true} />

        {/* El modal de confirmación se movió al contenedor de modales de arriba */}
        {/* {showConfirmation && currentStep === 'serviceSelection' && renderConfirmationModal()} */}

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
                        {t("starter.welcome")}
                      </h1>
                      <p className="text-xs md:text-sm text-gray-700 font-medium">
                        {t("starter.subtitle")}
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

            {/* Contract Validation Modal */}
            <ContractValidationModal
              isOpen={showContractModal}
              onClose={() => setShowContractModal(false)}
              onSuccess={handleContractValidationSuccess}
            />

          </div>
        </div>
      </div>
    </>
  );
}