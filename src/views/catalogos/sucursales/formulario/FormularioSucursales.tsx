import React, { useState, useEffect } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../../components/common/ComponentCard";
import { usuariosService, Usuario } from "../../../../services/usuariosService";
import { FaTimesCircle } from "react-icons/fa";
 
// Datos geográficos de México
const datosMexico = {
    "Aguascalientes": ["Aguascalientes", "Jesús María", "Calvillo"],
    "Baja California": ["Mexicali", "Tijuana", "Ensenada"],
    "Baja California Sur": ["La Paz", "Los Cabos"],
    "Campeche": ["Campeche", "Carmen"],
    "Chiapas": ["Tuxtla Gutiérrez", "San Cristóbal de las Casas"],
    "Chihuahua": ["Chihuahua", "Juárez", "Delicias"],
    "Ciudad de México": ["Azcapotzalco", "Coyoacán", "Cuajimalpa", "Gustavo A. Madero", "Iztapalapa", "Benito Juárez"],
    "Coahuila": ["Saltillo", "Torreón"],
    "Colima": ["Colima", "Manzanillo", "Villa de Álvarez", "Tecomán", "Comala"],
    "Durango": ["Durango", "Gómez Palacio"],
    "Guanajuato": ["León", "Guanajuato", "Irapuato"],
    "Guerrero": ["Acapulco", "Chilpancingo"],
    "Hidalgo": ["Pachuca", "Tulancingo"],
    "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta"],
    "México": ["Toluca", "Naucalpan", "Ecatepec"],
    "Michoacán": ["Morelia", "Uruapan"],
    "Morelos": ["Cuernavaca", "Jiutepec"],
    "Nayarit": ["Tepic", "Bahía de Banderas"],
    "Nuevo León": ["Monterrey", "San Pedro Garza García", "Guadalupe", "Apodaca"],
    "Oaxaca": ["Oaxaca de Juárez", "Salina Cruz"],
    "Puebla": ["Puebla", "Tehuacán"],
    "Querétaro": ["Querétaro", "San Juan del Río"],
    "Quintana Roo": ["Cancún", "Playa del Carmen", "Chetumal"],
    "San Luis Potosí": ["San Luis Potosí", "Soledad de Graciano Sánchez"],
    "Sinaloa": ["Culiacán", "Mazatlán"],
    "Sonora": ["Hermosillo", "Ciudad Obregón", "Nogales"],
    "Tabasco": ["Villahermosa", "Cárdenas"],
    "Tamaulipas": ["Ciudad Victoria", "Tampico", "Reynosa"],
    "Tlaxcala": ["Tlaxcala", "Apizaco"],
    "Veracruz": ["Xalapa", "Veracruz", "Coatzacoalos"],
    "Yucatán": ["Mérida", "Progreso", "Valladolid", "Tizimín"],
    "Zacatecas": ["Zacatecas", "Fresnillo"]
};
// Array de estados para el select
const estadosDeMexico = Object.keys(datosMexico);

// Listas de áreas y servicios disponibles
const areasDisponibles = [
    "Administracion",
    "Contabilidad",
    "Recursos humanos",
    "General",
    "Contratación",
    "Centro de Atención a Usuarios",
    "Servicio"
];
const serviciosPorArea = {
    "Contabilidad": ["Pagos y convenios", "Facturación"],
    "Administracion": ["Admnistración"],
    "Recursos humanos": ["Capacitación"],
    "General": ["Reporte de Servicio"],
    "Contratación": ["Contratación"],
    "Centro de Atención a Usuarios": ["Reporte"],
    "Servicio": ["Cortes y Reconexiones"]
};


// Definición de las props del componente
interface FormularioProps {
    onSave: (datos: any) => void;
    onCancel: () => void;
}

