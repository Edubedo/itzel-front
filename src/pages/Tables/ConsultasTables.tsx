import React from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ClienteTableOne from "../../components/tables/BasicTables/ClientesTableOne";

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


const clientesData: Area[] = [
  { id: 1, ck_area: "550e...", c_codigo_area: "Juan Perez", s_area: "Facturación", s_description_area: "Activo", ck_estatus: "Ultima Compra: 15/07/2025", ck_sucursal: "suc-001" },
  { id: 2, ck_area: "550e...", c_codigo_area: "Maria Lopez", s_area: "Ventas", s_description_area: "Pendiente", ck_estatus: "Ultima Compra: 10/07/2025", ck_sucursal: "suc-002" },
  { id: 3, ck_area: "550e...", c_codigo_area: "Carlos Gomez", s_area: "Cobranza", s_description_area: "Activo", ck_estatus: "Ultima Compra: 20/07/2025", ck_sucursal: "suc-003" },
];

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

      <div className="space-y-6">
        <ComponentCard title="Consulta de Clientes">
          <ClienteTableOne data={clientesData} />
        </ComponentCard>
      </div>
    </>
  );
}
