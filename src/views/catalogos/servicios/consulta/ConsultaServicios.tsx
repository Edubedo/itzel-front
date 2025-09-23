import React, { useState } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../../components/common/ComponentCard";
import FormularioSimpleServicios from "./../formulario/FormularioServicios";
import { FaPlus, FaUndo } from "react-icons/fa";

// --- LISTAS DE OPCIONES ---
const serviciosParaClientes = [
    'Pagos y convenios',
    'Facturación',
    'Cortes y Reconexiones',
    'Reportes de servicio'
];

const serviciosParaNoClientes = [
    'Contratacion',
    'Reporte'
];

// --- COMPONENTE PRINCIPAL ---
export default function ConsultaServicios() {
    const [tipoCliente, setTipoCliente] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [tipoClienteSeleccionado, setTipoClienteSeleccionado] = useState(null);

    const handleClienteClick = (tipo) => {
        setTipoClienteSeleccionado(tipo);
    };

    const handleAceptarClick = () => {
        if (tipoClienteSeleccionado) {
            setTipoCliente(tipoClienteSeleccionado);
        }
    };

    const reiniciarSeleccion = () => {
        setTipoCliente(null);
        setTipoClienteSeleccionado(null);
        setSearchTerm("");
    };
    
    const clearFilters = () => {
        setSearchTerm("");
    };

    const obtenerTitulo = () => {
        if (tipoCliente === 'cliente') return "Consulta para Clientes";
        if (tipoCliente === 'no_cliente') return "Consulta para No Clientes";
        return "Consulta de Servicios";
    };

    const serviciosFiltrados = () => {
        if (tipoCliente === 'cliente') {
            return serviciosParaClientes.filter(servicio =>
                servicio.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (tipoCliente === 'no_cliente') {
            return serviciosParaNoClientes.filter(servicio =>
                servicio.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return [];
    };

    return (
        <>
            <PageMeta title="Consulta de Servicios" description="Seleccione el tipo de consulta de servicio" />
            <PageBreadcrumb pageTitle={obtenerTitulo()} />

            {tipoCliente === null ? (
                // --- VISTA INICIAL (LISTA CON OPCIONES DE CLIENTE) ---
                <ComponentCard title="Seleccione de acuerdo al cliente">
                    <div className="rounded-lg shadow-md w-full overflow-hidden border border-gray-200">
                        <ul className="divide-y divide-gray-200 bg-white">
                            <li
                                onClick={() => handleClienteClick('cliente')}
                                className={`
                                    cursor-pointer transition-colors flex items-center
                                    ${tipoClienteSeleccionado === 'cliente' ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}
                                `}
                            >
                                <div className="p-4 text-lg font-medium w-12 flex-shrink-0 text-gray-600">
                                    1.
                                </div>
                                <div className="p-4 text-lg font-medium flex-grow">
                                    CLIENTE
                                </div>
                            </li>
                            <li
                                onClick={() => handleClienteClick('no_cliente')}
                                className={`
                                    cursor-pointer transition-colors flex items-center
                                    ${tipoClienteSeleccionado === 'no_cliente' ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}
                                `}
                            >
                                <div className="p-4 text-lg font-medium w-12 flex-shrink-0 text-gray-600">
                                    2.
                                </div>
                                <div className="p-4 text-lg font-medium flex-grow">
                                    NO CLIENTE
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleAceptarClick}
                            disabled={!tipoClienteSeleccionado}
                            className="bg-emerald-600 text-white font-bold text-lg py-3 px-12 rounded-lg shadow-md hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            Aceptar
                        </button>
                    </div>
                </ComponentCard>
            ) : (
                // --- VISTAS CONDICIONALES CON FORMATO DE FILTRO ---
                <div>
                    <div className="mb-6 flex justify-between items-center">
                        <button
                            onClick={reiniciarSeleccion}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold flex items-center"
                        >
                            <FaUndo className="mr-2" />
                            Volver a seleccionar
                        </button>
                        <button
                            onClick={() => alert("Función para añadir un nuevo servicio...")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                        >
                            <FaPlus className="mr-2" />
                            Añadir Servicio
                        </button>
                    </div>

                    {/* Filtros de búsqueda */}
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="flex flex-wrap gap-4 items-end">
                            {/* Buscador */}
                            <div className="flex-1 min-w-64">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar Servicio
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar por servicio..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                                </div>
                            </div>
                            
                            {/* Botón limpiar filtros */}
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
                    
                    {/* Contenido del formulario */}
                    <ComponentCard title="Servicios Disponibles">
                        <FormularioSimpleServicios
                            titulo={obtenerTitulo()}
                            opciones={serviciosFiltrados()}
                        />
                    </ComponentCard>
                </div>
            )}
        </>
    );
}