import React, { useEffect, useState, useMemo } from "react";
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
import { useLanguage } from "../../context/LanguageContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TurnosPorAreaChart: React.FC = () => {
  const [originalData, setOriginalData] = useState<{ labels: string[], series: any[] } | null>(null);
  const { t } = useLanguage();

  // Helper function to normalize text (remove accents and convert to lowercase)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Helper function to translate area names
  const translateArea = (areaName: string): string => {
    if (!areaName) return '';
    
    // Eliminar puntos entre palabras
    let cleanAreaName = areaName.replace(/\./g, ' ').replace(/\s+/g, ' ').trim();
    
    const normalized = normalizeText(cleanAreaName);
    
    // Traducir nombres de áreas del backend
    if (normalized.includes('atencion al cliente') || normalized.includes('atencion cliente') || normalized.includes('customer service')) {
      return t("area.atencionCliente");
    }
    if (normalized.includes('cobranza') || normalized.includes('collections')) {
      return t("area.cobranza");
    }
    if (normalized.includes('facturacion') || normalized.includes('billing')) {
      return t("area.facturacion");
    }
    if (normalized.includes('conexiones') || normalized.includes('connections')) {
      return t("area.conexiones");
    }
    if (normalized.includes('servicios tecnicos') || normalized.includes('servicio tecnico') || normalized.includes('technical services')) {
      return t("area.serviciosTecnicos");
    }
    if (normalized.includes('contratacion') || normalized.includes('contratación') || normalized.includes('contracting')) {
      return t("area.contratacion");
    }
    if ((normalized.includes('informacion') || normalized.includes('información')) && (normalized.includes('consultas') || normalized.includes('inquiries'))) {
      return t("area.informacionConsultas");
    }
    if (normalized.includes('recursos humanos') || normalized.includes('human resources')) {
      return t("area.recursosHumanos");
    }
    if (normalized.includes('reportes') || normalized.includes('reports')) {
      return t("area.reportes");
    }
    // If no translation found, return original without dots
    return cleanAreaName;
  };

  // Cargar datos originales del backend
  useEffect(() => {
    const fetchData = async () => {
      const res = await dashboardService.getTurnosPorAreaHoy();
      if (res.success && res.data) {
        const { labels, series } = res.data;
        setOriginalData({ labels, series });
      }
    };

    fetchData();
  }, []);

  // Generar chartData con traducciones cuando cambien los datos originales o el idioma
  const chartData = useMemo(() => {
    if (!originalData) return null;
    
    const { labels, series } = originalData;
    // Traducir las etiquetas de áreas
    const translatedLabels = labels.map((label: string) => translateArea(label));
    
    return {
      labels: translatedLabels,
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
    };
  }, [originalData, t]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: t("dashboard.shiftsDistributionByArea"),
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
          text: t("dashboard.shifts"),
          color: "#1e3a8a",
          font: { size: 13, weight: "normal" },
        },
      },
    },
  }), [t]);

  if (!chartData) return <p className="text-center text-gray-500">{t("dashboard.loading")}</p>;

  return (
    <div className="h-64 w-full m-0 p-0">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TurnosPorAreaChart;
