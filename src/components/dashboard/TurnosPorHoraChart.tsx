import { Bar } from "react-chartjs-2";

const TurnosPorHoraChart = () => {
  const data = {
    labels: ["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM"],
    datasets: [
      {
        label: "Turnos por Hora",
        data: [5, 12, 8, 14, 10, 7, 6],
        backgroundColor: "#10B981",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Turnos por Hora</h2>
      <Bar data={data} />
    </div>
  );
};

export default TurnosPorHoraChart;
