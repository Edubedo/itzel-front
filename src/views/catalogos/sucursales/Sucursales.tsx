import React, { useState } from 'react';
import ConsultaSucursales from './consulta/ConsultaSucursales';
import FormularioSucursales from './formulario/FormularioSucursales';


export enum BranchStatus {
  Open = 'Abierto',
  Closed = 'Cerrado',
  Maintenance = 'En Mantenimiento',
}

export interface Branch {
  id: string;
  address: string;
  municipality: string;
  status: BranchStatus;
}


const datosIniciales: Branch[] = [
  { id: 'uuid-1', address: 'Av. Elías Zamora Verduzco #123', municipality: 'Manzanillo', status: BranchStatus.Open },
  { id: 'uuid-2', address: 'Blvd. Miguel de la Madrid #456', municipality: 'Manzanillo', status: BranchStatus.Closed },
];

const Sucursales: React.FC = () => {
  const [sucursales, setSucursales] = useState<Branch[]>(datosIniciales);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const handleSave = (formData: Omit<Branch, 'id'>) => {
    if (editingBranch) {
      setSucursales(sucursales.map(s => s.id === editingBranch.id ? { ...formData, id: s.id } : s));
    } else {
      const nuevaSucursal: Branch = { ...formData, id: `uuid-${Date.now()}` };
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

  return <ConsultaSucursales sucursales={sucursales} onAddNew={() => showForm(null)} onEdit={showForm} onDelete={handleDelete} />;
};

export default Sucursales;