import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ClienteTableOne from "../../components/tables/BasicTables/ClientesTableOne";

// Define las props que recibe el componente
interface ClienteTablesProps {
  titleTable?: string;
}

export default function ClienteTables({ titleTable = "Catálogo de Clientes" }: ClienteTablesProps) {
  return (
    <>
      <PageMeta
        title="Sistema de Turnos - Catálogo de clientes"
        description="Catálogo de Clientes para el sistema de turnos"
      />
      <PageBreadcrumb pageTitle={titleTable} />
      
      <div className="mb-6 flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <span className="mr-2">+</span>
          Añadir Área
        </button>
      </div>

    

      <div className="space-y-6">
        <ComponentCard title="Consulta de Clientes">
          <ClienteTableOne />
        </ComponentCard>
      </div>

    
    </>
  );
}

