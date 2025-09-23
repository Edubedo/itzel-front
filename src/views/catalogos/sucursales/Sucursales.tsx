import React, { useState, useMemo } from 'react';
import ConsultaSucursales from './consulta/ConsultaSucursales';
import FormularioSucursales from './formulario/FormularioSucursales';

export enum BranchStatus {
  Open = 'Abierto',
  Closed = 'Cerrado',
  Maintenance = 'En Mantenimiento',
}

// Interfaz para ejecutivos/asesores que se guardarán con la sucursal
export interface Asignacion {
  usuario: string;
  area: string;
  servicio: string;
}

// Interfaz principal de la Sucursal
export interface Branch {
  id: string;
  estado: string;
  municipality: string;
  address: string;
  status: BranchStatus;
  ejecutivos?: Asignacion[]; // Opcional
  asesores?: Asignacion[];   // Opcional
}

// Datos iniciales con la nueva estructura
const datosIniciales: Branch[] = [
  { id: 'uuid-1', estado: 'Colima', municipality: 'Manzanillo', address: 'Av. Elías Zamora Verduzco #123', status: BranchStatus.Open, ejecutivos: [], asesores: [] },
  { id: 'uuid-2', estado: 'Colima', municipality: 'Colima', address: 'Blvd. Miguel de la Madrid #456', status: BranchStatus.Closed, ejecutivos: [], asesores: [] },
  { id: 'uuid-3', estado: 'Jalisco', municipality: 'Guadalajara', address: 'Av. Vallarta #789', status: BranchStatus.Open, ejecutivos: [], asesores: [] },
];

const Sucursales: React.FC = () => {
  const [sucursales, setSucursales] = useState<Branch[]>(datosIniciales);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  
  // Estados para controlar los filtros
  const [estadoFilter, setEstadoFilter] = useState('');
  const [municipioFilter, setMunicipioFilter] = useState('');
  const [domicilioSearch, setDomicilioSearch] = useState('');

  // Lógica para filtrar la lista de sucursales
  const sucursalesFiltradas = useMemo(() => {
    return sucursales.filter(s =>
      (s.estado.toLowerCase().includes(estadoFilter.toLowerCase())) &&
      (s.municipality.toLowerCase().includes(municipioFilter.toLowerCase())) &&
      (s.address.toLowerCase().includes(domicilioSearch.toLowerCase()))
    );
  }, [sucursales, estadoFilter, municipioFilter, domicilioSearch]);

  const handleSave = (formData: Omit<Branch, 'id'>) => {
    if (editingBranch) {
      setSucursales(sucursales.map(s => s.id === editingBranch.id ? { ...formData, id: s.id } : s));
    } else {
      const nuevaSucursal: Branch = { 
        ...formData, 
        id: `uuid-${Date.now()}`,
        status: BranchStatus.Open // <-- CORRECCIÓN: Asigna estado por defecto
      };
      setSucursales([...sucursales, nuevaSucursal]);
    }
    setIsFormVisible(false);
    setEditingBranch(null);
  };

  const handleDelete = (branchId: string) => {
    if (window.confirm('¿Seguro que quieres eliminar esta sucursal?')) {
      setSucursales(sucursales.filter(s => s.id !== branchId));
    }
  };

  const showForm = (branch: Branch | null) => {
    setEditingBranch(branch);
    setIsFormVisible(true);
  };

  const hideForm = () => {
    setIsFormVisible(false);
    setEditingBranch(null);
  };

  if (isFormVisible) {
    return <FormularioSucursales branchToEdit={editingBranch} onSave={handleSave} onCancel={hideForm} />;
  }

  return (
    <ConsultaSucursales
      sucursales={sucursalesFiltradas}
      onAddNew={() => showForm(null)}
      onEdit={showForm}
      onDelete={handleDelete}
      estadoFilter={estadoFilter}
      municipioFilter={municipioFilter}
      domicilioSearch={domicilioSearch}
      onEstadoChange={setEstadoFilter}
      onMunicipioChange={setMunicipioFilter}
      onDomicilioChange={setDomicilioSearch}
    />
  );
};

export default Sucursales;