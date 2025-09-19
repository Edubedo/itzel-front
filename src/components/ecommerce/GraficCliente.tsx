import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Definición de las props para el componente
interface DailySalesChartProps {
  title?: string;
  percentageChange?: number; // Por ejemplo, 15 para +15%
  lastUpdate?: string; // Por ejemplo, "4 min ago"
}

const DailySalesChart: React.FC<DailySalesChartProps> = ({
  title = "Daily Sales",
  percentageChange = 15,
  lastUpdate = "4 min ago"
}) => {
  // Datos de ejemplo para el gráfico (simulando los meses de la imagen)
  const data = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Mobile apps', // Etiqueta para el tooltip
        data: [50, 40, 300, 310, 500, 250, 180, 220, 480], // Valores de la línea
        borderColor: 'rgb(75, 192, 192)', // Color de la línea
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color del área bajo la línea (si aplica)
        tension: 0.4, // Suaviza la línea
        pointBackgroundColor: 'rgb(75, 192, 192)', // Color de los puntos
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  // Opciones del gráfico para que se parezca al de la imagen
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite controlar el tamaño del gráfico
    plugins: {
      legend: {
        display: false, // No mostrar la leyenda si solo hay un dataset
      },
      title: {
        display: false, // No mostrar título interno del gráfico
      },
      tooltip: {
        // Configuraciones del tooltip para que se vea como en la imagen
        // Aquí ajustamos el callback para mostrar "Mobile apps: Valor"
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        },
        // Estilos para el tooltip
        backgroundColor: 'rgba(0,0,0,0.8)', // Fondo negro
        titleColor: '#fff', // Texto del título blanco
        bodyColor: '#fff', // Texto del cuerpo blanco
        padding: 10,
        cornerRadius: 6,
        caretSize: 6,
        boxPadding: 4,
        displayColors: false, // No mostrar el cuadradito de color en el tooltip
      }
    },
    scales: {
      x: {
        grid: {
          display: false, // No mostrar líneas de la cuadrícula en el eje X
        },
        ticks: {
          color: '#555', // Color de las etiquetas (ej. 'Apr', 'May')
        },
      },
      y: {
        beginAtZero: true, // Empezar el eje Y desde 0
        grid: {
          color: 'rgba(0,0,0,0.1)', // Color de las líneas de la cuadrícula en el eje Y
        },
        ticks: {
          color: '#555', // Color de las etiquetas (ej. 200, 400, 600)
          stepSize: 200, // Intervalo entre las etiquetas del eje Y
        },
      },
    },
  };

  const changeColor = percentageChange >= 0 ? 'text-green-500' : 'text-red-500';
  const changeSign = percentageChange >= 0 ? '+' : '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-w-sm mx-auto">
      {/* Contenedor del gráfico */}
      <div className="relative h-48 mb-4 bg-green-500 rounded-md p-2 flex items-center justify-center">
        {/* Usamos un div con color de fondo verde para simular el fondo del gráfico */}
        <div className="absolute inset-0 z-0 opacity-70 rounded-md"></div>
        {/* El gráfico se renderizará encima del fondo verde */}
        <div className="relative z-10 w-full h-full p-1">
          <Line data={data} options={options} />
        </div>
      </div>

      {/* Título y porcentaje de cambio */}
      <div className="px-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        <p className={`text-sm ${changeColor}`}>
          ({changeSign}{percentageChange}%) increase in today sales.
        </p>
      </div>

      {/* Última actualización */}
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-3 px-2">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>updated {lastUpdate}</span>
      </div>
    </div>
  );
};

export default DailySalesChart;