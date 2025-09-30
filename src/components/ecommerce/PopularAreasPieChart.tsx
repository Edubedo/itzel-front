import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";




// Simula una llamada a backend para obtener áreas más visitadas
// Puedes reemplazar esto con una llamada real a tu API
async function fetchPopularAreas() {
  // Ejemplo estático: { área: cantidad de visitas }
  return [
    { area: "Facturacion", visitas: 120 },
    { area: "Contabilidad", visitas: 90 },
    { area: "Registros", visitas: 60 },
    { area: "Cobranza", visitas: 45 },
  ];
}

export default function PopularAreasPieChart() {
  const [isOpen, setIsOpen] = useState(false);
  const [areas, setAreas] = useState<{ area: string; visitas: number }[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await fetchPopularAreas();
      setAreas(data);
    }

    loadData();
  }, []);


  
  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    labels: areas.map((item) => item.area),
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 280,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      position: "bottom",
    },
  };

  const series = areas.map((item) => item.visitas);




  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Áreas Más Frecuentadas
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Basado en visitas recientes de clientes
            </p>
          </div>
          <div className="relative inline-block">
            <button onClick={() => setIsOpen(!isOpen)}>
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={() => setIsOpen(false)}
                className="text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                Ver más
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
  {series.length > 0 ? (
    <Chart options={options} series={series} type="pie" width="100%" height={320} />
  ) : (
    <p className="text-gray-500">Cargando gráfico...</p>
  )}
</div>

      </div>
    </div>
  );
}
