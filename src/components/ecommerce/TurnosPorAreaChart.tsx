import React, { useEffect, useState } from "react";
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

const TurnosPorAreaChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await dashboardService.getTurnosPorAreaHoy();
      if (res.success && res.data) {
        const { labels, series } = res.data;
        setChartData({
          labels,
          datasets: [
            {
              label: series[0].name,
              data: series[0].data,
              backgroundColor: "#1662c2",
              borderColor: "#1662c2",
              borderWidth: 1,
              borderRadius: 5,
            },
          ],
        });
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Distribución de Turnos por Área",
        color: "#363636",
        font: { size: 16, weight: "normal" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#1e3a8a", font: { size: 12, weight: "normal" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { 
          color: "#1e3a8a", 
          font: { size: 12, weight: "normal" },
          stepSize: 1
        },
        title: {
          display: true,
          text: "Turnos",
          color: "#1e3a8a",
          font: { size: 13, weight: "normal" },
        },
      },
    },
  };

  if (!chartData) return <p className="text-center text-gray-500">Cargando...</p>;

  return (
    <div className="h-64 w-full m-0 p-0">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TurnosPorAreaChart;
