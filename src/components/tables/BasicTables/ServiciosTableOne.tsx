import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { serviciosService, Servicio } from "../../../services/serviciosService";
import { useAuth } from "../../../contexts/AuthContext";

interface ServiciosTableProps {
  searchTerm: string;
  estatusFilter: string;
  onStatsUpdate: (stats: any) => void;
}

export default function ServiciosTableOne({
  searchTerm,
  estatusFilter,
  onStatsUpdate,
}: ServiciosTableProps) {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const itemsPerPage = 8;

  // Función para cargar servicios
  const loadServicios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ⚡ Si tu backend soporta filtros/paginación:
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        estatus: estatusFilter,
      };

      const response = await serviciosService.getAllServicios({
  page: currentPage,
  limit: itemsPerPage,
  search: searchTerm,
  estatus: estatusFilter,
});

// 👇 ahora usas response.data
if (response.success) {
  setServicios(response.data);
  setTotalItems(response.total || response.data.length);
  setTotalPages(Math.ceil((response.total || response.data.length) / itemsPerPage));
}


      // Opcional: estadísticas resumidas
      const stats = {
        total: response.success ? response.data.length : 0,
        activos: response.success
          ? response.data.filter((s: Servicio) => s.ck_estatus === "ACTIVO").length
          : 0,
        inactivos: response.success
          ? response.data.filter((s: Servicio) => s.ck_estatus === "INACTIVO").length
          : 0,
      };
      onStatsUpdate(stats);
    } catch (err: any) {
      setError(err.message);
      console.error("Error al cargar servicios:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, estatusFilter, onStatsUpdate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, estatusFilter]);

  useEffect(() => {
    loadServicios();
  }, [currentPage, searchTerm, estatusFilter]);

  // Paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const serviciosPaginados = servicios.slice(startIndex, endIndex);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Acciones
  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar el servicio "${nombre}"?`)) {
      try {
        await serviciosService.deleteServicio(id);
        alert("Servicio eliminado correctamente");
        loadServicios();
      } catch (error: any) {
        alert("Error al eliminar servicio: " + error.message);
      }
    }
  };

  const handleEdit = (id: string) => {
    window.location.href = `/catalogos/servicios/formulario/?id=${id}`;
  };

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando servicios...</span>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️ Error al cargar servicios</div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button
            onClick={loadServicios}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader>Servicio</TableCell>
              <TableCell isHeader>Descripción</TableCell>
              <TableCell isHeader>Código</TableCell>
              <TableCell isHeader>Área</TableCell>
              <TableCell isHeader>Estatus</TableCell>
              <TableCell isHeader>Acciones</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {serviciosPaginados.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-2">📋</span>
                    <span>No se encontraron servicios</span>
                    <span className="text-sm mt-1">
                      Intenta ajustar los filtros de búsqueda
                    </span>
                  </div>
                </td>
              </TableRow>
            ) : (
              serviciosPaginados.map((servicio) => (
                <TableRow key={servicio.id} className="hover:bg-gray-50">
                  <TableCell>{servicio.s_servicio}</TableCell>
                  <TableCell>{servicio.s_descripcion_servicio || "—"}</TableCell>
                  <TableCell className="font-mono">{servicio.c_codigo_servicio}</TableCell>
                  <TableCell>{servicio.ck_area}</TableCell>
                  <TableCell>
                    <Badge
                      size="sm"
                      color={servicio.ck_estatus === "ACTIVO" ? "success" : "error"}
                    >
                      {servicio.ck_estatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(servicio.id)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title="Editar servicio"
                      >
                        ✏️
                      </button>
                      {user?.tipo_usuario === 1 && (
                        <button
                          onClick={() =>
                            handleDelete(servicio.id, servicio.s_servicio)
                          }
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar servicio"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Mostrando {startIndex + 1}-{endIndex} de {totalItems} servicios
          </span>
          <div className="flex space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
