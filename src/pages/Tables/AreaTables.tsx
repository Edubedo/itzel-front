import React, { useState, useEffect, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AreaTableOne, { useAreas } from "../../components/tables/BasicTables/AreaTableOne";

// Define las props que recibe el componente
interface AreaTablesProps {
  titleTable?: string;
}

export default function AreaTables({ titleTable = "Catálogo de áreas" }: AreaTablesProps) {
  // USAR EL HOOK DINÁMICO
  const { areas, isLoading, fetchAreas, deleteArea, updateArea } = useAreas();
  
  // ESTADOS PARA FILTROS
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState("");

  // CARGAR DATOS AL MONTAR COMPONENTE
  useEffect(() => {
    fetchAreas();
  }, []);

  // FILTRAR DATOS DINÁMICAMENTE
  const filteredAreas = useMemo(() => {
    return areas.filter(area => {
      const matchesSearch = searchTerm === "" || 
        area.c_codigo_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area.s_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        area.s_description_area.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "" || area.ck_estatus === statusFilter;
      
      const matchesSucursal = sucursalFilter === "" || 
        area.ck_sucursal === sucursalFilter ||
        (area.sucursal_nombre && area.sucursal_nombre.toLowerCase().includes(sucursalFilter.toLowerCase()));

      return matchesSearch && matchesStatus && matchesSucursal;
    });
  }, [areas, searchTerm, statusFilter, sucursalFilter]);

  // CALCULAR ESTADÍSTICAS DINÁMICAS
  const stats = useMemo(() => {
    const total = areas.length;
    const activas = areas.filter(area => area.ck_estatus === "ACTIVO").length;
    const inactivas = areas.filter(area => area.ck_estatus === "INACTIVO").length;
    
    // Contar por sucursal
    const sucursalCount = areas.reduce((acc, area) => {
      const sucursal = area.sucursal_nombre || area.ck_sucursal;
      acc[sucursal] = (acc[sucursal] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      activas,
      inactivas,
      sucursalCount
    };
  }, [areas]);

  // OBTENER SUCURSALES ÚNICAS PARA EL FILTRO
  const uniqueSucursales = useMemo(() => {
    const sucursales = areas.map(area => ({
      value: area.ck_sucursal,
      label: area.sucursal_nombre || area.ck_sucursal
    }));
    
    return Array.from(
      new Map(sucursales.map(s => [s.value, s])).values()
    );
  }, [areas]);

  // FUNCIÓN PARA NAVEGAR AL FORMULARIO DE AÑADIR ÁREA
  const handleAddArea = () => {
    window.location.href = "/catalogos/areas/formulario/";
  };

  // MANEJAR EDICIÓN
  const handleEditArea = (area: any) => {
    console.log('Editando área:', area);
    // Aquí podrías navegar a la página de edición o abrir un modal
    // window.location.href = `/catalogos/areas/editar/${area.id}`;
  };

  // MANEJAR ELIMINACIÓN
  const handleDeleteArea = (area: any) => {
    if (window.confirm(`¿Estás seguro de eliminar el área "${area.s_area}"?`)) {
      deleteArea(area.id);
    }
  };

  // LIMPIAR FILTROS
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setSucursalFilter("");
  };

  return (
    <>
      <PageMeta
        title="Sistema de Turnos - Catálogo de Áreas"
        description="Catálogo de áreas para el sistema de turnos"
      />
      <PageBreadcrumb pageTitle={titleTable} />
      
      {/* Estadísticas Resumidas */}
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
          <div className="text-sm">
            {Object.entries(stats.sucursalCount).map(([sucursal, count]) => (
              <div key={sucursal}>{sucursal}: {count}</div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Botón de añadir */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button 
            onClick={clearFilters}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
          >
            Limpiar Filtros
          </button>
          {(searchTerm || statusFilter || sucursalFilter) && (
            <span className="text-sm text-gray-600">
              Mostrando {filteredAreas.length} de {stats.total} áreas
            </span>
          )}
        </div>
        
        <button 
          onClick={handleAddArea}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <span className="mr-2">+</span>
          Añadir Área
        </button>
      </div>

      {/* FILTROS DINÁMICOS */}
      <div className="mb-4 flex flex-wrap gap-4">
        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código, nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-80 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
        
        {/* Filtro por Estado */}
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTI">Inactivo</option>
        </select>
        
        {/* Filtro por Sucursal */}
        <select 
          value={sucursalFilter}
          onChange={(e) => setSucursalFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">Todas las sucursales</option>
          {uniqueSucursales.map(sucursal => (
            <option key={sucursal.value} value={sucursal.value}>
              {sucursal.label}
            </option>
          ))}
        </select>
      </div>

      {/* TABLA DINÁMICA */}
      <div className="space-y-6">
        <ComponentCard title="Consulta de Áreas">
          <AreaTableOne
            areas={filteredAreas}
            isLoading={isLoading}
            onEdit={handleEditArea}
            onDelete={handleDeleteArea}
            itemsPerPage={5}
          />
        </ComponentCard>
      </div>
    </>
  );
}