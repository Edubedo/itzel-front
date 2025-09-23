import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ComponentCard from '../../../../components/common/ComponentCard';

export default function FormularioSimpleServicios({ titulo, opciones }) {
    const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
    const navigate = useNavigate();

    const handleOpcionClick = (opcion) => {
        setOpcionSeleccionada(prev => prev === opcion ? null : opcion);
    };

    const handleAceptarClick = () => {
        if (!opcionSeleccionada) return;
        const slug = opcionSeleccionada.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        navigate(`/servicio/${slug}`);
    };

    return (
        <ComponentCard title={titulo}>
            <div className="p-6 md:p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-8">
                    Por favor, selecciona el motivo de tu consulta
                </h3>
                <div className="rounded-lg shadow-md w-full overflow-hidden border border-gray-200">
                    <ul className="divide-y divide-gray-200 bg-white">
                        {opciones.length > 0 ? (
                            opciones.map((opcion, index) => {
                                const isSelected = opcion === opcionSeleccionada;
                                return (
                                    <li
                                        key={opcion}
                                        onClick={() => handleOpcionClick(opcion)}
                                        className={`
                                            cursor-pointer transition-colors flex items-center
                                            ${isSelected ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-700'}
                                        `}
                                    >
                                        <div className="p-4 text-lg font-medium w-12 flex-shrink-0 text-gray-600">
                                            {index + 1}.
                                        </div>
                                        <div className="p-4 text-lg font-medium flex-grow">
                                            {opcion}
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="text-center text-gray-500 py-10">
                                No se encontraron resultados.
                            </li>
                        )}
                    </ul>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleAceptarClick}
                        disabled={!opcionSeleccionada}
                        className="bg-emerald-600 text-white font-bold text-lg py-3 px-12 rounded-lg shadow-md hover:bg-emerald-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </ComponentCard>
    );
}