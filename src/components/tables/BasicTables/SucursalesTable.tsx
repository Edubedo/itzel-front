import React, { useMemo } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

interface Sucursal {
    id: number;
    sucursal: {
        estado: string;
        municipio: string;
        domicilio: string;
    };
    ejecutivos: any[]; 
    asesores: any[]; 
}

interface SucursalesTableProps {
    listaSucursales: Sucursal[];
    searchTerm: string;
    estadoFilter: string;
    municipioFilter: string;
    onEdit: (sucursal: Sucursal) => void;
    onDelete: (id: number) => void;
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
        return listaSucursales.filter(item => {
            const matchesSearchTerm = item.sucursal.domicilio.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEstado = estadoFilter ? item.sucursal.estado === estadoFilter : true;
            const matchesMunicipio = municipioFilter ? item.sucursal.municipio === municipioFilter : true;
            return matchesSearchTerm && matchesEstado && matchesMunicipio;
        });
    }, [listaSucursales, searchTerm, estadoFilter, municipioFilter]);

    if (loading) {
        return <div className="text-center p-10">Cargando datos iniciales...</div>;
    }

    if (sucursalesFiltradas.length === 0) {
        return <div className="text-center text-gray-500 py-4">No se encontraron sucursales con esos filtros.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Estado</th>
                        <th className="py-2 px-4 border-b text-left">Municipio</th>
                        <th className="py-2 px-4 border-b text-left">Domicilio</th>
                        <th className="py-2 px-4 border-b text-center">Ejecutivos</th>
                        <th className="py-2 px-4 border-b text-center">Asesores</th>
                        <th className="py-2 px-4 border-b text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {sucursalesFiltradas.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{item.sucursal.estado}</td>
                            <td className="py-2 px-4 border-b">{item.sucursal.municipio}</td>
                            <td className="py-2 px-4 border-b">{item.sucursal.domicilio}</td>
                            <td className="py-2 px-4 border-b text-center">{item.ejecutivos.length}</td>
                            <td className="py-2 px-4 border-b text-center">{item.asesores.length}</td>
                            <td className="py-2 px-4 border-b">
                                <div className="flex gap-2">
                                    <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-900 font-semibold"><FaEdit /></button>
                                    <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 font-semibold"><FaTrashAlt /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}