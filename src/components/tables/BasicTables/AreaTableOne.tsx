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

interface AreaTableProps {
  areas: Area[];
  itemsPerPage?: number;
  isLoading?: boolean;
  onEdit?: (area: Area) => void;
  onDelete?: (area: Area) => void;
}

// Datos de ejemplo por defecto (simula API)
const defaultAreas: Area[] = [
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
    ck_estatus: "INACTI",
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
    s_area: "Atención al Asesor",
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

export default function AreaTableOne({
  areas = defaultAreas,
  itemsPerPage = 5,
  isLoading = false,
  onEdit,
  onDelete
}: AreaTableProps) {
  // ESTADOS PARA LA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);

  // CALCULAR DATOS PAGINADOS
  const totalItems = areas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = areas.slice(startIndex, endIndex);

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

  // MANEJAR ACCIONES
  const handleEdit = (area: Area) => {
    if (onEdit) {
      onEdit(area);
    } else {
      console.log('Editando área:', area);
    }
  };

  const handleDelete = (area: Area) => {
    if (onDelete) {
      onDelete(area);
    } else {
      console.log('Eliminando área:', area);
    }
  };

  // MOSTRAR LOADING
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando áreas...</span>
        </div>
      </div>
    );
  }

  // MOSTRAR MENSAJE SI NO HAY DATOS
  if (areas.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col justify-center items-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No hay áreas disponibles</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Los datos aparecerán aquí cuando estén disponibles</p>
        </div>
      </div>
    );
  }

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
                    <button 
                      onClick={() => handleEdit(area)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(area)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} áreas
            </span>
            <div className="flex space-x-2">
              <button 
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                Anterior
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
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
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook personalizado para simular API (opcional)
export const useAreas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simular llamada a API
  const fetchAreas = async () => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAreas(defaultAreas);
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addArea = (newArea: Omit<Area, 'id'>) => {
    const id = Math.max(...areas.map(a => a.id)) + 1;
    setAreas(prev => [...prev, { ...newArea, id }]);
  };

  const updateArea = (id: number, updatedArea: Partial<Area>) => {
    setAreas(prev => prev.map(area => 
      area.id === id ? { ...area, ...updatedArea } : area
    ));
  };

  const deleteArea = (id: number) => {
    setAreas(prev => prev.filter(area => area.id !== id));
  };

  return {
    areas,
    isLoading,
    fetchAreas,
    addArea,
    updateArea,
    deleteArea
  };
};