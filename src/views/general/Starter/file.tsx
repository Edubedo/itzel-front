import { useState, useEffect } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import Header from '../../../components/header/Header';
import { useNavigate } from 'react-router';
import { getApiBaseUrlWithApi } from '../../../utils/util_baseUrl';

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

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | null>(null);

  // Controlar navegación

  useEffect(() => {
    // Al montar el componente, insertamos un estado "falso" en el historial
    window.history.pushState({ stay: true }, "", window.location.href);
  
    const handlePopState = (event: PopStateEvent) => {
      // Si el usuario presiona "Atrás", volvemos a meter la entrada
      window.history.pushState({ stay: true }, "", window.location.href);
  
      // Aquí puedes resetear el estado de tu página si quieres
      // Por ejemplo, regresar al paso inicial:
      setCurrentStep('clientType');
      setEsCliente(null);
      setAreaSeleccionada(null);
      setTurnoCreado(null);
      setServicios([]);
      setCountdown(20);
      setTimer(INACTIVITY_TIME);
      setShowConfirmation(false);
      setServicioSeleccionado(null);
    };
  
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  

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

    setEsCliente(isClient);
    setCurrentStep('serviceSelection');
    setTimer(INACTIVITY_TIME);
    setShowConfirmation(false);
    setServicioSeleccionado(null);
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

    setLoading(true);

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
  };

  const renderClientTypeSelection = () => (
    <div className="relative">
    
    </div>
  );

  // Función para obtener el icono del servicio
  const getServiceIcon = (servicio: string) => {
   
  };

  const renderServiceSelection = () => (
    <div className="relative">
    
    </div>
  );

  // MODAL DE CONFIRMACIÓN 
  const renderConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    </div>
  );

  const renderTicket = () => (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#5D7166] max-w-md mx-auto">
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
     
    </>
  );
}