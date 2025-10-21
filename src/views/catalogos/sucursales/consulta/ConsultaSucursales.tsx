import React, { useState, useEffect } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../../components/common/ComponentCard";
import SucursalesTable from "../../../../components/tables/BasicTables/SucursalesTable";
import { useAuth } from "../../../../contexts/AuthContext";
import { sucursalesService, SucursalData, Estado, Municipio } from "../../../../services/sucursalesService";
import { useLanguage } from "../../../../context/LanguageContext";

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

interface SucursalStats {
    total: number;
    activas: number;
    porEstado: Record<string, number>;
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
    const [stats, setStats] = useState<SucursalStats>({
        total: 0,
        activas: 0,
        porEstado: {}
    });
    const { t } = useLanguage();

    // Calcular estadísticas cuando cambien las sucursales o filtros
    useEffect(() => {
        const calculateStats = () => {
            const filteredSucursales = sucursales.filter(sucursal => {
                const matchesSearch = !domicilioSearch || 
                    sucursal.s_domicilio?.toLowerCase().includes(domicilioSearch.toLowerCase()) ||
                    sucursal.s_nombre_sucursal?.toLowerCase().includes(domicilioSearch.toLowerCase());
                
                const matchesEstado = !estadoFilter || sucursal.municipio?.estado?.s_estado === estadoFilter;
                const matchesMunicipio = !municipioFilter || sucursal.municipio?.s_municipio === municipioFilter;

                return matchesSearch && matchesEstado && matchesMunicipio;
            });

            const total = filteredSucursales.length;
            const activas = filteredSucursales.filter(s => s.ck_estatus === "ACTIVO").length;
            const porEstado: Record<string, number> = {};

            filteredSucursales.forEach(sucursal => {
                const estado = sucursal.municipio?.estado?.s_estado || 'Sin estado';
                porEstado[estado] = (porEstado[estado] || 0) + 1;
            });

            setStats({ total, activas, porEstado });
        };

        calculateStats();
    }, [sucursales, domicilioSearch, estadoFilter, municipioFilter]);

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
            <PageMeta 
                title="Sistema de Turnos - Catálogo de Sucursales" 
                description="Catálogo de sucursales para el sistema de turnos" 
            />
            <PageBreadcrumb pageTitle={t("branches.branchQuery")} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t("branches.branchCatalog")}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{t("branches.manageAndConsultBranches")}</p>
                </div>
                {user?.tipo_usuario === 1 && (
                    <button
                        onClick={onAddNew}
                        className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] hover:from-[#5E8F7A] hover:to-[#7AB89A] text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md group w-full sm:w-auto dark:from-[#547A6B] dark:to-[#6A9A8B] dark:hover:from-[#456857] dark:hover:to-[#5A8A7B]"
                    >
                        <div className="w-5 h-5 bg-white/20 rounded flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="font-medium">{t("branches.newBranch")}</span>
                    </button>
                )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#70A18E]/10 to-[#8ECAB2]/10 rounded-bl-full"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("branches.totalBranches")}</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.total}</p>
                    <div className="w-8 h-1 bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] rounded-full mt-3"></div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#8ECAB2]/10 to-[#B7F2DA]/10 rounded-bl-full"></div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#8ECAB2] to-[#B7F2DA] rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">{t("branches.active")}</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2 dark:text-white">{stats.activas}</p>
                    <div className="w-8 h-1 bg-gradient-to-r from-[#8ECAB2] to-[#B7F2DA] rounded-full mt-3"></div>
                </div>
            </div>

            {/* Filtros de búsqueda */}
            <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Buscador de Domicilio/Nombre */}
                    <div className="flex-1 min-w-64">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
{t("branches.searchByNameOrAddress")}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t("branches.searchByNameOrAddressPlaceholder")}
                                value={domicilioSearch}
                                onChange={(e) => onDomicilioChange(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
                            />
                            <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">🔍</span>
                        </div>
                    </div>

                    {/* Filtro por Estado */}
                    <div className="min-w-48">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
{t("branches.state")}
                        </label>
                        <select
                            value={estadoFilter}
                            onChange={(e) => {
                                onEstadoChange(e.target.value);
                                onMunicipioChange("");
                            }}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2]"
                        >
                            <option value="">{t("branches.allStates")}</option>
                            {estados.map(estado => 
                                <option key={estado.ck_estado} value={estado.s_estado}>{estado.s_estado}</option>
                            )}
                        </select>
                    </div>

                    {/* Filtro por Municipio */}
                    <div className="min-w-48">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
{t("branches.municipality")}
                        </label>
                        <select
                            value={municipioFilter}
                            onChange={(e) => onMunicipioChange(e.target.value)}
                            disabled={!estadoFilter}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#70A18E]/20 focus:border-[#70A18E] transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-[#8ECAB2]/20 dark:focus:border-[#8ECAB2] dark:disabled:bg-gray-600"
                        >
                            <option value="">{estadoFilter ? t("branches.allMunicipalities") : t("branches.selectState")}</option>
                            {municipiosDisponibles.map((municipio: Municipio) => 
                                <option key={municipio.ck_municipio} value={municipio.s_municipio}>{municipio.s_municipio}</option>
                            )}
                        </select>
                    </div>

                    {/* Botón para Limpiar Filtros */}
                    <div>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 font-medium dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600"
                        >
{t("common.clear")}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sección de la Tabla de Sucursales */}
            <div className="space-y-6">
                <ComponentCard title={t("branches.branchList")}>
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