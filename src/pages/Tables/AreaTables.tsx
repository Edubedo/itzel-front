import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AreaTableOne from "../../components/tables/BasicTables/AreaTableOne";

// Define las props que recibe el componente
interface AreaTablesProps {
  titleTable?: string;
}

export default function AreaTables({ titleTable = "Catálogo de áreas" }: AreaTablesProps) {
    // Función para navegar al formulario de añadir área
  const handleAddArea = () => {
    window.location.href = "/catalogos/areas/formulario/";
  };
  return (
    <>
      <PageMeta
        title="Sistema de Turnos - Catálogo de Áreas"
        description="Catálogo de áreas para el sistema de turnos"
      />
      <PageBreadcrumb pageTitle={titleTable} />
      
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

      <div className="mb-4 flex flex-wrap gap-4">
        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
        
        {/* Filtro por Estado */}
        <select className="border rounded-lg px-3 py-2">
          <option value="">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
        
        {/* Filtro por Sucursal */}
        <select className="border rounded-lg px-3 py-2">
          <option value="">Todas las sucursales</option>
          <option value="central">Sucursal Central</option>
          <option value="norte">Sucursal Norte</option>
        </select>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Consulta de Áreas">
          <AreaTableOne />
        </ComponentCard>
      </div>

      {/* Estadísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">Total Áreas</h3>
          <p className="text-2xl font-bold">15</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800">Activas</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Inactivas</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800">Por Sucursal</h3>
          <p className="text-sm">Central: 8 | Norte: 4 | Sur: 3</p>
        </div>
      </div>
    </>
  );
}

