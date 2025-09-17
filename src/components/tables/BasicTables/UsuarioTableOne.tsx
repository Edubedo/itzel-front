import { useState } from "react"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";

interface Usuario {
  id: number;
  s_foto: string;
  s_nombre: string;
  s_apellido_paterno: string; 
  s_apellido_materno: string; 
  s_domicilio: string;
  s_telefono: string;
  s_correo_electronico: string;
  ck_estatus: string;
  d_fecha_de_nacimiento?: string;
  s_password?: string;
  ck_usuario?: string;
  i_tipo_usuario: string;
  s_rfc?: string;
  s_curp?: string;
  ck_sistema?: string;

}

const tableData: Usuario[] = [
  {
    id: 1,
    s_nombre: "Marta",
    s_apellido_paterno: "Aguilar",
    s_apellido_materno: "Enciso",
    s_domicilio:  "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },

  {
    id: 2,
    s_nombre: "David",
    s_apellido_paterno: "Sierra",
    s_apellido_materno: "Fabian",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Administrador",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 3,
    s_nombre: "Teresa",
    s_apellido_paterno: "Sierra",
    s_apellido_materno: "Aguilar",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 4,
     s_nombre: "Gloria",
    s_apellido_paterno: "Sierra",
    s_apellido_materno: "Aguilar",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Ejecutivo",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 5,
    s_nombre: "Eduardo",
    s_apellido_paterno: "Hernandez",
    s_apellido_materno: "Escobedo",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 6,
    s_nombre: "Raquel",
    s_apellido_paterno: "Villa",
    s_apellido_materno: "Solis",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "INACTI",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 7,
    s_nombre: "Rosa",
    s_apellido_paterno: "Sandoval",
    s_apellido_materno: "Calvillo",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 8,
    s_nombre: "Pamela",
    s_apellido_paterno: "Rodriguez",
    s_apellido_materno: "Gomez",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Ejecutivo",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 9,
    s_nombre: "Vanesa",
    s_apellido_paterno: "Cortez",
    s_apellido_materno: "Sanchez",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 10,
    s_nombre: "Josefa",
    s_apellido_paterno: "Ortiz",
    s_apellido_materno: "Dominguez",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "INACTI",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 11,
    s_nombre: "Jose",
    s_apellido_paterno: "Saragoza",
    s_apellido_materno: "Villa",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-22.jpg"
  },
  {
    id: 12,
    s_nombre: "Miguel",
    s_apellido_paterno: "Hidalgo",
    s_apellido_materno: "Costilla",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 13,
    s_nombre: "Pedro",
    s_apellido_paterno: "Gonzales",
    s_apellido_materno: "Lopez",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 14,
    s_nombre: "Kiraz",
    s_apellido_paterno: "Bolat",
    s_apellido_materno: "Yildiz",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "INACTI",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
  },
  {
    id: 15,
    s_nombre: "Monica",
    s_apellido_paterno: "Suarez",
    s_apellido_materno: "Topete",
    s_domicilio: "Barrio 4 Valle de las Garzas, Andador leo #48",
    s_telefono: "3148364792",
    s_correo_electronico: "marta123@gmail.com",
    ck_estatus: "ACTIVO",
    i_tipo_usuario: "Asesor",
    s_foto: "/images/user/user-17.jpg"
}
];

export default function UsuarioTableOne() {
  // ESTADOS PARA LA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //FILTRAR POR ACTIVO O INACTI
//   const [filtro] = useState<string>(""); 
//   const usuariosFiltrados = tableData.filter((usuario) => {
//   if (filtro === "ACTIVO") return usuario.ck_estatus === "ACTIVO";
//   if (filtro === "INACTI") return usuario.ck_estatus === "INACTI";
//   return true; // si filtro está vacío, devuelve todos
// });

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
                Foto
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Nombre 
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Apellido Paterno
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Apellido Materno
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Domicilio
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Teléfono
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Email
              </TableCell>
              <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Tipo de Usuario
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
            {currentData.map((Usuario) => (
              <TableRow key={Usuario.id}>
                 <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                  {Usuario.s_foto}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {Usuario.s_nombre}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                  {Usuario.s_apellido_paterno}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                  {Usuario.s_apellido_materno}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                  {Usuario.s_domicilio}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                  {Usuario.s_telefono}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                  {Usuario.s_correo_electronico}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                  {Usuario.i_tipo_usuario}
                </TableCell>
                <TableCell className="px-4 py-3 text-start">
                  <Badge
                    size="sm"
                    color={Usuario.ck_estatus === "ACTIVO" ? "success" : "error"}
                  >
                    {Usuario.ck_estatus}
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
