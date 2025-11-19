import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { MoreDotIcon } from "../../icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useLanguage } from "../../context/LanguageContext";
import dashboardService from "../../services/dashboardService";

export default function PopularAreasPieChart() {
  const [isOpen, setIsOpen] = useState(false);
  const [areas, setAreas] = useState<{ area: string; visitas: number }[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await dashboardService.getAreasFrecuentadasHoy();

        console.log("DATOS RECIBIDOS RAW:", JSON.stringify(res, null, 2));


        // Backend devuelve { success, data }
        if (res.success) {
          setAreas(res.data);
        } else {
          setAreas([]);
        }
      } catch (error) {
        console.error("Error al obtener áreas más visitadas:", error);
        setAreas([]);
      }
    }

    loadData();
  }, []);

  const options: ApexOptions = {
    chart: { type: "pie" },
    labels: areas.map((item) => item.area),
    legend: { position: "bottom" },
  plotOptions: {
    pie: {
      expandOnClick: true,
      customScale: 1
    }
  },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 280 },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  const series = areas.map((item) => Number(item.visitas));


  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              {t("dashboard.mostFrequentedAreas")}
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {t("dashboard.basedOnRecentClientVisits")}
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
                {t("common.viewMore")}
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
  <div className="w-full" style={{ height: "350px" }}>
    {series.length > 0 ? (
      <Chart
        options={options}
        series={series}
        type="pie"
        width="100%"
        height="100%"
      />
    ) : (
      <p className="text-gray-500">{t("dashboard.loadingChart")}</p>
    )}
  </div>
</div>
      </div>
    </div>
  );
}
