import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { usuariosService, Usuario, UsuariosResponse } from "../../../services/usuariosService";
import { useAuth } from "../../../contexts/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";

interface UsuariosTableProps {
  searchTerm: string;
  tipoUsuarioFilter: string;
  estatusFilter: string;
  onStatsUpdate: (stats: any) => void;
}

export default function UsuariosTableOne({ 
  searchTerm, 
  tipoUsuarioFilter, 
  estatusFilter, 
  onStatsUpdate 
}: UsuariosTableProps) {
  const { t, language } = useLanguage();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Función para obtener el label del tipo de usuario (se recalcula con cada cambio de idioma)
  const getUserTypeLabel = (tipoUsuario: number): string => {
    const labels: { [key: number]: string } = {
      1: t("userType.administrator"),
      2: t("userType.executive"),
      3: t("userType.advisor")
    };
    return labels[tipoUsuario] || t("table.users.unknown");
  };

  const itemsPerPage = 8;

  // Función para cargar usuarios
  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        tipo_usuario: tipoUsuarioFilter,
        estatus: estatusFilter
      };

      const response: UsuariosResponse = await usuariosService.getAllUsuarios(params);
      
      if (response.success) {
        setUsuarios(response.data.usuarios);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      }

      // Cargar estadísticas
      const statsResponse = await usuariosService.getUsuariosStats();
      if (statsResponse.success) {
        onStatsUpdate(statsResponse.data);
      }

    } catch (err: any) {
      setError(err.message);
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, tipoUsuarioFilter, estatusFilter, onStatsUpdate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, tipoUsuarioFilter, estatusFilter]);
  
  useEffect(() => {
    loadUsuarios();
  }, [currentPage, searchTerm, tipoUsuarioFilter, estatusFilter]);

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Manejar eliminación de usuario
  const handleDelete = async (usuarioId: string, nombre: string) => {
    if (window.confirm(`${t("table.users.deleteConfirm")} "${nombre}"?`)) {
      try {
        await usuariosService.deleteUsuario(usuarioId);
        alert(t("table.users.deleteSuccess"));
        loadUsuarios(); // Recargar la lista
      } catch (error: any) {
        alert(t("table.users.deleteError") + ' ' + error.message);
      }
    }
  };

  // Manejar edición
  const handleEdit = (usuarioId: string) => {
    window.location.href = `/catalogos/usuarios/formulario/?id=${usuarioId}`;
  };

  // Función para formatear fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("table.users.noDate");
    try {
      return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US');
    } catch {
      return t("table.users.invalidDate");
    }
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t("table.users.loading")}</span>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-2">{t("table.users.error")}</div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button 
            onClick={loadUsuarios}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("table.retry")}
          </button>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("table.users.photo")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("table.users.fullName")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("table.users.emailPhone")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("table.users.rfcCurp")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("table.users.userType")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("table.users.status")}
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                {t("table.actions")}
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {usuarios.length === 0 ? (
              <TableRow>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl mb-2">👥</span>
                    <span>{t("table.users.notFound")}</span>
                    <span className="text-sm mt-1">{t("table.adjustFilters")}</span>
                  </div>
                </td>
              </TableRow>
            ) : (
              usuarios.map((usuario) => (
                <TableRow key={usuario.ck_usuario} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                  <TableCell className="px-5 py-4 text-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      {usuario.s_foto ? (
                        <img 
                          src={usuariosService.getImageUrl(usuario.s_foto)} 
                          alt={usuario.s_nombre}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`flex items-center justify-center w-full h-full text-white font-semibold text-sm bg-gradient-to-br from-blue-500 to-purple-600 ${usuario.s_foto ? 'hidden' : ''}`}>
                        {usuario.s_nombre.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 text-start">
                    <div>
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {usuario.s_nombre} {usuario.s_apellido_paterno} {usuario.s_apellido_materno}
                      </span>
                      {usuario.d_fecha_nacimiento && (
                        <div className="text-xs text-gray-500 mt-1">
                          {t("table.users.born")} {formatDate(usuario.d_fecha_nacimiento)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 text-start text-theme-sm">
                    <div>
                      <div className="text-gray-800 dark:text-white/90">{usuario.s_correo_electronico}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        📞 {usuario.s_telefono || t("table.users.noPhone")}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 text-start text-theme-sm">
                    <div>
                      <div className="text-gray-800 dark:text-white/90 text-xs font-mono">
                        RFC: {usuario.s_rfc || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        CURP: {usuario.s_curp || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        usuario.i_tipo_usuario === 1 ? "error" : 
                        usuario.i_tipo_usuario === 2 ? "warning" : "info"
                      }
                    >
                      {getUserTypeLabel(usuario.i_tipo_usuario)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={usuario.ck_estatus === "ACTIVO" ? "success" : "error"}
                    >
                      {usuario.ck_estatus}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(usuario.ck_usuario)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                        title={t("table.users.editUser")}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      {user?.tipo_usuario === 1 && usuario.ck_usuario !== user.uk_usuario && (
                        <button 
                          onClick={() => handleDelete(usuario.ck_usuario, `${usuario.s_nombre} ${usuario.s_apellido_paterno}`)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title={t("table.users.deleteUser")}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t("table.showing")} {startIndex + 1}-{endIndex} {t("table.of")} {totalItems} {t("users.userList").toLowerCase()}
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {t("table.previous")}
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
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {t("table.next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 