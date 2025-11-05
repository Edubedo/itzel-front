import React, { useState, useEffect } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../../components/common/ComponentCard";
import { usuariosService, Usuario } from "../../../../services/usuariosService";
import { sucursalesService, SucursalFormData, Estado, Municipio, SucursalData } from "../../../../services/sucursalesService";
import { areasService, Area } from "../../../../services/areasService";
import axios from "axios";
import { FaTimesCircle } from "react-icons/fa";
import Alert from "../../../../components/ui/alert/Alert";
import { getApiBaseUrlWithApi } from "../../../../../utils/util_baseUrl";

// Definición de las props del componente
interface FormularioProps {
    onSave: (datos: SucursalFormData) => void;
    onCancel: () => void;
    branchToEdit?: SucursalData | null;
}

export default function FormularioSucursales({ onSave, onCancel, branchToEdit }: FormularioProps) {
    // Estado para los campos del formulario de la sucursal
    const [formData, setFormData] = useState({
        s_nombre_sucursal: "",
        s_domicilio: "",
        s_telefono: "",
        s_codigo_postal: "",
        ck_municipio: ""
    });

    // Estados para dropdowns
    const [estados, setEstados] = useState<Estado[]>([]);
    const [municipiosDisponibles, setMunicipiosDisponibles] = useState<Municipio[]>([]);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("");

    // Áreas y servicios desde API
    const [areas, setAreas] = useState<Area[]>([]);
    const [serviciosDisponiblesEjecutivo, setServiciosDisponiblesEjecutivo] = useState<Array<{ ck_servicio: string; s_servicio: string }>>([]);

    // Estados para las listas de usuarios y los asignados a la sucursal
    const [listaCompletaEjecutivos, setListaCompletaEjecutivos] = useState<Usuario[]>([]);
    const [listaCompletaAsesores, setListaCompletaAsesores] = useState<Usuario[]>([]);
    const [ejecutivosAsignados, setEjecutivosAsignados] = useState<Array<Usuario & { ck_area?: string; ck_servicio?: string; areaNombre?: string; servicioNombre?: string }>>([]);
    const [asesoresAsignados, setAsesoresAsignados] = useState<Usuario[]>([]);

    // Estado para los valores seleccionados temporalmente antes de agregar
    const [ejecutivoActual, setEjecutivoActual] = useState({ usuarioId: "", ck_area: "", ck_servicio: "" });
    const [asesorActual, setAsesorActual] = useState({ usuarioId: "" });

    // Estado para mostrar el estado de carga
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Estados para mostrar alertas
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Hook para hacer scroll al inicio cuando se muestran alertas
    useEffect(() => {
        if (showSuccess || showError) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [showSuccess, showError]);

    // Hook para cargar datos iniciales
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            try {
                // Cargar usuarios
                const respuestaUsuarios = await usuariosService.getAllUsuarios();
                if (respuestaUsuarios.success && Array.isArray(respuestaUsuarios.data.usuarios)) {
                    const todosLosUsuarios: Usuario[] = respuestaUsuarios.data.usuarios;
                    const ejecutivos = todosLosUsuarios.filter(u => u.i_tipo_usuario == 2);
                    const asesores = todosLosUsuarios.filter(u => u.i_tipo_usuario == 3);
                    setListaCompletaEjecutivos(ejecutivos);
                    setListaCompletaAsesores(asesores);
                }

                // Cargar estados
                const respuestaEstados = await sucursalesService.getEstados();
                if (respuestaEstados.success) {
                    setEstados(respuestaEstados.estados);
                }

                // Cargar áreas activas
                const respuestaAreas = await areasService.getAllAreas({ limit: 100, page: 1, ck_estatus: 'ACTIVO' });
                if (respuestaAreas.success) {
                    setAreas(respuestaAreas.data.areas);
                }

                // Si estamos editando, cargar los datos
                if (branchToEdit) {
                    setFormData({
                        s_nombre_sucursal: branchToEdit.s_nombre_sucursal,
                        s_domicilio: branchToEdit.s_domicilio || "",
                        s_telefono: branchToEdit.s_telefono || "",
                        s_codigo_postal: branchToEdit.s_codigo_postal || "",
                        ck_municipio: branchToEdit.ck_municipio || ""
                    });

                    // Si hay municipio, cargar el estado y municipios
                    if (branchToEdit.municipio) {
                        setEstadoSeleccionado(branchToEdit.municipio.estado?.s_estado || "");
                        // Cargar municipios del estado
                        if (branchToEdit.municipio.estado?.ck_estado) {
                            const respuestaMunicipios = await sucursalesService.getMunicipiosByEstado(branchToEdit.municipio.estado.ck_estado);
                            if (respuestaMunicipios.success) {
                                setMunicipiosDisponibles(respuestaMunicipios.municipios);
                            }
                        }
                    }
                }

            } catch (error) {
                console.error("Error al cargar datos:", error);
                setErrorMessage("No se pudieron cargar los datos iniciales.");
                setShowError(true);
            } finally {
                setLoading(false);
            }
        };

        cargarDatosIniciales();
    }, [branchToEdit]);

    // Cargar municipios cuando cambie el estado
    useEffect(() => {
        if (estadoSeleccionado && estados.length > 0) {
            const estado = estados.find(e => e.s_estado === estadoSeleccionado);
            if (estado) {
                loadMunicipios(estado.ck_estado);
            }
        } else {
            setMunicipiosDisponibles([]);
            setFormData(prev => ({ ...prev, ck_municipio: "" }));
        }
    }, [estadoSeleccionado, estados]);

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

    // Cargar servicios cuando cambie el área en la selección temporal
    useEffect(() => {
        const fetchServicios = async () => {
            if (!ejecutivoActual.ck_area) {
                setServiciosDisponiblesEjecutivo([]);
                setEjecutivoActual(prev => ({ ...prev, ck_servicio: "" }));
                return;
            }
            try {
                const baseURL = import.meta.env.VITE_API_URL || getApiBaseUrlWithApi();
                const resp = await axios.get(`${baseURL}/operaciones/turnos/servicios/${ejecutivoActual.ck_area}`);
                if (resp.data?.success) {
                    setServiciosDisponiblesEjecutivo(resp.data.servicios.map((s: any) => ({ ck_servicio: s.ck_servicio, s_servicio: s.s_servicio })));
                } else {
                    setServiciosDisponiblesEjecutivo([]);
                }
            } catch (e) {
                console.error('Error al cargar servicios:', e);
                setServiciosDisponiblesEjecutivo([]);
            }
        };
        fetchServicios();
    }, [ejecutivoActual.ck_area]);

    // Maneja los cambios en los campos del formulario de la sucursal
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Maneja el cambio de estado
    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEstadoSeleccionado(e.target.value);
    };

    // Maneja los cambios en los selects de asignación de ejecutivos
    const handleEjecutivoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'usuario') {
            setEjecutivoActual(prev => ({ ...prev, usuarioId: value }));
        } else if (name === 'area') {
            setEjecutivoActual(prev => ({ ...prev, ck_area: value, ck_servicio: "" }));
        } else if (name === 'servicio') {
            setEjecutivoActual(prev => ({ ...prev, ck_servicio: value }));
        }
    };

    // Maneja los cambios en los selects de asignación de asesores
    const handleAsesorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'usuario') {
            setAsesorActual(prev => ({ ...prev, usuarioId: value }));
        }
    };

    // Agrega un ejecutivo a la lista de asignados
    const agregarEjecutivo = () => {
        if (ejecutivoActual.usuarioId && ejecutivoActual.ck_area && ejecutivoActual.ck_servicio) {
            const ejecutivoParaAgregar = listaCompletaEjecutivos.find(e => e.ck_usuario === ejecutivoActual.usuarioId);
            const areaSeleccionada = areas.find(a => a.ck_area === ejecutivoActual.ck_area);
            const servicioSeleccionado = serviciosDisponiblesEjecutivo.find(s => s.ck_servicio === ejecutivoActual.ck_servicio);
            if (ejecutivoParaAgregar && areaSeleccionada && servicioSeleccionado) {
                const nuevoEjecutivo = {
                    ...ejecutivoParaAgregar,
                    ck_area: ejecutivoActual.ck_area,
                    ck_servicio: ejecutivoActual.ck_servicio,
                    areaNombre: areaSeleccionada.s_area,
                    servicioNombre: servicioSeleccionado.s_servicio
                };
                setEjecutivosAsignados(prev => [...prev, nuevoEjecutivo]);
                setEjecutivoActual({ usuarioId: "", ck_area: "", ck_servicio: "" });
                setServiciosDisponiblesEjecutivo([]);
            }
        }
    };

    // Agrega un asesor a la lista de asignados
    const agregarAsesor = () => {
        if (asesorActual.usuarioId) {
            const asesorParaAgregar = listaCompletaAsesores.find(a => a.ck_usuario === asesorActual.usuarioId);
            if (asesorParaAgregar) {
                setAsesoresAsignados([...asesoresAsignados, asesorParaAgregar]);
                setAsesorActual({ usuarioId: "" });
            }
        }
    };

    // Elimina un ejecutivo de la lista de asignados
    const eliminarEjecutivo = (id: string) => {
        setEjecutivosAsignados(ejecutivosAsignados.filter(ejec => ejec.ck_usuario !== id));
    };

    // Elimina un asesor de la lista de asignados
    const eliminarAsesor = (id: string) => {
        setAsesoresAsignados(asesoresAsignados.filter(asesor => asesor.ck_usuario !== id));
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        // Valida los campos obligatorios
        if (!formData.s_nombre_sucursal || !formData.ck_municipio || !formData.s_domicilio) {
            setErrorMessage("Por favor, complete todos los campos obligatorios.");
            setShowError(true);
            setSaving(false);
            return;
        }

        // Construye el objeto de datos para enviar a la API
        const datosParaEnviar: SucursalFormData = {
            s_nombre_sucursal: formData.s_nombre_sucursal,
            s_domicilio: formData.s_domicilio,
            ck_municipio: formData.ck_municipio,
            s_telefono: formData.s_telefono,
            s_codigo_postal: formData.s_codigo_postal,
            ejecutivos: ejecutivosAsignados.map(e => ({
                ck_usuario: e.ck_usuario,
                ck_area: e.ck_area,
                ck_servicio: e.ck_servicio
            })),
            asesores: asesoresAsignados.map(a => ({ ck_usuario: a.ck_usuario }))
        };

        try {
            console.log('=== ENVIANDO DATOS AL PADRE ===');
            console.log('Datos a enviar:', datosParaEnviar);
            // Llamar al callback del padre que se encarga de guardar
            await onSave(datosParaEnviar);
            console.log('Guardado exitoso en el formulario');
            setShowSuccess(true);
            // Esperar un momento para que el usuario vea el mensaje de éxito
            // El padre cerrará el formulario automáticamente
        } catch (error: any) {
            console.error('Error en el formulario:', error);
            console.error('Error completo:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText
            });
            console.error('Error response data:', error.response?.data);
            console.error('Error response status:', error.response?.status);
            console.error('Error response statusText:', error.response?.statusText);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            setErrorMessage("Error al guardar la sucursal: " + (error.response?.data?.message || error.message));
            setShowError(true);
        } finally {
            setSaving(false);
        }
    };

    // Filtra los ejecutivos disponibles para evitar duplicados en la lista de asignación
    const ejecutivosDisponibles = listaCompletaEjecutivos.filter(
        (ejec) => !ejecutivosAsignados.some(asignado => asignado.ck_usuario === ejec.ck_usuario)
    );

    // Filtra los asesores disponibles para evitar duplicados en la lista de asignación
    const asesoresDisponibles = listaCompletaAsesores.filter(
        (asesor) => !asesoresAsignados.some(asignado => asignado.ck_usuario === asesor.ck_usuario)
    );

    // Muestra un indicador de carga mientras se obtienen los datos
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando datos...</span>
            </div>
        );
    }

    // Renderiza el formulario principal
    return (
        <>
            <PageMeta
                title="Sistema de Turnos - Registrar Sucursal"
                description="Formulario para la creación de nuevas sucursales y asignación de personal"
            />
            <PageBreadcrumb pageTitle={branchToEdit ? "Editar Sucursal" : "Registrar Nueva Sucursal"} />

            {/* Alertas */}
            {showSuccess && (
                <div className="mb-6">
                    <Alert
                        variant="success"
                        title="¡Éxito!"
                        message={branchToEdit ? "Sucursal actualizada exitosamente!" : "Sucursal guardada exitosamente!"}
                    />
                </div>
            )}

            {showError && (
                <div className="mb-6">
                    <Alert
                        variant="error"
                        title="Error"
                        message={errorMessage}
                    />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <ComponentCard title="Datos de la Sucursal">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="s_nombre_sucursal" className="block text-sm font-medium text-gray-700">
                                Nombre de la Sucursal <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="s_nombre_sucursal"
                                name="s_nombre_sucursal"
                                value={formData.s_nombre_sucursal}
                                onChange={handleFormChange}
                                required
                                placeholder="Ej: Sucursal Centro"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label htmlFor="s_telefono" className="block text-sm font-medium text-gray-700">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                id="s_telefono"
                                name="s_telefono"
                                value={formData.s_telefono}
                                onChange={handleFormChange}
                                placeholder="Ej: 312-123-4567"
                                maxLength={20}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                            <p className="mt-1 text-xs text-gray-500">Máximo 20 caracteres</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                                Estado <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="estado"
                                name="estado"
                                value={estadoSeleccionado}
                                onChange={handleEstadoChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            >
                                <option value="">Seleccionar Estado</option>
                                {estados.map(estado => (
                                    <option key={estado.ck_estado} value={estado.s_estado}>{estado.s_estado}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="ck_municipio" className="block text-sm font-medium text-gray-700">
                                Municipio <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="ck_municipio"
                                name="ck_municipio"
                                value={formData.ck_municipio}
                                onChange={handleFormChange}
                                required
                                disabled={!estadoSeleccionado}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border disabled:bg-gray-100"
                            >
                                <option value="">{estadoSeleccionado ? 'Seleccionar Municipio' : 'Primero elige un estado'}</option>
                                {municipiosDisponibles.map(municipio => (
                                    <option key={municipio.ck_municipio} value={municipio.ck_municipio}>{municipio.s_municipio}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="s_domicilio" className="block text-sm font-medium text-gray-700">
                                Domicilio <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="s_domicilio"
                                name="s_domicilio"
                                value={formData.s_domicilio}
                                onChange={handleFormChange}
                                required
                                placeholder="Calle, número, colonia"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label htmlFor="s_codigo_postal" className="block text-sm font-medium text-gray-700">
                                Código Postal
                            </label>
                            <input
                                type="text"
                                id="s_codigo_postal"
                                name="s_codigo_postal"
                                value={formData.s_codigo_postal}
                                onChange={handleFormChange}
                                placeholder="Ej: 28000"
                                maxLength={5}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                </ComponentCard>

                <ComponentCard title="Asignar Ejecutivos a Sucursal">
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700">Usuario</label>
                            <select
                                name="usuario"
                                value={ejecutivoActual.usuarioId}
                                onChange={handleEjecutivoChange}
                                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            >
                                <option value="">Seleccionar Ejecutivo</option>
                                {ejecutivosDisponibles.map(ejec => (
                                    <option key={ejec.ck_usuario} value={ejec.ck_usuario}>
                                        {`${ejec.s_nombre} ${ejec.s_apellido_paterno || ''}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700">Área</label>
                            <select
                                name="area"
                                value={ejecutivoActual.ck_area}
                                onChange={handleEjecutivoChange}
                                disabled={!ejecutivoActual.usuarioId}
                                className="w-full border border-gray-300 rounded-lg p-2 mt-1 disabled:bg-gray-100"
                            >
                                <option value="">{ejecutivoActual.usuarioId ? "Seleccionar Área" : "Seleccione primero un Usuario"}</option>
                                {ejecutivoActual.usuarioId && areas.map(area => (
                                    <option key={area.ck_area} value={area.ck_area}>{area.s_area}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700">Servicio</label>
                            <select
                                name="servicio"
                                value={ejecutivoActual.ck_servicio}
                                onChange={handleEjecutivoChange}
                                disabled={!ejecutivoActual.ck_area || serviciosDisponiblesEjecutivo.length === 0}
                                className="w-full border border-gray-300 rounded-lg p-2 mt-1 disabled:bg-gray-100"
                            >
                                <option value="">
                                    {ejecutivoActual.ck_area ? "Seleccionar Servicio" : "Primero elija un área"}
                                </option>
                                {serviciosDisponiblesEjecutivo.map(servicio => (
                                    <option key={servicio.ck_servicio} value={servicio.ck_servicio}>{servicio.s_servicio}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={agregarEjecutivo}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 text-xl font-bold flex-shrink-0"
                        >
                            +
                        </button>
                    </div>

                    {/* Lista de ejecutivos agregados */}
                    {ejecutivosAsignados.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-semibold text-gray-600">Ejecutivos Asignados:</h4>
                            {ejecutivosAsignados.map(ejec => (
                                <div key={ejec.ck_usuario} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">{`${ejec.s_nombre} ${ejec.s_apellido_paterno || ''}`}</p>
                                        <p className="text-xs text-gray-500">{`Área: ${ejec.areaNombre || ''} / Servicio: ${ejec.servicioNombre || ''}`}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => eliminarEjecutivo(ejec.ck_usuario)}
                                        className="text-red-500 hover:text-red-700 font-bold text-xl"
                                    >
                                        <FaTimesCircle />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </ComponentCard>

                <ComponentCard title="Asignar Asesores a Sucursal">
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700">Usuario</label>
                            <select
                                name="usuario"
                                value={asesorActual.usuarioId}
                                onChange={handleAsesorChange}
                                className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            >
                                <option value="">Seleccionar Asesor</option>
                                {asesoresDisponibles.map(asesor => (
                                    <option key={asesor.ck_usuario} value={asesor.ck_usuario}>
                                        {`${asesor.s_nombre} ${asesor.s_apellido_paterno || ''}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={agregarAsesor}
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 text-xl font-bold flex-shrink-0"
                        >
                            +
                        </button>
                    </div>

                    {/* Lista de asesores agregados */}
                    {asesoresAsignados.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-semibold text-gray-600">Asesores Asignados:</h4>
                            {asesoresAsignados.map(asesor => (
                                <div key={asesor.ck_usuario} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">{`${asesor.s_nombre} ${asesor.s_apellido_paterno || ''}`}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => eliminarAsesor(asesor.ck_usuario)}
                                        className="text-red-500 hover:text-red-700 font-bold text-xl"
                                    >
                                        <FaTimesCircle />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </ComponentCard>

                {/* Botones de acción del formulario */}
                <div className="flex justify-end pt-4 gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold disabled:opacity-50 flex items-center"
                    >
                        {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                        {saving ? 'Guardando...' : (branchToEdit ? 'Actualizar Sucursal' : 'Guardar Sucursal')}
                    </button>
                </div>
            </form>
        </>
    );
}