import React, { useMemo } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { SucursalData } from '../../../services/sucursalesService';

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

    const sucursalesFiltradas = useMemo(() => {
        return listaSucursales.filter(sucursal => {
            const matchesSearchTerm = sucursal.s_domicilio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    sucursal.s_nombre_sucursal?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEstado = estadoFilter ? sucursal.municipio?.estado?.s_estado === estadoFilter : true;
            const matchesMunicipio = municipioFilter ? sucursal.municipio?.s_municipio === municipioFilter : true;
            return matchesSearchTerm && matchesEstado && matchesMunicipio;
        });
    }, [listaSucursales, searchTerm, estadoFilter, municipioFilter]);

    if (loading) {
        return <div className="text-center p-10">Cargando sucursales...</div>;
    }

    if (sucursalesFiltradas.length === 0) {
        return <div className="text-center text-gray-500 py-4">No se encontraron sucursales con esos filtros.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Nombre</th>
                        <th className="py-2 px-4 border-b text-left">Estado</th>
                        <th className="py-2 px-4 border-b text-left">Municipio</th>
                        <th className="py-2 px-4 border-b text-left">Domicilio</th>
                        <th className="py-2 px-4 border-b text-left">Teléfono</th>
                        <th className="py-2 px-4 border-b text-center">Ejecutivos</th>
                        <th className="py-2 px-4 border-b text-center">Asesores</th>
                        <th className="py-2 px-4 border-b text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sucursalesFiltradas.map(sucursal => (
                        <tr key={sucursal.ck_sucursal} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b font-medium">{sucursal.s_nombre_sucursal}</td>
                            <td className="py-2 px-4 border-b">{sucursal.municipio?.estado?.s_estado || 'N/A'}</td>
                            <td className="py-2 px-4 border-b">{sucursal.municipio?.s_municipio || 'N/A'}</td>
                            <td className="py-2 px-4 border-b">{sucursal.s_domicilio}</td>
                            <td className="py-2 px-4 border-b">{sucursal.s_telefono || 'N/A'}</td>
                            <td className="py-2 px-4 border-b text-center">{sucursal.ejecutivos || 0}</td>
                            <td className="py-2 px-4 border-b text-center">{sucursal.asesores || 0}</td>
                            <td className="py-2 px-4 border-b">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => onEdit(sucursal)} 
                                        className="text-blue-600 hover:text-blue-900 font-semibold"
                                        title="Editar sucursal"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(sucursal.ck_sucursal!)} 
                                        className="text-red-600 hover:text-red-900 font-semibold"
                                        title="Eliminar sucursal"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}