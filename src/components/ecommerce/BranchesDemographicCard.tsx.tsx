
import ColimaMap from "../../components/ecommerce/ColimaMap";

export default function DemographicCard() {
  // ...
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Sucursales Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Número de clientes basado en sucursales
          </p>
        </div>
      </div>

      {/* Mapa */}
      <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl dark:border-gray-800 sm:px-6">
        <div
          id="mapColima"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <ColimaMap />
        </div>
      </div>

      {/* Lista de sucursales */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <img src="./images/branch.svg" alt="centro" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                Centro
              </p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                1,200 Clientes
              </span>
            </div>
          </div>
          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
            60%
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="items-center w-full rounded-full max-w-8">
              <img src="./images/branch.svg" alt="salagua" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                Salagua
              </p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                800 Clientes
              </span>
            </div>
          </div>
          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
            40%
          </p>
        </div>
      </div>
    </div>
  );
}
