import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrlWithApi } from '../../../utils/util_baseUrl';
import { useLanguage } from "../../context/LanguageContext";

interface Notificacion {
  id: string;
  numero_turno: string;
  s_servicio: string;
  s_area: string;
  mensaje: string;
  fecha: string;
  fechaLlegada?: Date;
  leida?: boolean;
  ck_sucursal: string;
}

interface NotificationDropdownProps {
  agregarToast?: (mensaje: string) => void;
  sucursalSeleccionada?: { ck_sucursal: string; nombre: string } | null;
}

interface Toast {
  id: string;
  mensaje: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  agregarToast,
  sucursalSeleccionada,
}) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [sucursalActiva, setSucursalActiva] = useState<{ ck_sucursal: string; nombre: string } | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]); 
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Inicializar sucursal activa
  useEffect(() => {
    if (sucursalSeleccionada) {
      setSucursalActiva(sucursalSeleccionada);
    } else {
      const sucursalGuardada = localStorage.getItem("sucursal_seleccionada");
      if (sucursalGuardada) {
        try {
          setSucursalActiva(JSON.parse(sucursalGuardada));
        } catch (error) {
          console.error("Error al cargar sucursal guardada:", error);
        }
      }
    }
  }, [sucursalSeleccionada]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para agregar toast temporal
  const agregarToastTemporal = (mensaje: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, mensaje }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  // Cargar notificaciones al cambiar sucursal
  useEffect(() => {
    if (sucursalActiva) {
      cargarNotificaciones();
      const interval = setInterval(cargarNotificaciones, 3000);
      return () => clearInterval(interval);
    }
  }, [sucursalActiva]);

  const cargarNotificaciones = async () => {
    if (!sucursalActiva) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${getApiBaseUrlWithApi()}/operaciones/turnos/notificaciones?sucursalId=${sucursalActiva.ck_sucursal}`,
        {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!Array.isArray(data.notificaciones)) {
        console.error("No hay notificaciones en la respuesta:", data);
        setNotificaciones([]);
        return;
      }

      const notificacionesGuardadas: Notificacion[] = JSON.parse(
        localStorage.getItem("notificacionesDropdown") || "[]"
      );

      const leidasLocal: string[] = JSON.parse(localStorage.getItem("notificacionesLeidas") || "[]");

      const dataConLeidas = data.notificaciones.map((n: Notificacion) => {
        const encontrada = notificacionesGuardadas.find((ng) => ng.id === n.id);
        return {
          ...n,
          leida: leidasLocal.includes(n.id),
          fechaLlegada: encontrada?.fechaLlegada ? new Date(encontrada.fechaLlegada) : new Date(),
        };
      });

      // Mostrar toast de nuevos turnos
      const prevIds = notificacionesGuardadas.map((n) => n.id);
      const nuevasNotificaciones = dataConLeidas.filter((n) => !prevIds.includes(n.id));
      nuevasNotificaciones.forEach((n) => {
        agregarToastTemporal(`${t("notifications.newShift")} ${n.numero_turno} - ${n.s_servicio}`);
      });

      setNotificaciones(dataConLeidas);
      localStorage.setItem("notificacionesDropdown", JSON.stringify(dataConLeidas));
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      setNotificaciones([]);
    }
  };

  const handleMarcarComoLeida = (n: Notificacion) => {
    if (!n.leida) {
      const leidasLocal: string[] = JSON.parse(localStorage.getItem("notificacionesLeidas") || "[]");
      localStorage.setItem("notificacionesLeidas", JSON.stringify([...leidasLocal, n.id]));

      setNotificaciones((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, leida: true } : item))
      );

      if (agregarToast) {
        agregarToast(`${t("notifications.read")} ${n.mensaje}`);
      }
    }
  };

  const handleClickNotificacion = (n: Notificacion) => {
    handleMarcarComoLeida(n);
    navigate("/turnos");
  };

  const noLeidas = notificaciones.filter((n) => !n.leida);
  const nuevas = noLeidas.filter((n) => !n.mensaje.includes("Recuerda atender"));
  const recordatorios = noLeidas.filter((n) => n.mensaje.includes("Recuerda atender"));

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Botón de campana */}
        <button
          onClick={() => setAbierto(!abierto)}
          className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[#8ECAB2] hover:bg-[#E6F4EE] transition-colors duration-200
          dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <Bell className="h-5 w-5 text-[#5D7166] dark:text-white" />
          {noLeidas.length > 0 && (
            <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center 
              w-4 h-4 text-[10px] font-bold leading-none text-white bg-[#70A18E] rounded-full shadow-md">
              {noLeidas.length > 9 ? "9+" : noLeidas.length}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {abierto && (
          <div className="absolute right-0 mt-3 w-96 bg-white shadow-lg rounded-2xl z-50 max-h-[420px] overflow-y-auto border border-[#8ECAB2]
          dark:bg-[#1E1E1E] dark:border-gray-700">
            <div className="px-4 py-3 border-b border-[#8ECAB2] bg-[#F2FBF7] rounded-t-2xl
            dark:bg-[#2A2A2A] dark:border-gray-700">
              <h4 className="font-semibold text-[#5D7166] text-lg dark:text-white">{t("notifications.title")}</h4>
            </div>

            <div className="p-4 space-y-3">
              {nuevas.length > 0 && (
                <>
                  <p className="text-sm font-semibold text-[#70A18E] uppercase tracking-wide dark:text-[#8ECAB2]">
                    {t("notifications.newShifts")}
                  </p>
                  {nuevas.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl cursor-pointer border transition-all duration-200 ${
                        n.leida
                          ? "bg-[#F2FBF7] border-[#8ECAB2] text-[#5D7166] dark:bg-[#2A2A2A] dark:border-gray-700 dark:text-gray-300"
                          : "bg-[#E6F4EE] border-[#70A18E] text-[#2E4A3E] hover:bg-[#D4EEE4] hover:border-[#5D7166] dark:bg-[#344E41] dark:border-[#8ECAB2] dark:text-white dark:hover:bg-[#3B5B4C]"
                      }`}
                      onClick={() => handleClickNotificacion(n)}
                    >
                      <p className="text-sm font-medium">
                        {t("notifications.shift")} <span className="font-bold">{n.numero_turno}</span> - {n.s_servicio} ({n.s_area})
                      </p>
                      <span className="text-xs text-[#5D7166] dark:text-gray-400">
                        {n.fechaLlegada?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </>
              )}

              {nuevas.length === 0 && recordatorios.length === 0 && (
                <p className="text-sm text-[#5D7166] text-center italic dark:text-gray-400">
                  {t("notifications.noNewNotifications")}
                </p>
              )}
            </div>

            <div className="px-4 py-3 border-t border-[#8ECAB2] bg-[#F2FBF7] rounded-b-2xl text-center
            dark:border-gray-700 dark:bg-[#2A2A2A]">
              <button
                onClick={() => {
                  setAbierto(false);
                  navigate("/notificaciones");
                }}
                className="text-sm font-semibold text-[#70A18E] hover:text-[#5D7166] transition-colors duration-200
                dark:text-[#8ECAB2] dark:hover:text-white"
              >
                {t("notifications.viewAll")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/*Toasts*/}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
        {toasts.map((t, index) => (
          <div
            key={t.id}
            className="px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor: "#70A18E",
              color: "white",
              transform: `translateY(-${index * 60}px)`,
            }}
          >
            {t.mensaje}
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationDropdown;
