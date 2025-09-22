import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { clientesService, Cliente, ClientesResponse, ClienteStats } from "../../../services/clientesService";

interface ClienteTableOneProps {
  searchTerm: string;
  estatusFilter: string;
  tipoContratoFilter: string;
  onStatsUpdate: (stats: ClienteStats) => void;
}

export default function ClienteTableOne({ 
  searchTerm, 
  estatusFilter, 
  tipoContratoFilter, 
  onStatsUpdate 
}: ClienteTableOneProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const itemsPerPage = 5;

  // Reset página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, estatusFilter, tipoContratoFilter]);

  // Cargar clientes
  useEffect(() => {
    let isActive = true;

    const loadClientes = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Cargando clientes - página:', currentPage);

        const params: any = {
          page: currentPage,
          limit: itemsPerPage
        };

        // Solo agregar parámetros si tienen valor
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (estatusFilter) params.ck_estatus = estatusFilter;
        if (tipoContratoFilter) params.s_tipo_contrato = tipoContratoFilter;

        const response: ClientesResponse = await clientesService.getAllClientes(params);
        
        if (!isActive) return;

        if (response.success && response.data) {
          setClientes(response.data.clientes || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
          setTotalItems(response.data.pagination?.total || 0);
        } else {
          throw new Error('Respuesta inválida del servidor');
        }

      } catch (err: any) {
        if (!isActive) return;
        console.error('Error al cargar clientes:', err);
        setError(err.message || 'Error al cargar clientes');
        setClientes([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadClientes();

    return () => {
      isActive = false;
    };
  }, [currentPage, searchTerm, estatusFilter, tipoContratoFilter, refreshTrigger]);

  // Cargar estadísticas
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsResponse = await clientesService.getClientesStats();
        if (statsResponse.success && statsResponse.data) {
          onStatsUpdate(statsResponse.data);
          setStatsLoaded(true);
        }
      } catch (error) {
        console.warn('Error al cargar estadísticas:', error);
      }
    };

    if (!statsLoaded || refreshTrigger > 0) {
      loadStats();
    }
  }, [onStatsUpdate, statsLoaded, refreshTrigger]);

  // Funciones de paginación
  const goToPage = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Manejar inactivación de cliente
  const handleInactivate = async (clienteId: string, nombre: string) => {
    if (window.confirm(`¿Está seguro de que desea inactivar al cliente "${nombre}"?\n\nEsta acción cambiará el estado del cliente a "INACTIVO" pero no lo eliminará permanentemente.`)) {
      try {
        setLoading(true);
        
        await clientesService.deleteCliente(clienteId);
        
        setRefreshTrigger(prev => prev + 1);
        setStatsLoaded(false);
        
        alert('Cliente inactivado exitosamente');

      } catch (error: any) {
        console.error('Error al inactivar cliente:', error);
        alert('Error al inactivar cliente: ' + error.message);
        setLoading(false);
      }
    }
  };

  // Manejar edición
  const handleEdit = (clienteId: string) => {
    window.location.href = `/catalogos/clientes/formulario/?id=${clienteId}`;
  };

  // Función para reintentar carga
  const handleRetry = () => {
    setError(null);
    setRefreshTrigger(prev => prev + 1);
  };

  // Mostrar loading
  if (loading && clientes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando clientes...</span>
      </div>
    );
  }

  // Mostrar error
  if (error && clientes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error al cargar clientes</div>
          <div className="text-gray-600 text-sm mb-3">{error}</div>
          <button 
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Reintentar'}
          </button>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + clientes.length, totalItems);

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {loading && clientes.length > 0 && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Código Cliente
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Nombre
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Apellido Paterno
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Apellido Materno
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tipo Contrato
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Domicilio
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Cliente Premium
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Estado
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {clientes.length === 0 && !loading ? (
              <TableRow>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-2">👥</span>
                    <span>No se encontraron clientes</span>
                    <span className="text-sm mt-1">
                      {searchTerm || estatusFilter || tipoContratoFilter 
                        ? 'Intente ajustar los filtros de búsqueda' 
                        : 'No hay clientes registrados en el sistema'
                      }
                    </span>
                  </div>
                </td>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.ck_cliente} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <TableCell className="px-5 py-4 text-start">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {cliente.c_codigo_cliente}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                    {cliente.s_nombre}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {cliente.s_apellido_paterno || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {cliente.s_apellido_materno || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {cliente.s_tipo_contrato || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {cliente.s_domicilio || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                    >
                      {cliente.l_cliente_premium ? "PREMIUM" : "ESTÁNDAR"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={cliente.ck_estatus === "ACTIVO" ? "success" : "error"}
                    >
                      {cliente.ck_estatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(cliente.ck_cliente)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="Editar cliente"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleInactivate(cliente.ck_cliente, `${cliente.s_nombre} ${cliente.s_apellido_paterno || ''}`)}
                        className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
                        title="Inactivar cliente"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* PAGINACIÓN */}
        {totalPages > 1 && clientes.length > 0 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {startIndex + 1}-{endIndex} de {totalItems} clientes
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={goToPrevPage}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Anterior
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    disabled={loading}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                onClick={goToNextPage}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}