import React, { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ServiciosTableOne from "../../components/tables/BasicTables/ServiciosTableOne";
import { useAuth } from "../../contexts/AuthContext";

interface ServiciosTablesProps {
  titleTable?: string;
}

interface ServicioStats {
  total: number;
  activos: number;
  inactivos: number;
  porArea: Record<string, number>; // estadísticas dinámicas por área
}


export default function ServiciosTables({ titleTable = "Gestión de Servicios" }: ServiciosTablesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [estatusFilter, setEstatusFilter] = useState("ACTIVO");
  const [servicios, setServicios] = useState([]);
  const [stats, setStats] = useState<ServicioStats>({
    total: 0,
    activos: 0,
    inactivos: 0,
    porArea: {}
  });

  const { user } = useAuth();

  
    useEffect(() => {
    const getAllServicios = async() => {
      const response = await fetch('http://localhost:3001/api/catalogos/servicios');
      const data = await response.json();
      console.log("data:  ", data)
      setServicios(data && data.getServicios)
    }

    const data = getAllServicios();

    const responseDataServicios = []
    }, [])

  // Navegar al formulario de añadir servicio
  const handleAddServicio = () => {
    window.location.href = "/catalogos/servicios/formulario/";
  };

  // Manejar actualización de estadísticas
  const handleStatsUpdate = (newStats: ServicioStats) => {
    setStats(newStats);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setAreaFilter("");
    setEstatusFilter("");
  };

  return (
    <>
      <PageMeta
        title="Sistema de Turnos - Gestión de Servicios"
        description="Gestión y administración de servicios del sistema de turnos"
      />
      <PageBreadcrumb pageTitle={titleTable} />
      
      {/* Botón de añadir (solo para administradores) */}
      {user?.tipo_usuario === 1 && (
        <div className="mb-6 flex justify-end">
          <button 
            onClick={handleAddServicio}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
          >
            <span className="mr-2">+</span>
            Añadir Servicio
          </button>
        </div>
      )}

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Buscador */}
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Servicio
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
          
          {/* Filtro por Área */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Área
            </label>
            <select 
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las áreas</option>
              <option value="1">Área 1</option>
              <option value="2">Área 2</option>
              <option value="3">Área 3</option>
            </select>
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
              <option value="INACTIVO">Inactivo</option>
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

      {/* Tabla de servicios */}
      <div className="space-y-6">
        <ComponentCard title="Lista de Servicios">
          <ServiciosTableOne 
            servicios={servicios}
            setServicios={setServicios}
            searchTerm={searchTerm}
            areaFilter={areaFilter}
            estatusFilter={estatusFilter}
            onStatsUpdate={handleStatsUpdate}
          />
        </ComponentCard>
      </div>

      {/* Estadísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Total Servicios</h3>
              <p className="text-3xl font-bold">{servicios.length}</p>
            </div>
            <div className="text-4xl opacity-80">🛠️</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Servicios Activos</h3>
              <p className="text-3xl font-bold">{stats.activos}</p>
            </div>
            <div className="text-4xl opacity-80">✅</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Servicios Inactivos</h3>
              <p className="text-3xl font-bold">{stats.inactivos}</p>
            </div>
            <div className="text-4xl opacity-80">❌</div>
          </div>
        </div>
      </div>
    </>
  );
}
