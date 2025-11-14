import React from "react";
import DashboardMetrics from "../../components/ecommerce/DashboardMetrics";
import TurnoPorCyAChart from "../../components/ecommerce/TurnoPorCyAChart";

const DashboardEjecutivo: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
    

      {/* Sección de métricas rápidas */}
      <DashboardMetrics />


     {/* Gráfica adicional */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <TurnoPorCyAChart />
         </div>
    </div>
  );
};

export default DashboardEjecutivo;
