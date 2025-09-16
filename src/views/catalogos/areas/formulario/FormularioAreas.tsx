import React, { useEffect, useState } from 'react';
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";

// Define la interfaz para los datos del área
interface AreaData {
  c_codigo_area: string;
  s_area: string;
  s_description_area: string;
  ck_sucursal: string;
  ck_estatus: string;
}

// Define las opciones de sucursal
const sucursalesOptions = [
  { value: 'suc-001', label: 'Secured Control' },
  { value: 'suc-002', label: 'Secured Norte' },
  { value: 'suc-003', label: 'Secured Sur' }
];

function FormularioAreas() {
  const [formData, setFormData] = useState<AreaData>({
    c_codigo_area: '',
    s_area: '',
    s_description_area: '',
    ck_sucursal: '',
    ck_estatus: 'ACTIVO'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const areaId = urlParams.get('id');
      
      if (areaId) {
        setIsEditing(true);
        fetchAreaData(areaId);
      }
    }
  }, []);

  const fetchAreaData = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/catalogos/areas/getArea/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData(data.area);
      }
    } catch (error) {
      console.error('Error al cargar datos del área:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AreaData, value: string) => {
    // Validar longitud máxima para el código del área en el handler
    if (field === 'c_codigo_area' && value.length > 10) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.c_codigo_area || !formData.s_area || !formData.s_description_area || !formData.ck_sucursal) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }
    
    if (formData.c_codigo_area.length > 10) {
      alert('El código del área no puede tener más de 10 caracteres');
      return;
    }
    
    try {
      setLoading(true);
      let url: string;
      let method: string;
      
      if (isEditing && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const areaId = urlParams.get('id');
        url = `http://localhost:3001/api/catalogos/areas/updateArea/${areaId}`;
        method = 'PUT';
      } else {
        url = 'http://localhost:3001/api/catalogos/areas/createArea';
        method = 'POST';
      }
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(isEditing ? 'Área actualizada correctamente' : 'Área creada correctamente');
        if (typeof window !== 'undefined') {
          window.location.href = '/catalogos/areas/consulta/';
        }
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error al guardar el área:', error);
      alert('Error al guardar el área');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/catalogos/areas/consulta/';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={isEditing ? "Editar Área - Sistema de Turnos" : "Crear Área - Sistema de Turnos"}
        description="Formulario para gestionar áreas del sistema"
      />
      
      <PageBreadcrumb 
        pageTitle={isEditing ? "Editar Área" : "Crear Nueva Área"} 
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <ComponentCard title="Información Básica del Área">
            <div className="space-y-6">
              <div>
                <Label>Código del Área *</Label>
                <Input
                  type="text"
                  value={formData.c_codigo_area}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('c_codigo_area', e.target.value)}
                  placeholder="Ej: CONTA, RECHUM"
                />
                <p className="text-xs text-gray-500 mt-1">Máximo 10 caracteres</p>
              </div>

              <div>
                <Label>Nombre del Área *</Label>
                <Input
                  type="text"
                  value={formData.s_area}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    handleInputChange('s_area', e.target.value)}
                  placeholder="Ej: Contabilidad, Recursos Humanos"
                />
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Descripción">
            <div>
              <Label>Descripción del Área *</Label>
              <textarea
                value={formData.s_description_area}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  handleInputChange('s_description_area', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                placeholder="Describe las funciones y responsabilidades del área..."
              />
            </div>
          </ComponentCard>

          <ComponentCard title="Configuración Adicional">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Sucursal *</Label>
                <Select
                  options={sucursalesOptions}
                  placeholder="Seleccionar sucursal"
                  onChange={(value: string) => handleInputChange('ck_sucursal', value)}
                />
              </div>

              <div>
                <Label>Estado</Label>
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ck_estatus === 'ACTIVO'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('ck_estatus', e.target.checked ? 'ACTIVO' : 'INACTI')}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900">
                      {formData.ck_estatus === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </ComponentCard>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar Área' : 'Crear Área')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioAreas;