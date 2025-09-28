import React, { useState, useCallback, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AreaTableOne from "../../components/tables/BasicTables/AreaTableOne";
import { AreaStats } from "../../services/areasService";
import { areasService, Sucursal } from "../../services/areasService";

interface AreaTablesProps {
  titleTable?: string;
}

export default function AreaTables({ titleTable = "Catálogo de áreas" }: AreaTablesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [estatusFilter, setEstatusFilter] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

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

      {/* Estadísticas Resumidas - Actualizadas con paleta verde */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#B7F2DA] border border-[#8ECAB2] rounded-lg p-4 dark:bg-[#70A18E]/20 dark:border-[#547A6B]">
          <h3 className="text-lg font-semibold text-[#3A554B] dark:text-[#B7F2DA]">Total Áreas</h3>
          <p className="text-2xl font-bold text-[#211332C] dark:text-white/90">{stats.total}</p>
        </div>
        <div className="bg-[#8ECAB2] border border-[#70A18E] rounded-lg p-4 dark:bg-[#547A6B]/20 dark:border-[#3A554B]">
          <h3 className="text-lg font-semibold text-[#3A554B] dark:text-[#8ECAB2]">Activas</h3>
          <p className="text-2xl font-bold text-[#211332C] dark:text-white/90">{stats.activas}</p>
        </div>
        <div className="bg-[#FFB7B7] border border-[#FF8E8E] rounded-lg p-4 dark:bg-[#A83A3A]/20 dark:border-[#7A2B2B]">
          <h3 className="text-lg font-semibold text-[#8E2E2E] dark:text-[#FFB7B7]">Inactivas</h3>
          <p className="text-2xl font-bold text-[#5A1E1E] dark:text-white/90">{stats.inactivas}</p>
        </div>
      </div>

      {/* Botón de añadir */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddArea}
          className="bg-[#70A18E] hover:bg-[#547A6B] text-white px-4 py-2 rounded-lg flex items-center transition-colors dark:bg-[#547A6B]/80 dark:hover:bg-[#3A554B]">
          <span className="mr-2">+</span>
          Añadir Área
        </button>
      </div>

      {/* Filtros de búsqueda - Actualizados con paleta verde */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Buscador */}
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar Área
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-[#70A18E] focus:border-[#70A18E] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-[#8ECAB2] dark:focus:border-[#8ECAB2]"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">🔍</span>
            </div>
          </div>

          {/* Filtro por Estado */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={estatusFilter}
              onChange={(e) => setEstatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#70A18E] focus:border-[#70A18E] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2] dark:focus:border-[#8ECAB2]"
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTI">Inactivo</option>
            </select>
          </div>

          {/* Filtro por Sucursal */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sucursal
            </label>
            <select
              value={sucursalFilter}
              onChange={(e) => setSucursalFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#70A18E] focus:border-[#70A18E] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2] dark:focus:border-[#8ECAB2]"
            >
              <option value="">Todas las sucursales</option>
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
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Consulta de Áreas">
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