// Interfaz para los datos que se enviarán a la API
interface SucursalFormData {
    sucursal: {
        estado: string;
        municipio: string;
        domicilio: string;
    };
    ejecutivos: { ck_usuario: string; area: string; servicio: string }[];
    asesores: { ck_usuario: string; area: string; servicio: string }[];
}

export default function FormularioSucursales({ onSave, onCancel }: FormularioProps) {
    // Estado para los campos del formulario de la sucursal
    const [formData, setFormData] = useState({ estado: "", municipio: "", domicilio: "" });
    // Estado para la lista de municipios que dependen del estado seleccionado
    const [municipiosDisponibles, setMunicipiosDisponibles] = useState<string[]>([]);

    // Estados para las listas de usuarios y los asignados a la sucursal
    const [listaCompletaEjecutivos, setListaCompletaEjecutivos] = useState<Usuario[]>([]);
    const [listaCompletaAsesores, setListaCompletaAsesdores] = useState<Usuario[]>([]);
    const [ejecutivosAsignados, setEjecutivosAsignados] = useState<Usuario[]>([]);
    const [asesoresAsignados, setAsesoresAsignados] = useState<Usuario[]>([]);

    // Estado para los valores seleccionados temporalmente antes de agregar
    const [ejecutivoActual, setEjecutivoActual] = useState({ usuarioId: "", area: "", servicio: "" });
    const [asesorActual, setAsesorActual] = useState({ usuarioId: "", area: "", servicio: "" });

    // Estados para los servicios que dependen del área seleccionada
    const [serviciosDisponiblesEjecutivo, setServiciosDisponiblesEjecutivo] = useState<string[]>([]);
    const [serviciosDisponiblesAsesor, setServiciosDisponiblesAsesor] = useState<string[]>([]);

    // Estado para mostrar el estado de carga
    const [loading, setLoading] = useState(true);

    // Estados para manejar los errores de validación de los campos
    const [ejecutivoUsuarioError, setEjecutivoUsuarioError] = useState(false);
    const [ejecutivoAreaError, setEjecutivoAreaError] = useState(false);
    const [ejecutivoServicioError, setEjecutivoServicioError] = useState(false);

    const [asesorUsuarioError, setAsesorUsuarioError] = useState(false);
    const [asesorAreaError, setAsesorAreaError] = useState(false);
    const [asesorServicioError, setAsesorServicioError] = useState(false);

    const [estadoError, setEstadoError] = useState(false);
    const [domicilioError, setDomicilioError] = useState(false);

    // Hook para cargar los usuarios al inicio del componente
    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const respuesta = await usuariosService.getAllUsuarios();

                if (respuesta.success && Array.isArray(respuesta.data.usuarios)) {
                    const todosLosUsuarios: Usuario[] = respuesta.data.usuarios;

                    // Filtra los usuarios por tipo para separar ejecutivos (2) y asesores (3)
                    const ejecutivos = todosLosUsuarios.filter(u => u.i_tipo_usuario == 2);
                    const asesores = todosLosUsuarios.filter(u => u.i_tipo_usuario == 3);

                    setListaCompletaEjecutivos(ejecutivos);
                    setListaCompletaAsesores(asesores);
                } else {
                    console.error("La respuesta del servicio no tiene el formato esperado:", respuesta);
                }
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
                alert("No se pudieron cargar los usuarios. Revisa la consola para más detalles.");
            } finally {
                setLoading(false);
            }
        };

        cargarUsuarios();
    }, []);

    // Maneja los cambios en los campos del formulario de la sucursal
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Reinicia el error al seleccionar un valor
        if (name === "estado") {
            setEstadoError(false);
            // Actualiza la lista de municipios según el estado seleccionado
            const municipios = value ? datosMexico[value as keyof typeof datosMexico] : [];
            setMunicipiosDisponibles(municipios);
            setFormData(prev => ({ ...prev, estado: value, municipio: "" }));
        } else if (name === "domicilio") {
            setDomicilioError(false);
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Maneja los cambios en los selects de asignación de ejecutivos
    const handleEjecutivoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Reinicia los errores al seleccionar un valor
        if (name === 'usuario') { setEjecutivoUsuarioError(false); }
        if (name === 'area') { setEjecutivoAreaError(false); }
        if (name === 'servicio') { setEjecutivoServicioError(false); }

        if (name === 'usuario') {
            setEjecutivoActual(prev => ({ ...prev, usuarioId: value }));
        } else if (name === 'area') {
            const servicios = value ? serviciosPorArea[value as keyof typeof serviciosPorArea] : [];
            setServiciosDisponiblesEjecutivo(servicios);
            setEjecutivoActual(prev => ({ ...prev, area: value, servicio: "" }));
        } else if (name === 'servicio') {
            setEjecutivoActual(prev => ({ ...prev, servicio: value }));
        }
    };

    // Maneja los cambios en los selects de asignación de asesores
    const handleAsesorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Reinicia los errores al seleccionar un valor
        if (name === 'usuario') { setAsesorUsuarioError(false); }
        if (name === 'area') { setAsesorAreaError(false); }
        if (name === 'servicio') { setAsesorServicioError(false); }
        
        if (name === 'usuario') {
            setAsesorActual(prev => ({ ...prev, usuarioId: value }));
        } else if (name === 'area') {
            const servicios = value ? serviciosPorArea[value as keyof typeof serviciosPorArea] : [];
            setServiciosDisponiblesAsesor(servicios);
            setAsesorActual(prev => ({ ...prev, area: value, servicio: "" }));
        } else if (name === 'servicio') {
            setAsesorActual(prev => ({ ...prev, servicio: value }));
        }
    };

    // Agrega un ejecutivo a la lista de asignados
    const agregarEjecutivo = () => {
        // Valida que todos los campos estén seleccionados
        const isUsuarioValid = !!ejecutivoActual.usuarioId;
        const isAreaValid = !!ejecutivoActual.area;
        const isServicioValid = !!ejecutivoActual.servicio;

        setEjecutivoUsuarioError(!isUsuarioValid);
        setEjecutivoAreaError(!isAreaValid);
        setEjecutivoServicioError(!isServicioValid);

        if (!isUsuarioValid || !isAreaValid || !isServicioValid) {
            return;
        }

        // Busca al ejecutivo en la lista completa y lo agrega a la lista de asignados
        const ejecutivoParaAgregar = listaCompletaEjecutivos.find(e => e.ck_usuario === ejecutivoActual.usuarioId);
        if (ejecutivoParaAgregar) {
            const nuevoEjecutivo = {
                ...ejecutivoParaAgregar,
                area: ejecutivoActual.area,
                servicio: ejecutivoActual.servicio
            };
            setEjecutivosAsignados([...ejecutivosAsignados, nuevoEjecutivo]);
            // Reinicia los campos de selección para el próximo ejecutivo
            setEjecutivoActual({ usuarioId: "", area: "", servicio: "" });
            setServiciosDisponiblesEjecutivo([]);
        }
    };

    // Agrega un asesor a la lista de asignados
    const agregarAsesor = () => {
        // Valida que todos los campos estén seleccionados
        const isUsuarioValid = !!asesorActual.usuarioId;
        const isAreaValid = !!asesorActual.area;
        const isServicioValid = !!asesorActual.servicio;

        setAsesorUsuarioError(!isUsuarioValid);
        setAsesorAreaError(!isAreaValid);
        setAsesorServicioError(!isServicioValid);

        if (!isUsuarioValid || !isAreaValid || !isServicioValid) {
            return;
        }

        // Busca al asesor en la lista completa y lo agrega a la lista de asignados
        const asesorParaAgregar = listaCompletaAsesores.find(a => a.ck_usuario === asesorActual.usuarioId);
        if (asesorParaAgregar) {
            const nuevoAsesor = {
                ...asesorParaAgregar,
                area: asesorActual.area,
                servicio: asesorActual.servicio
            };
            setAsesoresAsignados([...asesoresAsignados, nuevoAsesor]);
            // Reinicia los campos de selección para el próximo asesor
            setAsesorActual({ usuarioId: "", area: "", servicio: "" });
            setServiciosDisponiblesAsesor([]);
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

        // Valida los campos de la sucursal antes de enviar
        const isEstadoValid = !!formData.estado;
        const isDomicilioValid = !!formData.domicilio;

        setEstadoError(!isEstadoValid);
        setDomicilioError(!isDomicilioValid);

        if (!isEstadoValid || !isDomicilioValid) {
            return;
        }

        // Construye el objeto de datos para enviar a la API
        const datosParaEnviar: SucursalFormData = {
            sucursal: {
                estado: formData.estado,
                municipio: formData.municipio,
                domicilio: formData.domicilio,
            },
            ejecutivos: ejecutivosAsignados.map(e => ({ ck_usuario: e.ck_usuario, area: e.area, servicio: e.servicio })),
            asesores: asesoresAsignados.map(a => ({ ck_usuario: a.ck_usuario, area: a.area, servicio: a.servicio })),
        };

        try {
            // const response = await sucursalesService.createSucursal(datosParaEnviar);
            alert("Sucursal guardada con éxito!");

            onSave(datosParaEnviar);
        } catch (error: any) {
            alert("Error al guardar la sucursal: " + error.message);
            console.error("Error completo:", error);
        }
    };

    // Filtra los ejecutivos disponibles para evitar duplicados en la lista de asignación
    const idsEjecutivosAsignados = new Set(ejecutivosAsignados.map(e => e.ck_usuario));
    const ejecutivosDisponibles = listaCompletaEjecutivos.filter(
        (ejec) => !idsEjecutivosAsignados.has(ejec.ck_usuario)
    );

    // Filtra los asesores disponibles para evitar duplicados en la lista de asignación
    const idsAsesoresAsignados = new Set(asesoresAsignados.map(a => a.ck_usuario));
    const asesoresDisponibles = listaCompletaAsesores.filter(
        (asesor) => !idsAsesoresAsignados.has(asesor.ck_usuario)
    );

    // Muestra un indicador de carga mientras se obtienen los usuarios
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando usuarios...</span>
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
            <PageBreadcrumb pageTitle="Registrar Nueva Sucursal" />

            <form onSubmit={handleSubmit} className="space-y-6">
                <ComponentCard title="Datos de la Sucursal">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <label htmlFor="estado" className="block text-sm font-medium text-gray-700">Estado</label>
                            <select
                                id="estado"
                                name="estado"
                                value={formData.estado}
                                onChange={handleFormChange}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border ${estadoError ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Seleccionar Estado</option>
                                {estadosDeMexico.map(estado => (
                                    <option key={estado} value={estado}>{estado}</option>
                                ))}
                            </select>
                            {estadoError && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-red-500 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                                    ¡Selecciona un elemento de la lista!
                                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-red-500"></div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label htmlFor="municipio" className="block text-sm font-medium text-gray-700">Municipio</label>
                            <select
                                id="municipio"
                                name="municipio"
                                value={formData.municipio}
                                onChange={handleFormChange}
                                disabled={!formData.estado}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border disabled:bg-gray-100"
                            >
                                <option value="">{formData.estado ? 'Seleccionar Municipio' : 'Primero elige un estado'}</option>
                                {municipiosDisponibles.map(municipio => (
                                    <option key={municipio} value={municipio}>{municipio}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 relative">
                        <label htmlFor="domicilio" className="block text-sm font-medium text-gray-700">Domicilio</label>
                        <input
                            type="text"
                            id="domicilio"
                            name="domicilio"
                            value={formData.domicilio}
                            onChange={handleFormChange}
                            placeholder="Calle, número, colonia, código postal"
                            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm p-2 border ${domicilioError ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {domicilioError && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-red-500 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                                ¡Completa este campo!
                                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-red-500"></div>
                            </div>
                        )}
                    </div>
                </ComponentCard>

                <ComponentCard title="Asignar Ejecutivo a Sucursal">
                    <div className="flex items-end gap-4">
                        <div className="flex-1 relative">
                            <label className="text-sm">Usuario</label>
                            <select name="usuario" value={ejecutivoActual.usuarioId} onChange={handleEjecutivoChange} className={`w-full border rounded-lg p-2 ${ejecutivoUsuarioError ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">Seleccionar Ejecutivo</option>
                                {ejecutivosDisponibles.map(ejec => (
                                    <option key={ejec.ck_usuario} value={ejec.ck_usuario}>
                                        {`${ejec.s_nombre} ${ejec.s_apellido_paterno || ''}`}
                                    </option>
                                ))}
                            </select>
                            {ejecutivoUsuarioError && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-red-500 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                                    ¡Selecciona un elemento de la lista!
                                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-red-500"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 relative group">
                            <label className="text-sm">Área</label>
                            <select
                                name="area"
                                value={ejecutivoActual.area}
                                onChange={handleEjecutivoChange}
                                disabled={!ejecutivoActual.usuarioId}
                                className={`w-full border rounded-lg p-2 ${ejecutivoAreaError ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`}
                            >
                                <option value="">{ejecutivoActual.usuarioId ? "Seleccionar Área" : "Seleccione primero un Usuario"}</option>
                                {ejecutivoActual.usuarioId && areasDisponibles.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                            {!ejecutivoActual.usuarioId && (
                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 w-max mb-2 p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg z-20 whitespace-nowrap">
                                    Seleccione primero un Usuario
                                    <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div>
                                </div>
                            )}
                            {ejecutivoAreaError && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-red-500 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                                    ¡Selecciona un elemento de la lista!
                                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-red-500"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 relative group">
                            <label className="text-sm">Servicio</label>
                            <select
                                name="servicio"
                                value={ejecutivoActual.servicio}
                                onChange={handleEjecutivoChange}
                                disabled={!ejecutivoActual.area || serviciosDisponiblesEjecutivo.length === 0}
                                className={`w-full border rounded-lg p-2 disabled:bg-gray-100 ${ejecutivoServicioError ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">
                                    {ejecutivoActual.area ? "Seleccionar Servicio" : "Primero elija un área"}
                                </option>
                                {serviciosDisponiblesEjecutivo.map(servicio => (
                                    <option key={servicio} value={servicio}>{servicio}</option>
                                ))}
                            </select>
                            {!ejecutivoActual.area && ejecutivoActual.usuarioId && (
                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 w-max mb-2 p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg z-20 whitespace-nowrap">
                                    Seleccione primero un Área
                                    <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div>
                                </div>
                            )}
                            {ejecutivoServicioError && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-red-500 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                                    ¡Selecciona un elemento de la lista!
                                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-red-500"></div>
                                </div>
                            )}
                        </div>
                        <button type="button" onClick={agregarEjecutivo} className="bg-blue-500 text-white rounded-full w-10 h-10 text-xl font-bold flex-shrink-0">+</button>
                    </div>
                    <div className="mt-4">
                        {/* Lista de ejecutivos agregados */}
                        {ejecutivosAsignados.length > 0 && (
                            <ul className="space-y-2">
                                {ejecutivosAsignados.map(ejec => (
                                    <li key={ejec.ck_usuario} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                                        <span>
                                            <strong>{ejec.s_nombre} {ejec.s_apellido_paterno}</strong> - {ejec.area} - {ejec.servicio}
                                        </span>
                                        <button onClick={() => eliminarEjecutivo(ejec.ck_usuario)} className="text-red-500 hover:text-red-700 font-bold">
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </ComponentCard>

                <ComponentCard title="Asignar Asesor a Sucursal">
                    <div className="flex items-end gap-4">
                        <div className="flex-1 relative">
                            <label className="text-sm">Usuario</label>
                            <select name="usuario" value={asesorActual.usuarioId} onChange={handleAsesorChange} className={`w-full border rounded-lg p-2 ${asesorUsuarioError ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">Seleccionar Asesor</option>
                                {asesoresDisponibles.map(asesor => (
                                    <option key={asesor.ck_usuario} value={asesor.ck_usuario}>
                                        {`${asesor.s_nombre} ${asesor.s_apellido_paterno || ''}`}
                                    </option>
                                ))}
                            </select>
                            {asesorUsuarioError && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-red-500 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                                    ¡Selecciona un elemento de la lista!
                                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-red-500"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 relative group">
                            <label className="text-sm">Área</label>
                            <select
                                name="area"
                                value={asesorActual.area}
                                onChange={handleAsesorChange}
                                disabled={!asesorActual.usuarioId}
                                className={`w-full border rounded-lg p-2 ${asesorAreaError ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`}
                            >
                                <option value="">{asesorActual.usuarioId ? "Seleccionar Área" : "Seleccione primero un Usuario"}</option>
                                {asesorActual.usuarioId && areasDisponibles.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                            {!asesorActual.usuarioId && (
                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 w-max mb-2 p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg z-20 whitespace-nowrap">
                                    Seleccione primero un Usuario
                                    <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div>
                                </div>
                            )}
                            {asesorAreaError && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-red-500 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                                    ¡Selecciona un elemento de la lista!
                                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-red-500"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 relative group">
                            <label className="text-sm">Servicio</label>
                            <select
                                name="servicio"
                                value={asesorActual.servicio}
                                onChange={handleAsesorChange}
                                disabled={!asesorActual.area || serviciosDisponiblesAsesor.length === 0}
                                className={`w-full border rounded-lg p-2 disabled:bg-gray-100 ${asesorServicioError ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">
                                    {asesorActual.area ? "Seleccionar Servicio" : "Primero elija un área"}
                                </option>
                                {serviciosDisponiblesAsesor.map(servicio => (
                                    <option key={servicio} value={servicio}>{servicio}</option>
                                ))}
                            </select>
                            {!asesorActual.area && asesorActual.usuarioId && (
                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 w-max mb-2 p-2 bg-gray-700 text-white text-xs rounded-lg shadow-lg z-20 whitespace-nowrap">
                                    Seleccione primero un Área
                                    <div className="absolute left-1/2 top-full transform -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div>
                                </div>
                            )}
                            {asesorServicioError && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-2 bg-red-500 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                                    ¡Selecciona un elemento de la lista!
                                    <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -mt-2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-red-500"></div>
                                </div>
                            )}
                        </div>
                        <button type="button" onClick={agregarAsesor} className="bg-blue-500 text-white rounded-full w-10 h-10 text-xl font-bold flex-shrink-0">+</button>
                    </div>
                    <div className="mt-4">
                        {/* Lista de asesores agregados */}
                        {asesoresAsignados.length > 0 && (
                            <ul className="space-y-2">
                                {asesoresAsignados.map(asesor => (
                                    <li key={asesor.ck_usuario} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                                        <span>
                                            <strong>{asesor.s_nombre} {asesor.s_apellido_paterno}</strong> - {asesor.area} - {asesor.servicio}
                                        </span>
                                        <button onClick={() => eliminarAsesor(asesor.ck_usuario)} className="text-red-500 hover:text-red-700 font-bold">
                                            &times;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </ComponentCard>

                {/* Botones de acción del formulario */}
                <div className="flex justify-end pt-4 gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg bg-emerald-700 font-semibold"
                    >
                        Guardar Sucursal
                    </button>
                </div>
            </form>
        </>
    );
}