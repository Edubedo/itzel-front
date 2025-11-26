import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrlWithApi } from "../../../utils/util_baseUrl.js";
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

  // Cerrar al hacer click fuera (solo en desktop)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const agregarToastTemporal = (mensaje: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, mensaje }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

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

      const hoy = new Date().toDateString();
      const notificacionesHoy = data.notificaciones.filter((n: Notificacion) => {
        const fechaNotif = new Date(n.fecha).toDateString();
        return fechaNotif === hoy;
      });

      const notificacionesGuardadas: Notificacion[] = JSON.parse(
        localStorage.getItem("notificacionesDropdown") || "[]"
      );

      const leidasLocal: string[] = JSON.parse(
        localStorage.getItem("notificacionesLeidas") || "[]"
      );

      const dataConLeidas = notificacionesHoy.map((n: Notificacion) => {
        const encontrada = notificacionesGuardadas.find((ng) => ng.id === n.id);
        return {
          ...n,
          leida: leidasLocal.includes(n.id),
          fechaLlegada: encontrada?.fechaLlegada ? new Date(encontrada.fechaLlegada) : new Date(),
        };
      });

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
    navigate("/operaciones/turnos/consulta");
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
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5 text-[#5D7166] dark:text-white" />
          {noLeidas.length > 0 && (
            <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center 
              w-4 h-4 text-[10px] font-bold leading-none text-white bg-[#70A18E] rounded-full shadow-sm">
              {noLeidas.length > 9 ? "9+" : noLeidas.length}
            </span>
          )}
        </button>

        {/* Dropdown responsivo */}
        {abierto && (
          <div className="fixed inset-0 z-50 lg:absolute lg:inset-auto lg:right-0 lg:top-12 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setAbierto(false)}
            />
            <div
              className="relative w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-96 max-w-3xl
                         bg-white dark:bg-[#1E1E1E]
                         shadow-lg rounded-2xl border border-[#8ECAB2] dark:border-gray-700
                         flex flex-col max-h-[90vh] overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-[#8ECAB2] bg-[#F2FBF7] dark:bg-[#2A2A2A]">
                <h4 className="font-semibold text-[#5D7166] dark:text-white text-lg">
                  {t("notifications.title")}
                </h4>
                <button
                  onClick={() => setAbierto(false)}
                  className="text-[#5D7166] dark:text-white hover:text-[#70A18E] lg:hidden"
                >
                  ✕
                </button>
              </div>

              {/* Cuerpo */}
              <div className="p-4 space-y-3 overflow-y-auto flex-1">
                {nuevas.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-[#70A18E] uppercase tracking-wide">
                      {t("notifications.newShifts")}
                    </p>
                    {nuevas.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleClickNotificacion(n)}
                        className={`p-3 rounded-xl cursor-pointer border transition-all duration-150 
                          ${
                            n.leida
                              ? "bg-[#F2FBF7] border-[#8ECAB2] text-[#5D7166] dark:bg-[#2A2A2A] dark:border-gray-700 dark:text-gray-300"
                              : "bg-[#E6F4EE] border-[#70A18E] text-[#2E4A3E] hover:bg-[#D4EEE4] dark:bg-[#344E41] dark:border-[#8ECAB2] dark:text-white"
                          }`}
                      >
                        <p className="text-sm font-medium">
                          {t("notifications.shift")}{" "}
                          <span className="font-bold">{n.numero_turno}</span> - {n.s_servicio}{" "}
                          <span className="text-xs text-[#5D7166] dark:text-gray-400">({n.s_area})</span>
                        </p>
                        <span className="text-xs text-[#5D7166] dark:text-gray-400">
                          {n.fechaLlegada?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </>
                )}

                {nuevas.length === 0 && recordatorios.length === 0 && (
                  <p className="text-sm text-center text-[#5D7166] italic dark:text-gray-400">
                    {t("notifications.noNewNotifications")}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-[#8ECAB2] bg-[#F2FBF7] dark:border-gray-700 dark:bg-[#2A2A2A] text-center">
                <button
                  onClick={() => {
                    setAbierto(false);
                    navigate("/notificaciones");
                  }}
                  className="text-sm font-semibold text-[#70A18E] hover:text-[#5D7166] transition-colors dark:text-[#8ECAB2] dark:hover:text-white"
                >
                  {t("notifications.viewAll")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-3 z-50">
        {toasts.map((t, idx) => (
          <div
            key={t.id}
            className="px-4 py-3 rounded-lg shadow-md text-sm font-medium"
            style={{
              backgroundColor: "#70A18E",
              color: "white",
              transform: `translateY(-${idx * 64}px)`,
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
