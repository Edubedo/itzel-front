import React, { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UsuariosTableOne from "../../components/tables/BasicTables/UsuariosTableOne";
import { useAuth } from "../../contexts/AuthContext";

interface UsuariosTablesProps {
  titleTable?: string;
}

interface UsuarioStats {
  total: number;
  activos: number;
  inactivos: number;
  porTipo: {
    administradores: number;
    ejecutivos: number;
    asesores: number;
  };
}

export default function UsuariosTables({ titleTable = "Gestión de Usuarios" }: UsuariosTablesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoUsuarioFilter, setTipoUsuarioFilter] = useState("");
  const [estatusFilter, setEstatusFilter] = useState("ACTIVO");
  const [stats, setStats] = useState<UsuarioStats>({
    total: 0,
    activos: 0,
    inactivos: 0,
    porTipo: {
      administradores: 0,
      ejecutivos: 0,
      asesores: 0
    }
  });

  const { user } = useAuth();

  // Función para navegar al formulario de añadir usuario
  const handleAddUsuario = () => {
    window.location.href = "/catalogos/usuarios/formulario/";
  };

  // Manejar actualización de estadísticas
  const handleStatsUpdate = (newStats: UsuarioStats) => {
    setStats(newStats);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setTipoUsuarioFilter("");
    setEstatusFilter("");
  };

  return (
    <>
      <PageMeta
        title="Sistema de Turnos - Gestión de Usuarios"
        description="Gestión y administración de usuarios del sistema de turnos"
      />
      <PageBreadcrumb pageTitle={titleTable} />
      
      {/* Botón de añadir (solo para administradores) */}
      {user?.tipo_usuario === 1 && (
        <div className="mb-6 flex justify-end">
          <button 
            onClick={handleAddUsuario}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
          >
            <span className="mr-2">+</span>
            Añadir Usuario
          </button>
        </div>
      )}

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Buscador */}
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>
          
          {/* Filtro por Tipo de Usuario */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuario
            </label>
            <select 
              value={tipoUsuarioFilter}
              onChange={(e) => setTipoUsuarioFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="1">Administrador</option>
              <option value="2">Ejecutivo</option>
              <option value="3">Asesor</option>
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
              <option value="INACTI">Inactivo</option>
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

      

      {/* Tabla de usuarios */}
      <div className="space-y-6">
        <ComponentCard title="Lista de Usuarios">
          <UsuariosTableOne 
            searchTerm={searchTerm}
            tipoUsuarioFilter={tipoUsuarioFilter}
            estatusFilter={estatusFilter}
            onStatsUpdate={handleStatsUpdate}
          />
        </ComponentCard>
      </div>

      {/* Estadísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Total Usuarios</h3>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="text-4xl opacity-80">👥</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Usuarios Activos</h3>
              <p className="text-3xl font-bold">{stats.activos}</p>
            </div>
            <div className="text-4xl opacity-80">✅</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Usuarios Inactivos</h3>
              <p className="text-3xl font-bold">{stats.inactivos}</p>
            </div>
            <div className="text-4xl opacity-80">❌</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Por Tipo</h3>
              <div className="text-sm space-y-1 mt-2">
                <div>Admin: {stats.porTipo.administradores}</div>
                <div>Ejecutivos: {stats.porTipo.ejecutivos}</div>
                <div>Asesores: {stats.porTipo.asesores}</div>
              </div>
            </div>
            <div className="text-4xl opacity-80">📊</div>
          </div>
        </div>
      </div>
    </>
  );
} 