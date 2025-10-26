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
import { useLanguage } from "../../../context/LanguageContext";

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

  // Toast notification state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "warning" | "success" }>({
    show: false,
    message: "",
    type: "warning"
  });

  const [clienteToToggle, setClienteToToggle] = useState<{
    id: string;
    nombre: string;
    estatus: string;
  } | null>(null);

  const { t } = useLanguage();
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

        const params: any = {
          page: currentPage,
          limit: itemsPerPage
        };

        // Solo agregar parámetros si tienen valor
        if (searchTerm.trim()) params.search = searchTerm.trim().toLowerCase();
        if (estatusFilter) params.ck_estatus = estatusFilter;
        if (tipoContratoFilter) params.s_tipo_contrato = tipoContratoFilter;

        const response: ClientesResponse = await clientesService.getAllClientes(params);

        if (!isActive) return;

        if (response.success && response.data) {
          setClientes(response.data.clientes || []);
          const pagination = response.data.pagination;
          if (pagination) {
            setTotalPages(pagination.totalPages || 1);
            setTotalItems(pagination.total || 0);
          } else {
            setTotalPages(1);
            setTotalItems(response.data.clientes?.length || 0);
          }
        } else {
          throw new Error(response.message || 'Respuesta inválida del servidor');
        }

      } catch (err: any) {
        if (!isActive) return;
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
        // Silenciar error de stats
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

  // Mostrar warning para activar/inactivar cliente
  const handleShowWarning = (clienteId: string, nombre: string, estatusActual: string) => {
    setClienteToToggle({
      id: clienteId,
      nombre,
      estatus: estatusActual.trim().toUpperCase(),
    });
    setToast({
      show: true,
      message: `¿Seguro que deseas ${estatusActual.trim().toUpperCase() === "ACTIVO" ? "inactivar" : "activar"} el cliente "${nombre}"?`,
      type: "warning"
    });
  };

  // Confirmar activación/inactivación de cliente
  const confirmarToggleCliente = async () => {
    if (!clienteToToggle) return;
    const esActivo = clienteToToggle.estatus === "ACTIVO";
    const nuevoEstatus = esActivo ? "INACTIVO" : "ACTIVO";
    try {
      setLoading(true);

      await clientesService.updateCliente(clienteToToggle.id, { ck_estatus: nuevoEstatus });

      setRefreshTrigger(prev => prev + 1);
      setStatsLoaded(false);
      setToast({
        show: true,
        message: `Cliente ${esActivo ? "inactivado" : "activado"} exitosamente`,
        type: "success"
      });

      setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 2500);
    } catch (error: any) {
      setToast({
        show: true,
        message: `Error al cambiar estado del cliente: ${error.message}`,
        type: "warning"
      });
      setLoading(false);
    } finally {
      setClienteToToggle(null);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando clientes...</span>
      </div>
    );
  }

  // Mostrar error
  if (error && clientes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">Error al cargar clientes</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-3">{error}</div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
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
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header con botón de actualizar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {t("clients.clientList")}
        </h3>
        <button
          onClick={() => {
            setRefreshTrigger(prev => prev + 1);
            setStatsLoaded(false);
          }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-800 dark:hover:border-blue-700"
          title={t("common.refresh")}
        >
          <svg 
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          {loading ? t("common.loading") : t("common.refresh")}
        </button>
      </div>

      {/* Toast notification */}
      {toast.show && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className={`relative max-w-md w-full mx-4 rounded-xl shadow-2xl border transition-all duration-200 ${toast.type === "warning"
            ? "bg-white border-red-100 dark:bg-gray-800 dark:border-red-900"
            : "bg-white border-green-100 dark:bg-gray-800 dark:border-green-900"
            }`}>
            {/* Header con icono */}
            <div className={`flex items-center px-6 py-4 rounded-t-xl ${toast.type === "warning"
              ? "bg-red-50 border-b border-red-100 dark:bg-red-900/20 dark:border-red-800"
              : "bg-green-50 border-b border-green-100 dark:bg-green-900/20 dark:border-green-800"
              }`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${toast.type === "warning"
                ? "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300"
                : "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                }`}>
                {toast.type === "warning" ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-semibold ${toast.type === "warning" ? "text-red-800 dark:text-red-300" : "text-green-800 dark:text-green-300"
                  }`}>
                  {toast.type === "warning"
                    ? clienteToToggle?.estatus === "ACTIVO"
                      ? "Confirmar Inactivación"
                      : "Confirmar Activación"
                    : "¡Éxito!"
                  }
                </h3>
              </div>
            </div>

            {/* Contenido */}
            <div className="px-6 py-6">
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                {toast.message}
              </p>

              {/* Botones solo para warning */}
              {toast.type === "warning" && clienteToToggle && (
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => {
                      setClienteToToggle(null);
                      setToast({ ...toast, show: false });
                    }}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarToggleCliente}
                    className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 ${loading
                      ? "bg-gray-400 cursor-not-allowed dark:bg-gray-600"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-200 dark:bg-red-700 dark:hover:bg-red-600"
                      }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      "Confirmar"
                    )}
                  </button>
                </div>
              )}

              {/* Para success, botón de cerrar */}
              {toast.type === "success" && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setToast({ ...toast, show: false })}
                    className="px-5 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-150 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/30"
                  >
                    Aceptar
                  </button>
                </div>
              )}
            </div>

            {/* Efecto de cierre con click fuera */}
            <div
              className="absolute inset-0 -z-10"
              onClick={() => setToast({ ...toast, show: false })}
            />
          </div>
        </div>
      )}  

      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("clients.clientCode")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("clients.name")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("clients.lastName")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("clients.motherLastName")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("clients.contractType")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("clients.address")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("clients.premiumClient")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("clients.status")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("clients.actions")}
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {clientes.length === 0 && !loading ? (
              <TableRow>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-2">👥</span>
                    <span>{t("clients.noClientsFound")}</span>
                    <span className="text-sm mt-1">
                      {searchTerm || estatusFilter || tipoContratoFilter
                        ? t("clients.tryAdjustingFilters")
                        : t("clients.noClientsRegistered")
                      }
                    </span>
                  </div>
                </td>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.ck_cliente} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                      color={cliente.l_cliente_premium ? "success" : "primary"}
                    >
                      {cliente.l_cliente_premium ? t("clients.premium") : t("clients.standard")}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={cliente.ck_estatus.trim().toUpperCase() === "ACTIVO" ? "success" : "error"}
                    >
                      {cliente.ck_estatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(cliente.ck_cliente)}
                        className="p-2 text-red hover:text-[#547A6B] hover:bg-[#B7F2DA]/20 rounded-md transition-colors dark:text-[#8ECAB2] dark:hover:text-[#B7F2DA] dark:hover:bg-[#8ECAB2]/10"
                        title={t("clients.editClient")}
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleShowWarning(
                          cliente.ck_cliente,
                          `${cliente.s_nombre} ${cliente.s_apellido_paterno || ''}`,
                          cliente.ck_estatus
                        )}
                        className={`p-2 ${cliente.ck_estatus.trim().toUpperCase() === "ACTIVO"
                          ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-900/20"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
                          } rounded-md transition-colors`}
                        title={cliente.ck_estatus.trim().toUpperCase() === "ACTIVO" ? t("clients.deactivateClient") : t("clients.activateClient")}
                        disabled={loading}
                      >
                        {cliente.ck_estatus.trim().toUpperCase() === "ACTIVO" ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="5" y="11" width="14" height="8" rx="2" strokeWidth="2" stroke="currentColor" />
                            <path d="M7 11V7a5 5 0 019.9-1" strokeWidth="2" stroke="currentColor" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="5" y="11" width="14" height="8" rx="2" strokeWidth="2" stroke="currentColor" />
                            <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2" stroke="currentColor" />
                          </svg>
                        )}
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
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t("clients.showing")} {startIndex + 1}-{endIndex} {t("clients.of")} {totalItems} {t("clients.clients")}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t("clients.previous")}
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
                    className={`px-3 py-1 rounded-md text-sm ${currentPage === page
                        ? 'bg-[#70A18E] text-white dark:bg-[#8ECAB2] dark:text-gray-900'
                        : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {t("clients.next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}