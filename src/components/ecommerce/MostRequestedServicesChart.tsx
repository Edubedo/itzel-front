import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import dashboardService from "../../services/dashboardService";

export default function MostRequestedServicesChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStats = async () => {
      try {
        const res = await dashboardService.getServiciosMensuales();
        if (
          res.success &&
          res.data &&
          Array.isArray(res.data.labels) &&
          Array.isArray(res.data.series)
        ) {
          setLabels(res.data.labels);
          // 🔥 Convertir los datos a números (por si vienen como strings)
        const numericSeries = res.data.series.map(serie => ({
          ...serie,
          data: serie.data.map(Number)
        }));
          setSeries(res.data.series);
        } else {
          console.error("Error al obtener estadísticas de servicios:", res.message);
          setLabels([]);
          setSeries([]);
        }
      } catch (error) {
        console.error("Error en fetchStats serviciostats:", error);
        setLabels([]);
        setSeries([]);
      }
    };

    fetchStats(); // carga inicial

    // actualizar cada 15 segundos (puedes ajustar)
    intervalId = setInterval(fetchStats, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: { text: undefined },
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  // Renderiza el gráfico solo si hay datos válidos
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Servicios más solicitados
      </h3>
      {series.length > 0 && labels.length > 0 ? (
        <Chart options={options} series={series} type="bar" height={300} />
      ) : (
        <p className="text-center text-gray-500">No hay datos para mostrar</p>
      )}
    </div>
  );
}
