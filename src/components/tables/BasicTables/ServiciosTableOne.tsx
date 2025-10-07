import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { serviciosService } from "../../../services/serviciosService";
import { useAuth } from "../../../contexts/AuthContext";

interface ServiciosTableProps {
  servicios: any[];
  setServicios: (servicios: any[]) => void;
  searchTerm: string;
  areaFilter: string;
  estatusFilter: string;
  onStatsUpdate: (stats: any) => void;
}

export default function ServiciosTableOne({
  servicios,
  setServicios,
  searchTerm,
  areaFilter,
  estatusFilter,
  onStatsUpdate,
}: ServiciosTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<{ 
    show: boolean; 
    message: string; 
    type: "warning" | "success" | "error";
    servicioToDelete?: {
      id: string;
      nombre: string;
    } | null;
  }>({
    show: false,
    message: "",
    type: "warning",
    servicioToDelete: null
  });

  const { user } = useAuth();
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, estatusFilter, areaFilter]);

  // Calcular estadísticas cuando cambien los servicios o filtros
  useEffect(() => {
    const calculateStats = () => {
      const filteredServicios = servicios.filter(servicio => {
        const matchesSearch = !searchTerm || 
          servicio.s_servicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          servicio.c_codigo_servicio?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesEstatus = !estatusFilter || servicio.ck_estatus === estatusFilter;
        const matchesArea = !areaFilter || servicio.ck_area === areaFilter;

        return matchesSearch && matchesEstatus && matchesArea;
      });

      const total = filteredServicios.length;
      const activos = filteredServicios.filter(s => s.ck_estatus === "ACTIVO").length;
      const inactivos = filteredServicios.filter(s => s.ck_estatus === "INACTI").length;
      const porArea: Record<string, number> = {};

      filteredServicios.forEach(servicio => {
        const area = servicio.ck_area || 'Sin área';
        porArea[area] = (porArea[area] || 0) + 1;
      });

      const newStats = { total, activos, inactivos, porArea };
      onStatsUpdate(newStats);
    };

    calculateStats();
  }, [servicios, searchTerm, estatusFilter, areaFilter, onStatsUpdate]);

  // Calcular paginación
  useEffect(() => {
    const filteredServicios = servicios.filter(servicio => {
      const matchesSearch = !searchTerm || 
        servicio.s_servicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servicio.c_codigo_servicio?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstatus = !estatusFilter || servicio.ck_estatus === estatusFilter;
      const matchesArea = !areaFilter || servicio.ck_area === areaFilter;

      return matchesSearch && matchesEstatus && matchesArea;
    });

    setTotalPages(Math.ceil(filteredServicios.length / itemsPerPage));
    setTotalItems(filteredServicios.length);
  }, [servicios, searchTerm, estatusFilter, areaFilter, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

  // Mostrar warning para eliminar servicio
  const handleShowDeleteWarning = (servicioId: string, nombre: string) => {
    setToast({
      show: true,
      message: `¿Seguro que deseas eliminar el servicio "${nombre}"? Esta acción no se puede deshacer.`,
      type: "warning",
      servicioToDelete: {
        id: servicioId,
        nombre,
      }
    });
  };

  // Confirmar eliminación de servicio
  const confirmarEliminarServicio = async () => {
    if (!toast.servicioToDelete) return;
    const { id, nombre } = toast.servicioToDelete;
    try {
      setLoading(true);

      const result = await serviciosService.deleteServicio(id);

      if (!result.success) {
        throw new Error(result.message || "Error al eliminar el servicio");
      }

      // Eliminar del estado local
      setServicios(servicios.filter(servicio => servicio.ck_servicio !== id));

      setToast({
        show: true,
        message: `Servicio "${nombre}" eliminado exitosamente`,
        type: "success"
      });
    } catch (error: any) {
      setToast({
        show: true,
        message: `Error al eliminar el servicio: ${error.message}`,
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (servicioId: string) => {
    window.location.href = `/catalogos/servicios/formulario/?id=${servicioId}`;
  };

  const handleRetry = () => {
    setError(null);
    // Recargar servicios si es necesario
  };

  // Filtrar servicios para la página actual
  const filteredServicios = servicios.filter(servicio => {
    const matchesSearch = !searchTerm || 
      servicio.s_servicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.c_codigo_servicio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstatus = !estatusFilter || servicio.ck_estatus === estatusFilter;
    const matchesArea = !areaFilter || servicio.ck_area === areaFilter;

    return matchesSearch && matchesEstatus && matchesArea;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredServicios.length);
  const serviciosPaginados = filteredServicios.slice(startIndex, endIndex);

  if (loading && servicios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70A18E] dark:border-[#8ECAB2]"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando servicios...</span>
      </div>
    );
  }

  if (error && servicios.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">Error al cargar servicios</div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-3">{error}</div>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-[#70A18E] hover:bg-[#547A6B] text-white rounded transition-colors dark:bg-[#8ECAB2] dark:hover:bg-[#70A18E]"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Reintentar'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Toast notification */}
      {toast.show && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
          <div className={`relative max-w-md w-full mx-4 rounded-xl shadow-2xl border transition-all duration-200 ${
            toast.type === "warning" ? "bg-white border-orange-100 dark:bg-gray-800 dark:border-orange-900" :
            toast.type === "success" ? "bg-white border-green-100 dark:bg-gray-800 dark:border-green-900" :
            "bg-white border-red-100 dark:bg-gray-800 dark:border-red-900"
          }`}>
            {/* Header con icono */}
            <div className={`flex items-center px-6 py-4 rounded-t-xl ${
              toast.type === "warning" ? "bg-orange-50 border-b border-orange-100 dark:bg-orange-900/20 dark:border-orange-800" :
              toast.type === "success" ? "bg-green-50 border-b border-green-100 dark:bg-green-900/20 dark:border-green-800" :
              "bg-red-50 border-b border-red-100 dark:bg-red-900/20 dark:border-red-800"
            }`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                toast.type === "warning" ? "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-300" :
                toast.type === "success" ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300" :
                "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300"
              }`}>
                {toast.type === "warning" ? "🗑️" : toast.type === "success" ? "✅" : "❌"}
              </div>
              <div className="ml-4">
                <h3 className={`text-lg font-semibold ${
                  toast.type === "warning" ? "text-orange-800 dark:text-orange-300" :
                  toast.type === "success" ? "text-green-800 dark:text-green-300" :
                  "text-red-800 dark:text-red-300"
                }`}>
                  {toast.type === "warning" ? "Confirmar Eliminación" :
                   toast.type === "success" ? "¡Éxito!" : "Error"}
                </h3>
              </div>
            </div>

            {/* Contenido */}
            <div className="px-6 py-6">
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6">
                {toast.message}
              </p>

              {/* Botones para warning */}
              {toast.type === "warning" && toast.servicioToDelete && (
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setToast({ show: false, message: "", type: "warning" })}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmarEliminarServicio}
                    className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors duration-150 ${
                      loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              )}

              {/* Para success/error, botón de cerrar */}
              {(toast.type === "success" || toast.type === "error") && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setToast({ show: false, message: "", type: "warning" })}
                    className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      toast.type === "success" ? 
                        "text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/30" :
                        "text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/30"
                    }`}
                  >
                    Aceptar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-gray-700">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Código
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Nombre del Servicio
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Descripción
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Área
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Estado
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {serviciosPaginados.length === 0 && !loading ? (
              <TableRow>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-2">🛠️</span>
                    <span>No se encontraron servicios</span>
                    <span className="text-sm mt-1">
                      {searchTerm || estatusFilter || areaFilter
                        ? 'Intente ajustar los filtros de búsqueda'
                        : 'No hay servicios registrados en el sistema'
                      }
                    </span>
                  </div>
                </td>
              </TableRow>
            ) : (
              serviciosPaginados.map((servicio) => (
                <TableRow key={servicio.ck_servicio} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <TableCell className="px-5 py-4 text-start">
                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {servicio.c_codigo_servicio}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                    {servicio.s_servicio}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {servicio.s_descripcion_servicio || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {servicio.area_nombre || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={servicio.ck_estatus?.trim().toUpperCase() === "ACTIVO" ? "success" : "error"}
                    >
                      {servicio.ck_estatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(servicio.ck_servicio)}
                        className="p-2 text-[#70A18E] hover:text-[#547A6B] hover:bg-[#B7F2DA]/20 rounded-md transition-colors dark:text-[#8ECAB2] dark:hover:text-[#B7F2DA] dark:hover:bg-[#8ECAB2]/10"
                        title="Editar servicio"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {user?.tipo_usuario === 1 && (
                        <button
                          onClick={() => handleShowDeleteWarning(
                            servicio.ck_servicio,
                            servicio.s_servicio
                          )}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                          title="Eliminar servicio"
                          disabled={loading}
                        >
                          {/* Ícono de bote de basura */}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {totalPages > 1 && serviciosPaginados.length > 0 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {startIndex + 1}-{endIndex} de {filteredServicios.length} servicios
            </span>
            <div className="flex space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}