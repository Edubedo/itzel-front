import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { turnosService } from "../../services/turnosService";
import { useSucursalActiva } from "../../components/header/Header";

interface EstadisticaMensual {
  mes: string;
  numero_mes: number;
  total_turnos: number;
}

export default function StatisticsChart() {
  const sucursalActiva = useSucursalActiva();
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      if (!sucursalActiva) return;

      const result = await turnosService.getEstadisticasMensuales(
        sucursalActiva.ck_sucursal
      );

      if (result.success) {
        // 📊 Ordenar los datos por número de mes y mapear solo los totales
        const datosOrdenados = result.data
          .sort((a: EstadisticaMensual, b: EstadisticaMensual) => a.numero_mes - b.numero_mes)
          .map((item: EstadisticaMensual) => item.total_turnos);

        setData(datosOrdenados);
      }
    };

    cargarDatos();
  }, [sucursalActiva]);

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#00787a"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.4, opacityTo: 0 },
    },
    markers: {
      size: 4,
      colors: ["#00787a"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 7 },
    },
    grid: {
      borderColor: "#E5E7EB",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val} turnos`,
      },
    },
    xaxis: {
      categories: [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#6B7280" } },
    },
    yaxis: { labels: { style: { colors: "#6B7280" } } },
  };

  const series = [
    {
      name: "Turnos",
      data: data.length ? data : new Array(12).fill(0), // 🚀 asegura 12 valores
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Estadísticas de Turnos
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Cantidad de turnos atendidos por mes
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
