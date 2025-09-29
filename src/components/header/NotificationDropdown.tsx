import React, { useEffect, useState } from "react";
import { Bell, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotificaciones, marcarComoLeida, Notificacion, Usuario } from "../../services/notificacionesService";

interface NotificationDropdownProps {
  usuario: Usuario;
  agregarToast: (mensaje: string) => void; // Para notificación flotante
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ usuario, agregarToast }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [abierto, setAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) cargarNotificaciones();
  }, [usuario]);

  const cargarNotificaciones = async () => {
    const data = await getNotificaciones(usuario);
    setNotificaciones(data);
  };

  const handleMarcarComoLeida = async (n: Notificacion) => {
    if (!n.leida) {
      await marcarComoLeida(n.id);
      setNotificaciones((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, leida: true } : item))
      );
      agregarToast(`Notificación leída: ${n.mensaje}`);
    }
  };

  const noLeidas = notificaciones.filter(n => !n.leida);
  const nuevas = noLeidas.filter(n => !n.mensaje.includes("Recuerda atender"));
  const recordatorios = noLeidas.filter(n => n.mensaje.includes("Recuerda atender"));

  return (
    <div className="relative">
      {/* Botón campana */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        {noLeidas.length > 0 && (
          <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center 
            w-4 h-4 text-[10px] font-bold leading-none text-white bg-green-700 rounded-full">
            {noLeidas.length > 9 ? "9+" : noLeidas.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {abierto && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg z-50 max-h-[400px] overflow-y-auto">
          <div className="px-4 py-2 border-b">
            <h4 className="font-semibold text-gray-800">Notificaciones</h4>
          </div>
          <div className="p-4 space-y-2">
            {nuevas.length > 0 && (
              <>
                <p className="text-sm font-semibold text-green-800">Nuevos Turnos</p>
                {nuevas.map(n => (
                  <div
                    key={n.id}
                    className={`p-2 rounded-md cursor-pointer border ${
                      n.leida ? "bg-green-100 border-green-200 text-green-600" : "bg-green-50 border-green-400 text-green-800"
                    }`}
                    onClick={() => handleMarcarComoLeida(n)}
                  >
                    <p className="text-sm">{n.mensaje}</p>
                    <span className="text-xs text-green-700">{n.fecha}</span>
                  </div>
                ))}
              </>
            )}

            {recordatorios.length > 0 && (
              <>
                <p className="text-sm font-semibold text-green-900 mt-2">Recordatorios</p>
                {recordatorios.map(n => (
                  <div
                    key={n.id}
                    className="p-2 rounded-md cursor-pointer bg-green-100 border-green-600 text-green-900"
                    onClick={() => handleMarcarComoLeida(n)}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <p className="text-sm">{n.mensaje}</p>
                    </div>
                    <span className="text-xs text-green-700">{n.fecha}</span>
                  </div>
                ))}
              </>
            )}

            {nuevas.length === 0 && recordatorios.length === 0 && (
              <p className="text-sm text-gray-500 text-center">No hay notificaciones</p>
            )}
          </div>
          <div className="px-4 py-2 border-t text-center">
            <button
              onClick={() => {
                setAbierto(false);
                navigate("/notificaciones");
              }}
              className="text-sm font-medium text-green-700 hover:underline"
            >
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
