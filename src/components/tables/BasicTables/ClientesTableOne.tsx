import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table"; 
import ActividadDiariaClientes from "./ActividadDiariaClientes"; 

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

const tableData: Area[] = [
  { id: 1, ck_area: "550e...", c_codigo_area: "Juan Perez", s_area: "Facturación", s_description_area: "Activo", ck_estatus: "Ultima Compra: 15/07/2025", ck_sucursal: "suc-001" },
  { id: 2, ck_area: "550e...", c_codigo_area: "Maria Lopez", s_area: "Ventas", s_description_area: "Pendiente", ck_estatus: "Ultima Compra: 10/07/2025", ck_sucursal: "suc-002" },
  { id: 3, ck_area: "550e...", c_codigo_area: "Carlos Gomez", s_area: "Cobranza", s_description_area: "Activo", ck_estatus: "Ultima Compra: 20/07/2025", ck_sucursal: "suc-003" },
];



export default function ClienteTableOne() {
  const [currentValue] = useState(3240);
  const [maxValue] = useState(5000);
  const progressPercentage = Math.min((currentValue / maxValue) * 100, 100);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <>
      {/* === Gráfica === */}
      <ActividadDiariaClientes />

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

      {/* === Tabla === */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-white/[0.05] dark:bg-gray-800">
      </div>
    </>
  );
}
