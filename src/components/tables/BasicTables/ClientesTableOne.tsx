import React, { useState } from "react";


interface Area {
  id: number;
  ck_area: string;
  c_codigo_area: string;
  s_area: string;
  s_description_area: string;
  ck_estatus: string;
  ck_sucursal: string;
  sucursal_nombre?: string;
}

interface ClienteTableOneProps {
  data: Area[];
}

export default function ClienteTableOne({ data }: ClienteTableOneProps) {
  const [currentValue] = useState(56);
  const [maxValue] = useState(200);

  const progressPercentage = Math.min((currentValue / maxValue) * 100, 100);

  return (
    <>
    {/* === Tabla de Clientes === */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Tipo contrato</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Codigo Cliente</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Apellido paterno</th>
              <th className="px-4 py-2 text-left">Apellido materno</th>
              <th className="px-4 py-2 text-left">Domicilio</th>
              
            </tr>
          </thead>
          <tbody>
            {data.map((cliente) => (
              <tr
                key={cliente.id}
                className="border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2">{cliente.c_codigo_area}</td>
                <td className="px-4 py-2">{cliente.s_area}</td>
                <td className="px-4 py-2">{cliente.s_description_area}</td>
                <td className="px-4 py-2">{cliente.ck_estatus}</td>
                <td className="px-4 py-2">{cliente.ck_sucursal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* === Métrica === */}
      <div className="metric-container p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Turnos Manejados Hoy
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-5xl font-bold text-blue-600 dark:text-blue-400 mr-4">
              {currentValue}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              de {maxValue}
            </span>
          </div>
          <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out dark:bg-green-600"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      
    </>
  );
}
