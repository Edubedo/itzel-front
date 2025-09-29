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

      {/* Encabezado con título y botón compacto */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{titleTable}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gestiona y consulta los usuarios del sistema</p>
        </div>
        {user?.tipo_usuario === 1 && (
          <button
            onClick={handleAddUsuario}
            className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] hover:from-[#5E8F7A] hover:to-[#7AB89A] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md group w-full sm:w-auto dark:from-[#547A6B] dark:to-[#6A9A8B] dark:hover:from-[#456857] dark:hover:to-[#5A8A7B]"
          >
            <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium">Nuevo Usuario</span>
          </button>
        )}
      </div>

      {/* Estadísticas Resumidas - Diseño Moderno y Minimalista */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Usuarios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#70A18E]/10 to-[#8ECAB2]/10 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Total Usuarios</h3>
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

        {/* Inactivos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#FF8E8E]/10 to-[#FFB7B7]/10 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF8E8E] to-[#FFB7B7] rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Inactivos</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.inactivos}</p>
          <div className="w-8 h-1 bg-gradient-to-r from-[#FF8E8E] to-[#FFB7B7] rounded-full mt-3"></div>
        </div>

        {/* Por Tipo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-400/10 rounded-bl-full"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-400 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Por Tipo</h3>
          <div className="text-sm space-y-1 mt-2 dark:text-gray-200">
            <div>Admin: {stats.porTipo.administradores}</div>
            <div>Ejecutivos: {stats.porTipo.ejecutivos}</div>
            <div>Asesores: {stats.porTipo.asesores}</div>
          </div>
          <div className="w-8 h-1 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full mt-3"></div>
        </div>
      </div>

      {/* Filtros de búsqueda - Actualizados con el mismo estilo */}
      <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Buscador */}
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar Usuario
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
              />
              <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">🔍</span>
            </div>
          </div>

          {/* Filtro por Tipo de Usuario */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Usuario
            </label>
            <select
              value={tipoUsuarioFilter}
              onChange={(e) => setTipoUsuarioFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
            >
              <option value="">Todos los tipos</option>
              <option value="1">Administrador</option>
              <option value="2">Ejecutivo</option>
              <option value="3">Asesor</option>
            </select>
          </div>

          {/* Filtro por Estado */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Estado
            </label>
            <select
              value={estatusFilter}
              onChange={(e) => setEstatusFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
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
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 font-medium dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600"
            >
              Limpiar
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
    </>
  );
}