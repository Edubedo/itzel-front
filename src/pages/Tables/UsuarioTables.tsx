import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UsuarioTableOne from "../../components/tables/BasicTables/UsuarioTableOne";

interface UsuarioTableProps {
    titleTable?: string;
}

export default function UsuarioTables({titleTable = "Catálogo de Usuarios"}: UsuarioTableProps) {
  return (
    <>
      
      <PageMeta
        title="Sistema de Turnos - Catálogo de Usuarios"
        description="Catálogo de áreas para el sistema de turnos"
      />
      <PageBreadcrumb pageTitle={titleTable} />
      
      {/* Botón de añadir */}
      <div className="mb-6 flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <span className="mr-2">+</span>
          Añadir Usuario
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        {/* Buscador */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o número telefonico..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
          <span className="absolute left-3 top-2.5">🔍</span>
        </div>
        
        {/* Filtro por Estado del Usuario */}
        <select className="border rounded-lg px-3 py-2">
          <option value="">Todos los usuarios</option>
          <option value="central">Usuarios Activos</option>
          <option value="norte">Usuarios Inactivos</option>
        </select>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Consulta de Usuarios">
          <UsuarioTableOne/>
        </ComponentCard>
      </div>

      {/* Estadísticas Resumidas */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800">Total Áreas</h3>
          <p className="text-2xl font-bold">15</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800">Activas</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800">Inactivas</h3>
          <p className="text-2xl font-bold">3</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800">Por Sucursal</h3>
          <p className="text-sm">Central: 8 | Norte: 4 | Sur: 3</p>
        </div>
      </div> */}
    </>
  );
}
