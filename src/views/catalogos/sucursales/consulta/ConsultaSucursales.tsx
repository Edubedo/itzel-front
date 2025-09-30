import React, { useState, useEffect, useMemo } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../../components/common/ComponentCard";
import SucursalesTable from "../../../../components/tables/BasicTables/SucursalesTable";
import { useAuth } from "../../../../contexts/AuthContext";
import { sucursalesService, SucursalData, Estado, Municipio } from "../../../../services/sucursalesService";

interface ConsultaSucursalesProps {
    sucursales: SucursalData[];
    onAddNew: () => void;
    onEdit: (sucursal: SucursalData) => void;
    onDelete: (id: string) => void;
    estadoFilter: string;
    municipioFilter: string;
    domicilioSearch: string;
    onEstadoChange: (estado: string) => void;
    onMunicipioChange: (municipio: string) => void;
    onDomicilioChange: (domicilio: string) => void;
}

export default function ConsultaSucursales({
    sucursales,
    onAddNew,
    onEdit,
    onDelete,
    estadoFilter,
    municipioFilter,
    domicilioSearch,
    onEstadoChange,
    onMunicipioChange,
    onDomicilioChange
}: ConsultaSucursalesProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [municipiosDisponibles, setMunicipiosDisponibles] = useState<Municipio[]>([]);

    // Cargar estados al montar el componente
    useEffect(() => {
        loadEstados();
    }, []);

    // Cargar municipios cuando cambie el estado seleccionado
    useEffect(() => {
        if (estadoFilter) {
            const estadoSeleccionado = estados.find(e => e.s_estado === estadoFilter);
            if (estadoSeleccionado) {
                loadMunicipios(estadoSeleccionado.ck_estado);
            }
        } else {
            setMunicipiosDisponibles([]);
        }
    }, [estadoFilter, estados]);

    const loadEstados = async () => {
        try {
            const response = await sucursalesService.getEstados();
            if (response.success) {
                setEstados(response.estados);
            }
        } catch (error) {
            console.error('Error al cargar estados:', error);
        }
    };

    const loadMunicipios = async (estadoId: string) => {
        try {
            const response = await sucursalesService.getMunicipiosByEstado(estadoId);
            if (response.success) {
                setMunicipiosDisponibles(response.municipios);
            }
        } catch (error) {
            console.error('Error al cargar municipios:', error);
        }
    };

    // Limpia los filtros de búsqueda
    const clearFilters = () => {
        onDomicilioChange("");
        onEstadoChange("");
        onMunicipioChange("");
    };

    return (
        <>
            <PageMeta title="Gestión de Sucursales" description="Consulta y gestión de sucursales" />
            <PageBreadcrumb pageTitle="Consulta de Sucursales" />

            {/* Botón de añadir (solo para administradores) */}
            {user?.tipo_usuario === 1 && (
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={onAddNew}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                    >
                        <span className="mr-2">+</span>
                        Añadir Sucursal
                    </button>
                </div>
            )}

            {/* Sección de Filtros de Búsqueda */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Buscador de Domicilio/Nombre */}
                    <div className="flex-1 min-w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar por Nombre o Domicilio
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o domicilio..."
                                value={domicilioSearch}
                                onChange={(e) => onDomicilioChange(e.target.value)}
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
                            value={estadoFilter}
                            onChange={(e) => {
                                onEstadoChange(e.target.value);
                                onMunicipioChange("");
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los estados</option>
                            {estados.map(estado => 
                                <option key={estado.ck_estado} value={estado.s_estado}>{estado.s_estado}</option>
                            )}
                        </select>
                    </div>

                    {/* Filtro por Municipio */}
                    <div className="min-w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Municipio
                        </label>
                        <select
                            value={municipioFilter}
                            onChange={(e) => onMunicipioChange(e.target.value)}
                            disabled={!estadoFilter}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        >
                            <option value="">{estadoFilter ? "Todos los municipios" : "Seleccione un estado"}</option>
                            {municipiosDisponibles.map((municipio: Municipio) => 
                                <option key={municipio.ck_municipio} value={municipio.s_municipio}>{municipio.s_municipio}</option>
                            )}
                        </select>
                    </div>

                    {/* Botón para Limpiar Filtros */}
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

            {/* Sección de la Tabla de Sucursales */}
            <div className="space-y-6">
                <ComponentCard title="Lista de Sucursales">
                    <SucursalesTable
                        listaSucursales={sucursales}
                        searchTerm={domicilioSearch}
                        estadoFilter={estadoFilter}
                        municipioFilter={municipioFilter}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        loading={loading}
                    />
                </ComponentCard>
            </div>
        </>
    );
}