import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Bell, CheckCircle } from "lucide-react";
import { getNotificaciones, marcarComoLeida } from "../../services/notificacionesService";
import { useNavigate } from "react-router-dom";

interface Notificacion {
  id: number;
  mensaje: string;
  area: string;
  fecha: string;
  leida: boolean;
  sucursal: string;
  servicio?: string;
}

interface VistaNotificacionesProps {
  onClose: () => void; // obligatorio para cerrar la vista
}

export default function VistaNotificaciones({ onClose }: VistaNotificacionesProps) {
  const navigate = useNavigate(); // <- Declaramos navigate aquí
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [filtro, setFiltro] = useState<"todas" | "noLeidas" | "leidas">("todas");

  const usuarioActual = JSON.parse(localStorage.getItem("userData") || "{}");

  useEffect(() => {
    if (!usuarioActual.id) return;

    async function cargar() {
      const data = await getNotificaciones(usuarioActual);
      setNotificaciones(data);
    }

    cargar();
  }, [usuarioActual.id]);

  const handleMarcarComoLeida = async (id: number) => {
    await marcarComoLeida(id);
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  // Función para cerrar la vista y regresar
  const handleClose = () => {
    navigate(-1); // regresa a la vista anterior
  };

  const notificacionesFiltradas = notificaciones.filter((n) =>
    filtro === "todas" ? true : filtro === "leidas" ? n.leida : !n.leida
  );

  return (
    <div className="p-6 space-y-4 bg-white rounded-lg shadow-md relative">
      {/* Encabezado con título y X */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notificaciones
        </h1>
        <button
          onClick={handleClose} // usamos la función aquí
          className="text-green-600 hover:text-green-800 font-bold text-4xl"
          title="Cerrar"
        >
          ×
        </button>
      </div>

      {/* Botones de filtro con línea animada */}
      <div className="flex gap-3 relative border-b border-gray-200 pb-2 mt-2">
        {(["todas", "noLeidas", "leidas"] as const).map((tipo) => {
          const labels: Record<typeof tipo, string> = {
            todas: "Todas",
            noLeidas: "No leídas",
            leidas: "Leídas",
          };
          const activo = filtro === tipo;

          return (
            <button
              key={tipo}
              onClick={() => setFiltro(tipo)}
              className={`
                flex-1 text-center px-6 py-3 rounded-t-lg border transition-all duration-300 ease-in-out
                font-medium text-sm
                ${activo
                  ? "bg-[#8BA869] text-white shadow-sm"
                  : "bg-[#D6E3C7] text-gray-700 border-[#C8D7B6] hover:bg-[#A0BB7F]"}
              `}
            >
              {labels[tipo]}
            </button>
          );
        })}
        <span
          className="absolute bottom-0 h-1 bg-green-700 transition-all duration-300 ease-in-out rounded"
          style={{
            left: filtro === "todas" ? "0%" : filtro === "noLeidas" ? "33.33%" : "66.66%",
            width: "33.33%",
          }}
        />
      </div>

      {/* Tarjetas de notificación */}
      <div className="grid gap-4 mt-2">
        {notificacionesFiltradas.length > 0 ? (
          notificacionesFiltradas.map((n) => (
            <div
              key={n.id}
              className={`border rounded-lg p-4 ${n.leida ? "opacity-60" : "border-blue-500"}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg">{n.mensaje}</p>
                  <p className="text-sm text-gray-500">{n.fecha}</p>
                </div>
                {!n.leida && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarcarComoLeida(n.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Marcar como leída
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No hay notificaciones</p>
        )}
      </div>
    </div>
  );
}
