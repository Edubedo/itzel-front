import React, { useEffect, useState } from 'react';
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import { areasService, AreaFormData, Sucursal } from '../../../../services/areasService';
import Alert from "../../../../components/ui/alert/Alert";

// Define las opciones de estado
const estatusOptions = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTI', label: 'Inactivo' }
];

function FormularioAreas() {
  const [formData, setFormData] = useState<AreaFormData>({
    c_codigo_area: '',
    s_area: '',
    s_descripcion_area: '',
    ck_sucursal: '',
    ck_estatus: 'ACTIVO'
  });

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<AreaFormData>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setInitialLoading(true);

        // Cargar sucursales
        const sucursalesResponse = await areasService.getSucursales();
        if (sucursalesResponse.success) {
          setSucursales(sucursalesResponse.data);
        }

        // Verificar si estamos editando
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const areaId = urlParams.get('id');

          if (areaId) {
            setIsEditing(true);
            await fetchAreaData(areaId);
          }
        }
      } catch (error) {
        console.error('Error al inicializar formulario:', error);
        alert('Error al cargar los datos iniciales');
      } finally {
        setInitialLoading(false);
      }
    };

    initializeForm();
  }, []);

  const fetchAreaData = async (id: string) => {
    try {
      const response = await areasService.getAreaById(id);

      if (response.success && response.data) {
        console.log('Datos recibidos del backend:', response.data);
        console.log('Estado original:', `"${response.data.ck_estatus}"`);
        console.log('Longitud del estado:', response.data.ck_estatus?.length);
        
        // Limpiar espacios en blanco del estado
        const estatusLimpio = response.data.ck_estatus?.trim() || 'ACTIVO';
        console.log('Estado limpio:', `"${estatusLimpio}"`);
        
        // Mapear los datos del backend al formato del formulario
        setFormData({
          c_codigo_area: response.data.c_codigo_area || '',
          s_area: response.data.s_area || '',
          s_descripcion_area: response.data.s_descripcion_area || '',
          ck_sucursal: response.data.ck_sucursal || '',
          ck_estatus: estatusLimpio
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del área:', error);
      alert('Error al cargar los datos del área');
    }
  };

  const handleInputChange = (field: keyof AreaFormData, value: string) => {
    // Validar longitud máxima para el código del área
    if (field === 'c_codigo_area' && value.length > 6) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Partial<AreaFormData> = {};

    if (!formData.c_codigo_area.trim()) {
      newErrors.c_codigo_area = 'El código del área es obligatorio';
    } else if (formData.c_codigo_area.length > 6) {
      newErrors.c_codigo_area = 'El código no puede tener más de 6 caracteres';
    }

    if (!formData.s_area.trim()) {
      newErrors.s_area = 'El nombre del área es obligatorio';
    }

    if (!formData.s_descripcion_area.trim()) {
      newErrors.s_descripcion_area = 'La descripción del área es obligatoria';
    }

    if (!formData.ck_sucursal) {
      newErrors.ck_sucursal = 'Debe seleccionar una sucursal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      setLoading(true);

      let response;
      if (isEditing && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const areaId = urlParams.get('id');

        if (areaId) {
          response = await areasService.updateArea(areaId, formData);
          if (response.success) {
            setShowSuccess(true);
            setSuccessMessage('Área actualizada correctamente');
            setTimeout(() => {
              window.location.href = '/catalogos/areas/consulta/';
            }, 1800);
          } else {
            alert(response.message || 'Error al actualizar área');
          }
        }
      } else {
        response = await areasService.createArea(formData);
        if (response.success) {
          setShowSuccess(true);
          setSuccessMessage('Área creada correctamente');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            window.location.href = '/catalogos/areas/consulta/';
          }, 3000);
        } else {
          alert(response.message || 'Error al crear área');
        }
      }
    } catch (error: any) {
      console.error('Error al guardar el área:', error);
      alert('Error al guardar el área: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/catalogos/areas/consulta/';
    }
  };

  // Preparar opciones de sucursales para el Select
  const sucursalesOptions = sucursales.map(sucursal => ({
    value: sucursal.ck_sucursal,
    label: sucursal.s_nombre_sucursal
  }));

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando formulario...</span>
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
      {showSuccess && (
        <div className="mb-8 mt-2">
          <Alert
            variant="success"
            title="¡Operación exitosa!"
            message={successMessage}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 gap-6">
          <ComponentCard title="Información del Área">
            <div className="space-y-6">
              <div>
                <Label>Código del Área *</Label>
                <Input
                  type="text"
                  value={formData.c_codigo_area}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('c_codigo_area', e.target.value.toUpperCase())}
                  placeholder="Ej: CONTA, RECHUM"
                  className={errors.c_codigo_area ? 'border-red-500' : ''}
                />
                {errors.c_codigo_area && (
                  <p className="text-red-500 text-sm mt-1">{errors.c_codigo_area}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Máximo 6 caracteres</p>
              </div>

              <div>
                <Label>Nombre del Área *</Label>
                <Input
                  type="text"
                  value={formData.s_area}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_area', e.target.value)}
                  placeholder="Ej: Contabilidad, Recursos Humanos"
                  className={errors.s_area ? 'border-red-500' : ''}
                />
                {errors.s_area && (
                  <p className="text-red-500 text-sm mt-1">{errors.s_area}</p>
                )}
              </div>

            </div>
            <div>
              <Label>Descripción del Área *</Label>
              <textarea
                value={formData.s_descripcion_area}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('s_descripcion_area', e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-vertical ${errors.s_descripcion_area ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Describe las funciones y responsabilidades del área..."
              />
              {errors.s_descripcion_area && (
                <p className="text-red-500 text-sm mt-1">{errors.s_descripcion_area}</p>
              )}
            </div>
          </ComponentCard>

          <ComponentCard title="Configuración Adicional">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Sucursal *</Label>
                {/* REEMPLAZAR Select por select nativo para evitar errores */}
                <select
                  value={formData.ck_sucursal}
                  onChange={(e) => handleInputChange('ck_sucursal', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.ck_sucursal ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="" disabled hidden>Selecciona una sucursal</option>
                  {sucursalesOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.ck_sucursal && (
                  <p className="text-red-500 text-sm mt-1">{errors.ck_sucursal}</p>
                )}
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