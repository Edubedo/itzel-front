import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import { SucursalData } from '../../../services/sucursalesService';
import { useAuth } from '../../../contexts/AuthContext';

interface SucursalesTableProps {
    listaSucursales: SucursalData[];
    searchTerm: string;
    estadoFilter: string;
    municipioFilter: string;
    onEdit: (sucursal: SucursalData) => void;
    onDelete: (id: string) => void;
    loading: boolean;
}

export default function SucursalesTable({
    listaSucursales,
    searchTerm,
    estadoFilter,
    municipioFilter,
    onEdit,
    onDelete,
    loading
}: SucursalesTableProps) {
    const { user } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const sucursalesFiltradas = useMemo(() => {
        return listaSucursales.filter(sucursal => {
            const matchesSearchTerm = sucursal.s_domicilio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    sucursal.s_nombre_sucursal?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEstado = estadoFilter ? sucursal.municipio?.estado?.s_estado === estadoFilter : true;
            const matchesMunicipio = municipioFilter ? sucursal.municipio?.s_municipio === municipioFilter : true;
            return matchesSearchTerm && matchesEstado && matchesMunicipio;
        });
    }, [listaSucursales, searchTerm, estadoFilter, municipioFilter]);

    // Calcular paginación
    const totalPages = Math.ceil(sucursalesFiltradas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sucursalesFiltradas.length);
    const sucursalesPaginadas = sucursalesFiltradas.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const goToNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);
    const goToPrevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70A18E] dark:border-[#8ECAB2]"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando sucursales...</span>
            </div>
        );
    }

    if (sucursalesFiltradas.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center">
                    <span className="text-2xl mb-2">🏢</span>
                    <span>No se encontraron sucursales</span>
                    <span className="text-sm mt-1">
                        {searchTerm || estadoFilter || municipioFilter
                            ? 'Intente ajustar los filtros de búsqueda'
                            : 'No hay sucursales registradas en el sistema'
                        }
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-gray-700">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Nombre
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Domicilio
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Estado
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Municipio
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Teléfono
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Ejecutivos
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                Asesores
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
                        {sucursalesPaginadas.map((sucursal) => (
                            <TableRow key={sucursal.ck_sucursal} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <TableCell className="px-5 py-4 text-start">
                                    <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                        {sucursal.s_nombre_sucursal}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {sucursal.s_domicilio}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {sucursal.municipio?.estado?.s_estado || 'N/A'}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {sucursal.municipio?.s_municipio || 'N/A'}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                    {sucursal.s_telefono || 'N/A'}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-center">
                                    {sucursal.ejecutivos || 0}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 text-center">
                                    {sucursal.asesores || 0}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <Badge
                                        size="sm"
                                        color={sucursal.ck_estatus?.trim().toUpperCase() === "ACTIVO" ? "success" : "error"}
                                    >
                                        {sucursal.ck_estatus}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onEdit(sucursal)}
                                            className="p-2 text-[#70A18E] hover:text-[#547A6B] hover:bg-[#B7F2DA]/20 rounded-md transition-colors dark:text-[#8ECAB2] dark:hover:text-[#B7F2DA] dark:hover:bg-[#8ECAB2]/10"
                                            title="Editar sucursal"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        {user?.tipo_usuario === 1 && (
                                            <button
                                                onClick={() => onDelete(sucursal.ck_sucursal!)}
                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                                title="Eliminar sucursal"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {startIndex + 1}-{endIndex} de {sucursalesFiltradas.length} sucursales
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
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
                                    className={`px-3 py-1 rounded-md text-sm ${currentPage === page
                                        ? 'bg-[#70A18E] text-white dark:bg-[#8ECAB2] dark:text-gray-900'
                                        : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}