import React, { useState, useCallback, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AreaTableOne from "../../components/tables/BasicTables/AreaTableOne";
import { AreaStats } from "../../services/areasService";
import { areasService, Sucursal } from "../../services/areasService";
import { useLanguage } from "../../context/LanguageContext";

interface AreaTablesProps {
  titleTable?: string;
}

export default function AreaTables({ titleTable = "Catálogo de áreas" }: AreaTablesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [estatusFilter, setEstatusFilter] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const { t } = useLanguage();

  const [stats, setStats] = useState<AreaStats>({
    total: 0,
    activas: 0,
    inactivas: 0,
    porSucursal: {}
  });

  // Función para navegar al formulario de añadir área
  const handleAddArea = () => {
    window.location.href = "/catalogos/areas/formulario/";
  };

  // Manejar actualización de estadísticas - MEMO para evitar re-creación
  const handleStatsUpdate = useCallback((newStats: AreaStats) => {
    setStats(newStats);
  }, []);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await areasService.getSucursales();
        if (response.success && response.data) {
          setSucursales(response.data);
        }
      } catch (error) {
        console.error('Error al obtener sucursales:', error);
      }
    };
    fetchSucursales();
  }, []);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setEstatusFilter("");
    setSucursalFilter("");
  };

  return (
    <>
      <PageMeta
        title="Sistema de Turnos - Catálogo de Áreas"
        description="Catálogo de áreas para el sistema de turnos"
      />
      <PageBreadcrumb pageTitle={titleTable} />

      {/* Encabezado con título y botón compacto */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{titleTable}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t("areas.manageAndConsultAreas")}</p>
        </div>
        
        {/* Botón de añadir área - Versión compacta */}
        <button
          onClick={handleAddArea}
          className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] hover:from-[#5E8F7A] hover:to-[#7AB89A] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md group w-full sm:w-auto dark:from-[#547A6B] dark:to-[#6A9A8B] dark:hover:from-[#456857] dark:hover:to-[#5A8A7B]"
        >
          <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="font-medium">{t("areas.newArea")}</span>
        </button>
      </div>

      {/* Estadísticas Resumidas - Diseño Moderno y Minimalista */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Áreas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#70A18E]/10 to-[#8ECAB2]/10 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("areas.totalAreas")}</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.total}</p>
          <div className="w-8 h-1 bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] rounded-full mt-3"></div>
        </div>

        {/* Activas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8ECAB2]/10 to-[#B7F2DA]/10 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8ECAB2] to-[#B7F2DA] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("areas.active")}</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.activas}</p>
          <div className="w-8 h-1 bg-gradient-to-r from-[#8ECAB2] to-[#B7F2DA] rounded-full mt-3"></div>
        </div>

        {/* Inactivas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FF8E8E]/10 to-[#FFB7B7]/10 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF8E8E] to-[#FFB7B7] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("areas.inactive")}</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.inactivas}</p>
          <div className="w-8 h-1 bg-gradient-to-r from-[#FF8E8E] to-[#FFB7B7] rounded-full mt-3"></div>
        </div>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Buscador */}
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("areas.searchArea")}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t("areas.searchByCodeOrName")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
              />
              <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">🔍</span>
            </div>
          </div>

          {/* Filtro por Estado */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("areas.status")}
            </label>
            <select
              value={estatusFilter}
              onChange={(e) => setEstatusFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
            >
              <option value="">{t("areas.allStatuses")}</option>
              <option value="ACTIVO">{t("areas.active")}</option>
              <option value="INACTIVO">{t("areas.inactive")}</option>
            </select>
          </div>

          {/* Filtro por Sucursal */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("areas.branch")}
            </label>
            <select
              value={sucursalFilter}
              onChange={(e) => setSucursalFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
            >
              <option value="">{t("areas.allBranches")}</option>
              {sucursales.map((suc) => (
                <option key={suc.ck_sucursal} value={suc.ck_sucursal}>
                  {suc.s_nombre_sucursal || suc.s_nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <div>
            <button
              onClick={clearFilters}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 font-medium dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600"
            >
{t("common.clear")}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ComponentCard title={t("areas.areaQuery")}>
          <AreaTableOne
            searchTerm={searchTerm}
            estatusFilter={estatusFilter}
            sucursalFilter={sucursalFilter}
            onStatsUpdate={handleStatsUpdate}
          />
        </ComponentCard>
      </div>
    </>
  );
}