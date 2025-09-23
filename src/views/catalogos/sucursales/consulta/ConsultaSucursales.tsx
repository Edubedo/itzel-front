import React, { useState, useEffect, useMemo } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../../components/common/ComponentCard";
import { usuariosService, Usuario } from "../../../../services/usuariosService";
import SucursalesTable from "../../../../components/tables/BasicTables/SucursalesTable";
import { useAuth } from "../../../../contexts/AuthContext";

// Datos estáticos para el formulario
const datosMexico = []
 const estadosDeMexico = Object.keys(datosMexico);
const areasDisponibles = [];

export default function ConsultaDeSucursales() {
    const serviciosPorArea = { "Contabilidad": ["Pagos y convenios", "Facturación"], "Administracion": ["Administración"], "Recursos humanos": ["Capacitación"], "General": ["Reporte de Servicios"], "Contratación": ["Contratación"], "Centro de Atención a Usuarios": ["Reporte"], "Servicio": ["Cortes y Reconexiones"] };
    // Estado para la lista de sucursales, cargada desde localStorage al inicio
    const [listaSucursales, setListaSucursales] = useState<any[]>(() => {
        try {
            const sucursalesGuardadas = localStorage.getItem('sucursales');
            return sucursalesGuardadas ? JSON.parse(sucursalesGuardadas) : [];
        } catch (error) {
            console.error("Error al leer sucursales de localStorage", error);
            return [];
        }
    });

    // Estados para la interfaz de usuario y la gestión del formulario
    const [mostrandoFormulario, setMostrandoFormulario] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sucursalEnEdicion, setSucursalEnEdicion] = useState<any | null>(null);

    // Estados para los datos del formulario de registro/edición
    const [formData, setFormData] = useState({ estado: "", municipio: "", domicilio: "" });
    const [municipiosDisponibles, setMunicipiosDisponibles] = useState<string[]>([]);
    const [listaCompletaEjecutivos, setListaCompletaEjecutivos] = useState<Usuario[]>([]);
    const [listaCompletaAsesores, setListaCompletaAsesores] = useState<Usuario[]>([]);
    const [ejecutivosAsignados, setEjecutivosAsignados] = useState<Usuario[]>([]);
    const [asesoresAsignados, setAsesoresAsignados] = useState<Usuario[]>([]);
    const [ejecutivoActual, setEjecutivoActual] = useState({ usuarioId: "", area: "", servicio: "" });
    const [asesorActual, setAsesorActual] = useState({ usuarioId: "", area: "", servicio: "" });
    const [serviciosDisponiblesEjecutivo, setServiciosDisponiblesEjecutivo] = useState<string[]>([]);
    const [serviciosDisponiblesAsesor, setServiciosDisponiblesAsesor] = useState<string[]>([]);

    // Estados para los filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");
    const [municipioFilter, setMunicipioFilter] = useState("");

    const { user } = useAuth();

    // Sincroniza el estado de las sucursales con el localStorage
  

    // Restablece los estados del formulario a sus valores iniciales
    const resetFormState = () => {
        setFormData({ estado: "", municipio: "", domicilio: "" });
        setMunicipiosDisponibles([]);
        setEjecutivosAsignados([]);
        setAsesoresAsignados([]);
        setEjecutivoActual({ usuarioId: "", area: "", servicio: "" });
        setAsesorActual({ usuarioId: "", area: "", servicio: "" });
        setServiciosDisponiblesEjecutivo([]);
        setServiciosDisponiblesAsesor([]);
        setSucursalEnEdicion(null);
    };

    // Maneja los cambios en los inputs del formulario de la sucursal
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === "estado") {
            setMunicipiosDisponibles(value ? datosMexico[value as keyof typeof datosMexico] : []);
            setFormData(prev => ({ ...prev, estado: value, municipio: "" }));
        } else { setFormData(prev => ({ ...prev, [name]: value })); }
    };

    // Maneja los cambios en los inputs para la asignación de ejecutivos
    const handleEjecutivoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name === 'usuario' ? 'usuarioId' : name;
        if (fieldName === 'area') {
            const servicios = value ? serviciosPorArea[value as keyof typeof serviciosPorArea] : [];
            setServiciosDisponiblesEjecutivo(servicios);
            setEjecutivoActual(prev => ({ ...prev, area: value, servicio: "" }));
        } else { setEjecutivoActual(prev => ({ ...prev, [fieldName]: value })); }
    };

    // Maneja los cambios en los inputs para la asignación de asesores
    const handleAsesorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name === 'usuario' ? 'usuarioId' : name;
        if (fieldName === 'area') {
            const servicios = value ? serviciosPorArea[value as keyof typeof serviciosPorArea] : [];
            setServiciosDisponiblesAsesor(servicios);
            setAsesorActual(prev => ({ ...prev, area: value, servicio: "" }));
        } else { setAsesorActual(prev => ({ ...prev, [fieldName]: value })); }
    };

    // Agrega un ejecutivo al estado de asignados
    const agregarEjecutivo = () => {
        if (ejecutivoActual.usuarioId && ejecutivoActual.area && ejecutivoActual.servicio) {
            const ejecutivoParaAgregar = listaCompletaEjecutivos.find(e => e.ck_usuario === ejecutivoActual.usuarioId);
            if (ejecutivoParaAgregar) {
                const nuevoEjecutivo = { ...ejecutivoParaAgregar, area: ejecutivoActual.area, servicio: ejecutivoActual.servicio };
                setEjecutivosAsignados([...ejecutivosAsignados, nuevoEjecutivo]);
                setEjecutivoActual({ usuarioId: "", area: "", servicio: "" });
                setServiciosDisponiblesEjecutivo([]);
            }
        }
    };

    // Agrega un asesor al estado de asignados
    const agregarAsesor = () => {
        if (asesorActual.usuarioId && asesorActual.area && asesorActual.servicio) {
            const asesorParaAgregar = listaCompletaAsesores.find(a => a.ck_usuario === asesorActual.usuarioId);
            if (asesorParaAgregar) {
                const nuevoAsesor = { ...asesorParaAgregar, area: asesorActual.area, servicio: asesorActual.servicio };
                setAsesoresAsignados([...asesoresAsignados, nuevoAsesor]);
                setAsesorActual({ usuarioId: "", area: "", servicio: "" });
                setServiciosDisponiblesAsesor([]);
            }
        }
    };

    // Elimina un ejecutivo de la lista de asignados
    const eliminarEjecutivo = (id: string) => { setEjecutivosAsignados(prev => prev.filter(ejec => ejec.ck_usuario !== id)); };

    // Elimina un asesor de la lista de asignados
    const eliminarAsesor = (id: string) => { setAsesoresAsignados(prev => prev.filter(asesor => asesor.ck_usuario !== id)); };

    // Maneja el envío del formulario, actualizando o agregando una sucursal
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.estado || !formData.municipio || !formData.domicilio) {
            alert("Por favor, complete todos los datos de la sucursal.");
            return;
        }

        if (sucursalEnEdicion) {
            const sucursalActualizada = {
                ...sucursalEnEdicion,
                sucursal: formData,
                ejecutivos: ejecutivosAsignados.map(e => ({ ck_usuario: e.ck_usuario, area: e.area, servicio: e.servicio })),
                asesores: asesoresAsignados.map(a => ({ ck_usuario: a.ck_usuario, area: a.area, servicio: a.servicio })),
            };
            setListaSucursales(listaSucursales.map(s => s.id === sucursalEnEdicion.id ? sucursalActualizada : s));
        } else {
            const datosFinales = {
                id: Date.now(),
                sucursal: formData,
                ejecutivos: ejecutivosAsignados.map(e => ({ ck_usuario: e.ck_usuario, area: e.area, servicio: e.servicio })),
                asesores: asesoresAsignados.map(a => ({ ck_usuario: a.ck_usuario, area: a.area, servicio: a.servicio })),
            };
            setListaSucursales(prev => [...prev, datosFinales]);
        }

        setMostrandoFormulario(false);
        resetFormState();
    };

    // Maneja la cancelación del formulario
    const handleCancel = () => {
        setMostrandoFormulario(false);
        resetFormState();
    };

    // Prepara los datos del formulario para editar una sucursal existente
    const handleEditar = (sucursal: any) => {
        setSucursalEnEdicion(sucursal);
        setFormData(sucursal.sucursal);

        const ejecutivosCompletos = sucursal.ejecutivos.map((ejec: any) => {
            const ejecutivoData = listaCompletaEjecutivos.find(e => e.ck_usuario === ejec.ck_usuario);
            return { ...(ejecutivoData || {}), ...ejec };
        });
        const asesoresCompletos = sucursal.asesores.map((asesor: any) => {
            const asesorData = listaCompletaAsesores.find(a => a.ck_usuario === asesor.ck_usuario);
            return { ...(asesorData || {}), ...asesor };
        });

        setEjecutivosAsignados(ejecutivosCompletos);
        setAsesoresAsignados(asesoresCompletos);
        setMunicipiosDisponibles(datosMexico[sucursal.sucursal.estado as keyof typeof datosMexico] || []);
        setMostrandoFormulario(true);
    };

    // Maneja la eliminación de una sucursal
    const handleEliminar = (id: number) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta sucursal?")) {
            setListaSucursales(listaSucursales.filter(s => s.id !== id));
        }
    };

    // Limpia los filtros de búsqueda
    const clearFilters = () => {
        setSearchTerm("");
        setEstadoFilter("");
        setMunicipioFilter("");
    };

    // Filtra los ejecutivos y asesores disponibles para asignación (no asignados ya)
    const ejecutivosDisponibles = listaCompletaEjecutivos.filter(ejec => !ejecutivosAsignados.some(asig => asig.ck_usuario === ejec.ck_usuario));
    const asesoresDisponibles = listaCompletaAsesores.filter(asesor => !asesoresAsignados.some(asig => asig.ck_usuario === asesor.ck_usuario));

    // Usa useMemo para optimizar el filtrado de municipios
    const municipiosParaFiltro = useMemo(() => {
        if (estadoFilter) {
            return datosMexico[estadoFilter as keyof typeof datosMexico] || [];
        }
        return [];
    }, [estadoFilter]);

    return (
        <>
            <PageMeta title="Gestión de Sucursales" description="Consulta y registro de sucursales" />
            <PageBreadcrumb pageTitle={mostrandoFormulario ? (sucursalEnEdicion ? 'Editar Sucursal' : 'Registrar Nueva Sucursal') : "Consulta de Sucursales"} />

            {/* Botón de añadir (solo para administradores) */}
            {user?.i_tipo_usuario === 1 && (
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => { setMostrandoFormulario(true); resetFormState(); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                    >
                        <span className="mr-2">+</span>
                        Añadir Sucursal
                    </button>
                </div>
            )}

            {/* Formulario de registro/edición o sección de consulta */}
            {mostrandoFormulario ? (
                // Formulario de registro/edición de sucursal
                <form onSubmit={handleSubmit} className="space-y-6">
                    <ComponentCard title="Datos de la Sucursal">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                                <select id="estado" name="estado" value={formData.estado} onChange={handleFormChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border">
                                    <option value="">Seleccionar Estado</option>
                                    {estadosDeMexico.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="municipio" className="block text-sm font-medium text-gray-700">Municipio</label>
                                <select id="municipio" name="municipio" value={formData.municipio} onChange={handleFormChange} required disabled={!formData.estado} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border disabled:bg-gray-100">
                                    <option value="">{formData.estado ? 'Seleccionar Municipio' : 'Primero elige un estado'}</option>
                                    {municipiosDisponibles.map(municipio => <option key={municipio} value={municipio}>{municipio}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="domicilio" className="block text-sm font-medium text-gray-700">Domicilio</label>
                            <input type="text" id="domicilio" name="domicilio" value={formData.domicilio} onChange={handleFormChange} required placeholder="Calle, número, colonia, código postal" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" />
                        </div>
                    </ComponentCard>
                    <ComponentCard title="Asignar Ejecutivo a Sucursal">
                        <div className="flex items-end gap-4">
                            <div className="flex-1"><label className="text-sm">Usuario</label><select name="usuario" value={ejecutivoActual.usuarioId} onChange={handleEjecutivoChange} className="w-full border border-gray-300 rounded-lg p-2"><option value="">Seleccionar Ejecutivo</option>{ejecutivosDisponibles.map(ejec => <option key={ejec.ck_usuario} value={ejec.ck_usuario}>{`${ejec.s_nombre} ${ejec.s_apellido_paterno || ''}`}</option>)}</select></div>
                            <div className="flex-1"><label className="text-sm">Área</label><select name="area" value={ejecutivoActual.area} onChange={handleEjecutivoChange} className="w-full border border-gray-300 rounded-lg p-2"><option value="">Seleccionar Área</option>{areasDisponibles.map(area => <option key={area} value={area}>{area}</option>)}</select></div>
                            <div className="flex-1"><label className="text-sm">Servicio</label><select name="servicio" value={ejecutivoActual.servicio} onChange={handleEjecutivoChange} className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" disabled={!ejecutivoActual.area || serviciosDisponiblesEjecutivo.length === 0}><option value="">{ejecutivoActual.area ? "Seleccionar Servicio" : "Primero elija un área"}</option>{serviciosDisponiblesEjecutivo.map(servicio => <option key={servicio} value={servicio}>{servicio}</option>)}</select></div>
                            <button type="button" onClick={agregarEjecutivo} className="bg-blue-500 text-white rounded-full w-10 h-10 text-xl font-bold flex-shrink-0">+</button>
                        </div>
                        <div className="mt-4 space-y-2">{ejecutivosAsignados.length > 0 && <h4 className="text-sm font-semibold text-gray-600">Ejecutivos Asignados:</h4>}{ejecutivosAsignados.map(ejec => (<div key={ejec.ck_usuario} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"><div><p className="font-medium text-gray-800">{`${ejec.s_nombre} ${ejec.s_apellido_paterno || ''}`}</p><p className="text-xs text-gray-500">{`Área: ${ejec.area} / Servicio: ${ejec.servicio}`}</p></div><button type="button" onClick={() => eliminarEjecutivo(ejec.ck_usuario)} className="text-red-500 hover:text-red-700 font-semibold text-xl">&times;</button></div>))}</div>
                    </ComponentCard>
                    <ComponentCard title="Asignar Asesor a Sucursal">
                        <div className="flex items-end gap-4">
                            <div className="flex-1"><label className="text-sm">Usuario</label><select name="usuario" value={asesorActual.usuarioId} onChange={handleAsesorChange} className="w-full border border-gray-300 rounded-lg p-2"><option value="">Seleccionar Asesor</option>{asesoresDisponibles.map(asesor => <option key={asesor.ck_usuario} value={asesor.ck_usuario}>{`${asesor.s_nombre} ${asesor.s_apellido_paterno || ''}`}</option>)}</select></div>
                            <div className="flex-1"><label className="text-sm">Área</label><select name="area" value={asesorActual.area} onChange={handleAsesorChange} className="w-full border border-gray-300 rounded-lg p-2"><option value="">Seleccionar Área</option>{areasDisponibles.map(area => <option key={area} value={area}>{area}</option>)}</select></div>
                            <div className="flex-1"><label className="text-sm">Servicio</label><select name="servicio" value={asesorActual.servicio} onChange={handleAsesorChange} className="w-full border border-gray-300 rounded-lg p-2 disabled:bg-gray-100" disabled={!asesorActual.area || serviciosDisponiblesAsesor.length === 0}><option value="">{asesorActual.area ? "Seleccionar Servicio" : "Primero elija un área"}</option>{serviciosDisponiblesAsesor.map(servicio => <option key={servicio} value={servicio}>{servicio}</option>)}</select></div>
                            <button type="button" onClick={agregarAsesor} className="bg-blue-500 text-white rounded-full w-10 h-10 text-xl font-bold flex-shrink-0">+</button>
                        </div>
                        <div className="mt-4 space-y-2">{asesoresAsignados.length > 0 && <h4 className="text-sm font-semibold text-gray-600">Asesores Asignados:</h4>}{asesoresAsignados.map(asesor => (<div key={asesor.ck_usuario} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"><div><p className="font-medium text-gray-800">{`${asesor.s_nombre} ${asesor.s_apellido_paterno || ''}`}</p><p className="text-xs text-gray-500">{`Área: ${asesor.area} / Servicio: ${asesor.servicio}`}</p></div><button type="button" onClick={() => eliminarAsesor(asesor.ck_usuario)} className="text-red-500 hover:text-red-700 font-semibold text-xl">&times;</button></div>))}</div>
                    </ComponentCard>
                    <div className="flex justify-end pt-4 gap-4">
                        <button type="button" onClick={handleCancel} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">Cancelar</button>
                        <button type="submit" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold">
                            {sucursalEnEdicion ? 'Actualizar Sucursal' : 'Guardar Sucursal'}
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    {/* Botón de añadir (visible en la vista de la tabla) */}
                    <div className="mb-6 flex justify-end">
                        <button
                            onClick={() => { setMostrandoFormulario(true); resetFormState(); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                        >
                            <span className="mr-2">+</span>
                            Añadir Sucursal
                        </button>
                    </div>
                    
                    {/* Sección de Filtros de Búsqueda */}
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="flex flex-wrap gap-4 items-end">
                            {/* Buscador de Domicilio */}
                            <div className="flex-1 min-w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar por Domicilio
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por domicilio..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                        setEstadoFilter(e.target.value);
                                        setMunicipioFilter("");
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Todos los estados</option>
                                    {estadosDeMexico.map(estado => <option key={estado} value={estado}>{estado}</option>)}
                                </select>
                            </div>

                            {/* Filtro por Municipio */}
                            <div className="min-w-48">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Municipio
                                </label>
                                <select
                                    value={municipioFilter}
                                    onChange={(e) => setMunicipioFilter(e.target.value)}
                                    disabled={!estadoFilter}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="">{estadoFilter ? "Todos los municipios" : "Seleccione un estado"}</option>
                                    {municipiosParaFiltro.map(municipio => <option key={municipio} value={municipio}>{municipio}</option>)}
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
                                listaSucursales={listaSucursales}
                                searchTerm={searchTerm}
                                estadoFilter={estadoFilter}
                                municipioFilter={municipioFilter}
                                onEdit={handleEditar}
                                onDelete={handleEliminar}
                                loading={loading}
                            />
                        </ComponentCard>
                    </div>
                </>
            )}
        </>
    );
}