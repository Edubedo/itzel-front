import { useEffect, useState, useMemo } from "react";
import Button from "../ui/button/Button";
import { Bell, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

interface Notificacion {
  id: string;
  mensaje: string;
  area?: string;
  fecha?: string;
  fechaLlegada?: string;
  leida?: boolean;
  sucursal?: string;
  servicio?: string;
  numero_turno?: string;
}

export default function VistaNotificaciones() {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [filtro, setFiltro] = useState<"todas" | "noLeidas" | "leidas">("todas");
  const { t } = useLanguage();

  // Limpieza diaria de notificaciones leídas
  useEffect(() => {
    const ultimaFecha = localStorage.getItem("ultimaFechaNotificaciones");
    const hoy = new Date().toISOString().split("T")[0];
    if (ultimaFecha !== hoy) {
      localStorage.setItem("notificacionesLeidas", JSON.stringify([]));
      localStorage.setItem("ultimaFechaNotificaciones", hoy);
    }
  }, []);

  // Cargar notificaciones sincronizadas desde el dropdown
  const cargar = () => {
    const dataStr = localStorage.getItem("notificacionesDropdown") || "[]";
    const data: Notificacion[] = JSON.parse(dataStr);
    const leidasLocal: string[] = JSON.parse(localStorage.getItem("notificacionesLeidas") || "[]");
    const ahora = new Date().toISOString();

    const sincronizadas = data.map((n) => ({
      ...n,
      leida: leidasLocal.includes(n.id),
      fechaLlegada: n.fechaLlegada || ahora,
    }));

    setNotificaciones(sincronizadas);
  };

  useEffect(() => {
    cargar();
    const listener = () => cargar();
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  const handleMarcarComoLeida = (n: Notificacion) => {
    if (!n.leida) {
      const leidasLocal: string[] = JSON.parse(localStorage.getItem("notificacionesLeidas") || "[]");
      localStorage.setItem("notificacionesLeidas", JSON.stringify([...leidasLocal, n.id]));
      setNotificaciones((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, leida: true } : item))
      );
      localStorage.setItem("syncNotificaciones", Date.now().toString());
    }
  };

  const handleClickNotificacion = (n: Notificacion) => {
    handleMarcarComoLeida(n);
    navigate("/operaciones/turnos/consulta", {
      state: { sucursalId: n.sucursal, turnoId: n.id },
    });
  };

  const notificacionesFiltradas = useMemo(
    () =>
      notificaciones.filter((n) =>
        filtro === "todas" ? true : filtro === "leidas" ? !!n.leida : !n.leida
      ),
    [notificaciones, filtro]
  );

  return (
    <div className="p-6 space-y-4 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-2xl shadow-lg transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#6B8E7E] dark:text-[#9DC3B4]" /> {t("notifications.title")}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="text-[#6B8E7E] hover:text-[#56766A] dark:text-[#9DC3B4] dark:hover:text-[#B9E3D5] font-bold text-4xl"
          title={t("notifications.close")}
        >
          ×
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 border-b border-gray-200 dark:border-gray-700 pb-2 mt-2">
        {(["todas", "noLeidas", "leidas"] as const).map((tipo) => {
          const labels: Record<typeof tipo, string> = {
            todas: t("notifications.all"),
            noLeidas: t("notifications.unread"),
            leidas: t("notifications.readLabel"),
          };
          const activo = filtro === tipo;
          return (
            <button
              key={tipo}
              onClick={() => setFiltro(tipo)}
              className={`flex-1 text-center px-6 py-3 rounded-t-lg border transition-all duration-300 font-medium text-sm ${
                activo
                  ? "bg-[#6B8E7E] text-white shadow-sm dark:bg-[#9DC3B4] dark:text-gray-900"
                  : "bg-[#E9F5EF] text-gray-700 border-[#A6C0B3] hover:bg-[#D7EBE0] dark:bg-gray-800 dark:text-gray-300 dark:border-[#56766A] dark:hover:bg-gray-700"
              }`}
            >
              {labels[tipo]}
            </button>
          );
        })}
      </div>

      {/* Lista de notificaciones */}
      <div className="grid gap-4 mt-2 max-h-[520px] overflow-y-auto">
        {notificacionesFiltradas.length > 0 ? (
          notificacionesFiltradas.map((n) => (
            <div
              key={n.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                n.leida
                  ? "opacity-70 border-gray-300 dark:border-gray-600 bg-[#F7FBF9] dark:bg-gray-800"
                  : "border-[#6B8E7E] bg-[#E9F5EF] hover:bg-[#D7EBE0] dark:border-[#9DC3B4] dark:bg-[#1E2A28] dark:hover:bg-[#2C3A37]"
              }`}
              onClick={() => handleClickNotificacion(n)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className={`text-lg font-medium ${
                      n.leida
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-[#3B4E45] dark:text-[#A6D5C0]"
                    }`}
                  >
                    {n.mensaje}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(n.fechaLlegada || n.fecha || Date.now()).toLocaleString()}
                  </p>
                </div>
                {!n.leida && (
                  <Button
                    className="border-[#A6C0B3] text-[#56766A] dark:text-[#9DC3B4] dark:border-[#56766A] hover:bg-[#E9F5EF] dark:hover:bg-[#2C3A37]"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarcarComoLeida(n);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> {t("notifications.markAsRead")}
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            {t("notifications.noNotifications")}
          </p>
        )}
      </div>
    </div>
  );
}
