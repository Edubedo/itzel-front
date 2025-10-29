
import React from "react";
import DashboardMetrics from "../../components/ecommerce/DashboardMetrics";
import MostRequestedServicesChart from "../../components/ecommerce/MostRequestedServicesChart";

const DashboardEjecutivo: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
    

      {/* Sección de métricas rápidas */}
      <DashboardMetrics />


      {/* Sección adicional exclusiva para el asesor */}
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Grafica de clientes
          </h2>
          <p className="text-gray-500">
            Resumen general de los clientes del día.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardEjecutivo;
