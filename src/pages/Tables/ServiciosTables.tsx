import React, { useState, useCallback, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ServiciosTableOne from "../../components/tables/BasicTables/ServiciosTableOne";
import { useAuth } from "../../contexts/AuthContext";
import { areasService, Area } from "../../services/areasService";

interface ServiciosTablesProps {
  titleTable?: string;
}

interface ServicioStats {
  total: number;
  activos: number;
  porArea: Record<string, number>;
  paraClientes: number; 
  paraNoClientes: number; 
}

export default function ServiciosTables({ titleTable = "Catálogo de servicios" }: ServiciosTablesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [clienteFilter, setClienteFilter] = useState("");
  const [servicios, setServicios] = useState<any[]>([]);
  const [stats, setStats] = useState<ServicioStats>({
    total: 0,
    activos: 0,
    porArea: {},
    paraClientes: 0, 
    paraNoClientes: 0 
  });

  const [areas, setAreas] = useState<Area[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const getAllServicios = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/catalogos/servicios');
        const data = await response.json();
        const serviciosData = data.getServicios || data || [];
        setServicios(serviciosData);

        // Calcular estadísticas iniciales
        const total = serviciosData.length;
        const activos = serviciosData.filter((s: any) => s.ck_estatus === "ACTIVO").length;
        const paraClientes = serviciosData.filter((s: any) => s.i_es_para_clientes === 1).length; // NUEVO
        const paraNoClientes = serviciosData.filter((s: any) => s.i_es_para_clientes === 0).length; // NUEVO
        const porArea: Record<string, number> = {};

        serviciosData.forEach((servicio: any) => {
          const area = servicio.ck_area || 'Sin área';
          porArea[area] = (porArea[area] || 0) + 1;
        });

        setStats({ total, activos, porArea, paraClientes, paraNoClientes }); // NUEVO
      } catch (error) {
        console.error('Error al obtener servicios:', error);
      }
    };

    getAllServicios();

    const fetchAreas = async () => {
      try {
        const response = await areasService.getAreas();
        setAreas(response.data || []);
      } catch (error) {
        setAreas([]);
      }
    };
    fetchAreas();
  }, []);

  // Navegar al formulario de añadir servicio
  const handleAddServicio = () => {
    window.location.href = "/catalogos/servicios/formulario/";
  };

  // Manejar actualización de estadísticas
  const handleStatsUpdate = useCallback((newStats: ServicioStats) => {
    setStats(newStats);
  }, []);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setAreaFilter("");
    setClienteFilter("");
  };

  return (
    <>
      <PageMeta
        title="Sistema de Turnos - Catálogo de Servicios"
        description="Catálogo de servicios para el sistema de turnos"
      />
      <PageBreadcrumb pageTitle={titleTable} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{titleTable}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona y consulta los servicios del sistema</p>
        </div>
        {user?.tipo_usuario === 1 && (
          <button
            onClick={handleAddServicio}
            className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] hover:from-[#5E8F7A] hover:to-[#7AB89A] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md group w-full sm:w-auto dark:from-[#547A6B] dark:to-[#6A9A8B] dark:hover:from-[#456857] dark:hover:to-[#5A8A7B]"
          >
            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium">Nuevo Servicio</span>
          </button>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Servicios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#70A18E]/10 to-[#8ECAB2]/10 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Servicios</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.total}</p>
          <div className="w-8 h-1 bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] rounded-full mt-3"></div>
        </div>

        {/* Activos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8ECAB2]/10 to-[#B7F2DA]/10 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8ECAB2] to-[#B7F2DA] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Activos</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.activos}</p>
          <div className="w-8 h-1 bg-gradient-to-r from-[#8ECAB2] to-[#B7F2DA] rounded-full mt-3"></div>
        </div>


        {/* Para Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-bl-full dark:from-cyan-900/20 dark:to-teal-900/20"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Para Clientes</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.paraClientes}</p>
          <div className="w-8 h-1 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full mt-3"></div>
        </div>

        {/* Para No Clientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#F59E0B]/10 to-[#FBBF24]/10 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Para No Clientes</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.paraNoClientes}</p>
          <div className="w-8 h-1 bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] rounded-full mt-3"></div>
        </div>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar Servicio
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
              />
              <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">🔍</span>
            </div>
          </div>

          {/* Filtro por Área */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Área
            </label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
            >
              <option value="">Todas las áreas</option>
              {areas.map((area) => (
                <option key={area.ck_area} value={area.ck_area}>
                  {area.s_area}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Cliente/No Cliente */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Cliente
            </label>
            <select
              value={clienteFilter}
              onChange={(e) => setClienteFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
            >
              <option value="">Todos los tipos</option>
              <option value="1">Clientes</option>
              <option value="0">No clientes</option>
            </select>
          </div>

          {/* Botón limpiar filtros */}
          <div>
            <button
              onClick={clearFilters}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 font-medium dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Consulta de Servicios">
          <ServiciosTableOne
            servicios={servicios}
            setServicios={setServicios}
            searchTerm={searchTerm}
            areaFilter={areaFilter}
            clienteFilter={clienteFilter}
            estatusFilter={""}
            onStatsUpdate={handleStatsUpdate}
          />
        </ComponentCard>
      </div>
    </>
  );
}