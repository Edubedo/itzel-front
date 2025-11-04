
import React from "react";
import DashboardMetrics from "../../components/ecommerce/DashboardMetrics";
import TurnosPorAreaChart from "../../components/ecommerce/TurnosPorAreaChart";

const DashboardAsesor: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
    

      {/* Sección de métricas rápidas */}
      <DashboardMetrics />


     {/* Gráfica adicional */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <TurnosPorAreaChart />
         </div>
    </div>
  );
};

export default DashboardAsesor;
