import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { dashboardService } from "../../services/dashboardService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TurnosPorCyAChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardService.getTurnosAtendidosCanceladosPorDia();
        if (res.success && res.data) {
          const { labels, series } = res.data;

          setChartData({
            labels,
            datasets: [
              {
                label: series[0].name, // Atendidos
                data: series[0].data,
                backgroundColor: [
                 "#26614cff", // verde esmeralda
                  "#537669ff",
                  "#70A18E",
                ],
                borderColor: "#059669",
                borderWidth: 1,
                borderRadius: 6,
              },
              {
                label: series[1].name, // Cancelados
                data: series[1].data,
                backgroundColor: [
                  "rgba(239, 68, 68, 0.8)", // rojo degradado
                  "rgba(248, 113, 113, 0.8)",
                  "rgba(220, 38, 38, 0.8)",
                ],
                borderColor: "#b91c1c",
                borderWidth: 1,
                borderRadius: 6,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error al cargar los datos del gráfico:", error);
      }
    };

    fetchData();
  }, []);

  // Detectar modo oscuro dinámicamente
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const textColor = isDarkMode ? "#E5E7EB" : "#374151"; // texto adaptable
  const gridColor = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          color: textColor,
          font: { size: 12, weight: "normal" },
        },
      },
      title: {
        display: true,
        text: "Turnos Atendidos y Cancelados por Día",
        color: textColor,
        font: { size: 16, weight: "500" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { size: 12 },
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Número de Turnos",
          color: textColor,
          font: { size: 13 },
        },
      },
    },
  };

  if (!chartData)
    return <p className="text-center text-gray-500">Cargando...</p>;

  return (
    <div
      className="
        h-72 w-full p-2 
        rounded-2xl shadow-sm border
        border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        transition-colors duration-300
      "
    >
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default TurnosPorCyAChart;
