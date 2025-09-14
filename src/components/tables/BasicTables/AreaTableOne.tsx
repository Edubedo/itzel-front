import { useState } from "react"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";

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
  {
    id: 1,
    ck_area: "550e8400-e29b-41d4-a716-446655440000",
    c_codigo_area: "CONTA",
    s_area: "Contabilidad",
    s_description_area: "Área de facturación y contabilidad",
    ck_estatus: "ACTIVO",
    ck_sucursal: "suc-001",
    sucursal_nombre: "Secured Control"
  },
  {
    id: 2,
    ck_area: "550e8400-e29b-41d4-a716-446655440001",
    c_codigo_area: "RECHUM",
    s_area: "Recursos Humanos",
    s_description_area: "Gestión de pagos y recursos humanos",
    ck_estatus: "ACTIVO",
    ck_sucursal: "suc-001",
    sucursal_nombre: "Secured Control"
  },
  {
    id: 3,
    ck_area: "550e8400-e29b-41d4-a716-446655440002",
    c_codigo_area: "CONTR",
    s_area: "Contratación",
    s_description_area: "Contratación de servicios",
    ck_estatus: "INACTIVO",
    ck_sucursal: "suc-002",
    sucursal_nombre: "Secured Norte"
  },
  {
    id: 4,
    ck_area: "550e8400-e29b-41d4-a716-446655440003",
    c_codigo_area: "REP",
    s_area: "Reporte",
    s_description_area: "Generación de reportes y análisis",
    ck_estatus: "ACTIVO",
    ck_sucursal: "suc-001",
    sucursal_nombre: "Secured Control"
  },
  {
    id: 5,
    ck_area: "550e8400-e29b-41d4-a716-446655440004",
    c_codigo_area: "ATEN",
    s_area: "Atención al Cliente",
    s_description_area: "Área de atención al cliente y soporte",
    ck_estatus: "ACTIVO",
    ck_sucursal: "suc-002",
    sucursal_nombre: "Secured Norte"
  },
  {
    id: 6,
    ck_area: "550e8400-e29b-41d4-a716-446655440005",
    c_codigo_area: "ADMIN",
    s_area: "Administración",
    s_description_area: "Área administrativa",
    ck_estatus: "ACTIVO",
    ck_sucursal: "suc-001",
    sucursal_nombre: "Secured Control"
  },
  {
    id: 7,
    ck_area: "550e8400-e29b-41d4-a716-446655440006",
    c_codigo_area: "IT",
    s_area: "Tecnologías de Información",
    s_description_area: "Soporte técnico y sistemas",
    ck_estatus: "ACTIVO",
    ck_sucursal: "suc-001",
    sucursal_nombre: "Secured Control"
  }
];

export default function AreaTableOne() {
  // ESTADOS PARA LA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // CALCULAR DATOS PAGINADOS
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  // FUNCIONES PARA CAMBIAR PÁGINA
  const goToPage = (page: number) => {
    setCurrentPage(page);
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Código
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Nombre del Área
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Descripción
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Sucursal
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Estado
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Acciones
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentData.map((area) => (
              <TableRow key={area.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {area.c_codigo_area}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                  {area.s_area}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {area.s_description_area}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {area.sucursal_nombre || area.ck_sucursal}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Badge
                    size="sm"
                    color={area.ck_estatus === "ACTIVO" ? "success" : "error"}
                  >
                    {area.ck_estatus}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      Editar
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      Eliminar
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* PAGINACIÓN CON LÓGICA */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} áreas
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Anterior
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
