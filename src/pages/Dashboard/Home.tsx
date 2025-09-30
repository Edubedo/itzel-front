// src/pages/Dashboard/Home.tsx
import DashboardMetrics from "../../components/ecommerce/DashboardMetrics";
import MostRequestedServicesChart from "../../components/ecommerce/MostRequestedServicesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import BranchesDemographicCard from "../../components/ecommerce/BranchesDemographicCard.tsx";


export default function Home() {
  return (
    <div className="p-6 space-y-6">
      {/* Sección de métricas rápidas */}
      <DashboardMetrics />

      <div className="space-y-6">
      {/* otras métricas */}
      <MostRequestedServicesChart/>
      {/* otras secciones */}
    </div>

      {/* Sección de gráficas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatisticsChart />
        <MonthlyTarget />
        <BranchesDemographicCard />
      </div>

      {/* Tabla de pedidos recientes */}
   
    </div>
  );
}
