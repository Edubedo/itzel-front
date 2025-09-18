import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table"; // Asegúrate de que esta ruta sea correcta

// Definición de la interfaz para los datos de la tabla
interface Area {
  id: number;
  ck_area: string;
  c_codigo_area: string;
  s_area: string;
  s_description_area: string;
  ck_estatus: string;
  ck_sucursal: string;
  sucursal_nombre?: string; // Campo opcional
}

// Datos de ejemplo para la tabla
const tableData: Area[] = [
  { id: 1, ck_area: "550e8400-e29b-41d4-a716-446655440000", c_codigo_area: "Juan perez", s_area: "Facturacion", s_description_area: "Activo", ck_estatus: "Ultima Compra: 15/07/2025", ck_sucursal: "suc-001" },
  { id: 2, ck_area: "550e8400-e29b-41d4-a716-446655440000", c_codigo_area: "Maria Lopez", s_area: "Ventas", s_description_area: "Pendiente", ck_estatus: "Ultima Compra: 10/07/2025", ck_sucursal: "suc-002" },
  { id: 3, ck_area: "550e8400-e29b-41d4-a716-446655440000", c_codigo_area: "Carlos Gomez", s_area: "Cobranza", s_description_area: "Activo", ck_estatus: "Ultima Compra: 20/07/2025", ck_sucursal: "suc-003" },
  { id: 4, ck_area: "550e8400-e29b-41d4-a716-446655440000", c_codigo_area: "Ana Rodriguez", s_area: "Contabilidad", s_description_area: "Inactivo", ck_estatus: "Ultima Compra: 01/07/2025", ck_sucursal: "suc-004" },
  { id: 5, ck_area: "550e8400-e29b-41d4-a716-446655440000", c_codigo_area: "Pedro Sanchez", s_area: "Servicios", s_description_area: "Activo", ck_estatus: "Ultima Compra: 18/07/2025", ck_sucursal: "suc-005" },
  { id: 6, ck_area: "550e8400-e29b-41d4-a716-446655440000", c_codigo_area: "Laura Fernandez", s_area: "Facturacion", s_description_area: "Activo", ck_estatus: "Ultima Compra: 25/07/2025", ck_sucursal: "suc-006" },
  { id: 7, ck_area: "550e8400-e29b-41d4-a716-446655440000", c_codigo_area: "Miguel Angel", s_area: "Ventas", s_description_area: "Pendiente", ck_estatus: "Ultima Compra: 12/07/2025", ck_sucursal: "suc-007" },
];

export default function ClienteTableOne() {
  // === Lógica de la Métrica (ahora sin el useEffect) ===
  const [currentValue, setCurrentValue] = useState(3240);
  const [maxValue, setMaxValue] = useState(5000);

  // Calcula el porcentaje de progreso. Ya no se actualiza automáticamente.
  const progressPercentage = Math.min((currentValue / maxValue) * 100, 100);

  // === Lógica de la Paginación ===
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
    
      
      {/* Sección de la Tabla */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-white/[0.05] dark:bg-gray-800">
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Nombre
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Tipo de servicio
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Estado
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Sucursal / Última Compra
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {currentData.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="font-medium text-gray-800 text-sm dark:text-white/90">
                      {area.c_codigo_area}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-sm dark:text-white/90 font-medium">
                    {area.s_area}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                    {area.s_description_area}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                    {area.sucursal_nombre || area.ck_sucursal} - {area.ck_estatus}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                        Editar
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                        Eliminar
                      </button>
                      <button className="p-1 text-yellow-400 hover:text-yellow-600 dark:text-yellow-300 dark:hover:text-yellow-200">
                        Actualizar
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* PAGINACIÓN CON LÓGICA */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
              Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} áreas
            </span>
            <div className="flex space-x-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-700"
              >
                Anterior
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                }
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-3 py-1 rounded-md text-sm text-gray-500 dark:text-gray-400">...</span>
              )}
              {totalPages > 5 && currentPage >= totalPages - 2 && totalPages > 5 && (
                 (currentPage !== totalPages && totalPages > 1 && (
                   <button
                     key={totalPages}
                     onClick={() => goToPage(totalPages)}
                     className={`px-3 py-1 rounded-md text-sm ${
                       currentPage === totalPages
                         ? 'bg-blue-600 text-white'
                         : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                     } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                   >
                     {totalPages}
                   </button>
                 ))
               )}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:bg-gray-700"
              >
                Siguiente
              </button>
            </div>
          </div>
            {/* Sección de la Métrica */}
      <div className="metric-container p-6 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Turnos Manejados Hoy</h2>
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
        </div>
      </div>
    </>
  );
}