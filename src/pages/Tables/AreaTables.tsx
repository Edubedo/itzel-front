import React, { useState, useCallback } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AreaTableOne from "../../components/tables/BasicTables/AreaTableOne";
import { AreaStats } from "../../services/areasService";


interface AreaTablesProps {
  titleTable?: string;
}

export default function AreaTables({ titleTable = "Catálogo de áreas" }: AreaTablesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [estatusFilter, setEstatusFilter] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");
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
      
      {/* Estadísticas Resumidas - Movidas al principio para mejor UX */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">Total Áreas</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800">Activas</h3>
          <p className="text-2xl font-bold">{stats.activas}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Inactivas</h3>
          <p className="text-2xl font-bold">{stats.inactivas}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800">Por Sucursal</h3>
          <p className="text-sm">
            {Object.entries(stats.porSucursal).map(([sucursal, count]) => (
              <span key={sucursal} className="block">{sucursal}: {count}</span>
            ))}
          </p>
        </div>
      </div>
      
      {/* Botón de añadir */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={handleAddArea}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <span className="mr-2">+</span>
          Añadir Área
        </button>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Buscador */}
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Área
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
          
          {/* Filtro por Estado */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select 
              value={estatusFilter}
              onChange={(e) => setEstatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="ACTIVO">Activo</option>
              <option value="INACTI">Inactivo</option>
            </select>
          </div>
          
          {/* Filtro por Sucursal */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sucursal
            </label>
            <select 
              value={sucursalFilter}
              onChange={(e) => setSucursalFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las sucursales</option>
              <option value="suc-001">Secured Control</option>
              <option value="suc-002">Secured Norte</option>
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
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