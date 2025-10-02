import React, { useState, useEffect, useMemo } from 'react';
import ConsultaSucursales from './consulta/ConsultaSucursales';
import FormularioSucursales from './formulario/FormularioSucursales';
import { sucursalesService, SucursalData, SucursalFormData } from '../../../services/sucursalesService';
import { localidadesCFE } from './localidadeCFE';

const Sucursales: React.FC = () => {
  const [sucursales, setSucursales] = useState<SucursalData[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingBranch, setEditingBranch] = useState<SucursalData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para controlar los filtros
  const [estadoFilter, setEstadoFilter] = useState('');
  const [municipioFilter, setMunicipioFilter] = useState('');
  const [domicilioSearch, setDomicilioSearch] = useState('');

  // Cargar sucursales al montar el componente
  useEffect(() => {
    loadSucursales();
  }, []);

  const loadSucursales = async () => {
    try {
      setLoading(true);
      const response = await sucursalesService.getSucursales();
      if (response.success) {
        setSucursales(response.sucursales);
      }
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: SucursalFormData) => {
    try {
      if (editingBranch) {
        // Actualizar sucursal existente
        await sucursalesService.updateSucursal(editingBranch.ck_sucursal!, formData);
      } else {
        // Crear nueva sucursal
        await sucursalesService.createSucursal(formData);
      }
      
      // Recargar la lista
      await loadSucursales();
      
      // Cerrar formulario
      setIsFormVisible(false);
      setEditingBranch(null);
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
      // El error se maneja en el formulario
    }
  };

  const handleDelete = async (branchId: string) => {
    if (window.confirm('¿Seguro que quieres eliminar esta sucursal?')) {
      try {
        await sucursalesService.deleteSucursal(branchId);
        await loadSucursales(); // Recargar la lista
      } catch (error) {
        console.error('Error al eliminar sucursal:', error);
        alert('Error al eliminar la sucursal');
      }
    }
  };

  const showForm = (branch: SucursalData | null = null) => {
    setEditingBranch(branch);
    setIsFormVisible(true);
  };

  const hideForm = () => {
    setIsFormVisible(false);
    setEditingBranch(null);
  };

  if (isFormVisible) {
    return (
      <FormularioSucursales 
        branchToEdit={editingBranch} 
        onSave={handleSave} 
        onCancel={hideForm} 
      />
    );
  }

  return (
    <ConsultaSucursales
      sucursales={sucursales}
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