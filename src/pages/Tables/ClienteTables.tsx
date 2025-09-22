import React, { useState, useCallback, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ClientesTableOne from "../../components/tables/BasicTables/ClientesTableOne";
import { ClienteStats } from "../../services/clientesService";
import { clientesService, TipoContrato } from "../../services/clientesService";

interface ClienteTablesProps {
  titleTable?: string;
}

export default function ClienteTables({ titleTable = "Catálogo de clientes" }: ClienteTablesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [estatusFilter, setEstatusFilter] = useState("");
  const [tipoContratoFilter, setTipoContratoFilter] = useState("");
  const [tiposContrato, setTiposContrato] = useState<TipoContrato[]>([]);

  const [stats, setStats] = useState<ClienteStats>({
    totalClientes: 0,
    clientesActivos: 0,
    clientesInactivos: 0,
    clientesPremium: 0
  });

  // Función para navegar al formulario de añadir cliente
  const handleAddCliente = () => {
    window.location.href = "/catalogos/clientes/formulario/";
  };

  // Manejar actualización de estadísticas
  const handleStatsUpdate = useCallback((newStats: ClienteStats) => {
    setStats(newStats);
  }, []);

  // Cargar tipos de contrato
  useEffect(() => {
    const fetchTiposContrato = async () => {
      try {
        const response = await clientesService.getTiposContrato();
        if (response.success && response.data) {
          setTiposContrato(response.data);
        }
      } catch (error) {
        console.error('Error al obtener tipos de contrato:', error);
      }
    };
    fetchTiposContrato();
  }, []);

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setEstatusFilter("");
    setTipoContratoFilter("");
  };

  return (
    <>
      <PageMeta
        title="Sistema de Turnos - Catálogo de Clientes"
        description="Catálogo de clientes para el sistema de turnos"
      />
      <PageBreadcrumb pageTitle={titleTable} />

      {/* Estadísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">Total Clientes</h3>
          <p className="text-2xl font-bold">{stats.totalClientes}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800">Activos</h3>
          <p className="text-2xl font-bold">{stats.clientesActivos}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Inactivos</h3>
          <p className="text-2xl font-bold">{stats.clientesInactivos}</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800">Clientes Premium</h3>
          <p className="text-2xl font-bold">{stats.clientesPremium}</p>
        </div>
      </div>

      {/* Botón de añadir */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddCliente}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <span className="mr-2">+</span>
          Añadir Cliente
        </button>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Buscador */}
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Cliente
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por código, nombre, apellido..."
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
              <option value="INACTIVO">Inactivo</option>
            </select>
          </div>

          {/* Filtro por Tipo de Contrato */}
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Contrato
            </label>
            <select
              value={tipoContratoFilter}
              onChange={(e) => setTipoContratoFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los tipos</option>
              {tiposContrato.map((tipo) => (
                <option key={tipo.s_tipo_contrato} value={tipo.s_tipo_contrato}>
                  {tipo.s_tipo_contrato}
                </option>
              ))}
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
        <ComponentCard title="Consulta de Clientes">
          <ClientesTableOne
            searchTerm={searchTerm}
            estatusFilter={estatusFilter}
            tipoContratoFilter={tipoContratoFilter}
            onStatsUpdate={handleStatsUpdate}
          />
        </ComponentCard>
      </div>
    </>
  );
}