import { useEffect, useState } from "react";
import { ArrowUpIcon, BoxIconLine, GroupIcon } from "../../icons";
import Badge from "../../components/ui/badge/Badge";
import { turnosService } from "../../services/turnosService";
import { useLanguage } from "../../context/LanguageContext";
import { clientesService } from "../../services/clientesService";

export default function DashboardMetrics() {
  const [clientesHoy, setClientesHoy] = useState<number>(0);
  const [turnosHoy, setTurnosHoy] = useState<number>(0);
  const { t } = useLanguage();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const resClientes = await clientesService.getClientesDelDia();
        const resTurnos = await turnosService.getTurnosDelDia();

        if (resClientes.success && resClientes.data) {
          setClientesHoy(resClientes.data.total || 0);
        }

        if (resTurnos.success && resTurnos.data) {
          setTurnosHoy(resTurnos.data.total || 0);
        }
      } catch (error) {
        console.error("Error cargando métricas del dashboard:", error);
      }
    };

    fetchData(); // Cargar al inicio

    // Actualizar cada 15 segundos
    intervalId = setInterval(fetchData, 15000);

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Clientes del día */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.clientsToday")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {clientesHoy}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>

      {/* Turnos del día */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.shiftsIssuedToday")}
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {turnosHoy}
            </h4>
          </div>
          <Badge color="info">
            <ArrowUpIcon />
          </Badge>
        </div>
      </div>
    </div>
  );
}
