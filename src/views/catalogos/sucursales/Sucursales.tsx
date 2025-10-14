import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ConsultaSucursales from './consulta/ConsultaSucursales';
import FormularioSucursales from './formulario/FormularioSucursales';
import { sucursalesService, SucursalData, SucursalFormData } from '../../../services/sucursalesService';
import { localidadesCFE } from './localidadeCFE';

const Sucursales: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Efecto para manejar el parámetro 'id' de la URL
  useEffect(() => {
    const id = searchParams.get('id');
    if (id && sucursales.length > 0) {
      const sucursal = sucursales.find(s => s.ck_sucursal === id);
      if (sucursal) {
        showForm(sucursal);
        // Limpiar el parámetro de la URL después de cargar
        setSearchParams({});
      }
    }
  }, [searchParams, sucursales]);

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

      // Cerrar formulario después de un breve delay para que se vea el mensaje de éxito
      setTimeout(() => {
        setIsFormVisible(false);
        setEditingBranch(null);
      }, 2000);
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
      // Re-lanzar el error para que el formulario lo maneje
      throw error;
    }
  };

  const handleDelete = async (branchId: string) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta sucursal?\n\nEsta acción cambiará su estado a INACTIVO.');

    if (confirmacion) {
      try {
        const response = await sucursalesService.deleteSucursal(branchId);

        if (response.success) {
          await loadSucursales(); // Recargar la lista
          alert('✓ Sucursal eliminada exitosamente');
        } else {
          alert('⚠ ' + (response.message || 'No se pudo eliminar la sucursal'));
        }
      } catch (error: any) {
        console.error('Error completo al eliminar:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error de conexión con el servidor';
        alert('✗ Error al eliminar la sucursal:\n\n' + errorMessage);
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