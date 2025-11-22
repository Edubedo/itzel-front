// src/pages/Dashboard/Home.tsx
import { useAuth } from "../../contexts/AuthContext";

import DashboardMetrics from "../../components/ecommerce/DashboardMetrics";
import MostRequestedServicesChart from "../../components/ecommerce/MostRequestedServicesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PopularAreasPieChart from "../../components/ecommerce/PopularAreasPieChart.tsx";
import BranchesDemographicCard from "../../components/ecommerce/BranchesDemographicCard.tsx";
//  nuevo import opcional para el dashboard de asesor
import DashboardAsesor from "../../components/ecommerce/DashboardAsesor";
import DashboardEjecutivo from "../../components/ecommerce/DashboardEjecutivo";

export default function Home() {
  const { user } = useAuth();
  const tipo = user?.tipo_usuario;  

  // 👉 Si es asesor (3), muestra su propio dashboard
  if (tipo === 3) {
    return <DashboardAsesor />;
  }

  // Si es eejcutivo (2), muestra su propio dashboard
  if (tipo === 2) {
    return <DashboardEjecutivo/>;
  }

   // Si es administrador (1), muestra el dashboard actual
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
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <StatisticsChart />
        <PopularAreasPieChart />
        
      </div>

      {/* Tabla de pedidos recientes */}

    </div>
  );
}
