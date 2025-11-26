import React, { useEffect, useState } from 'react';
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import Select from "../../../../components/form/Select";
import { areasService, AreaFormData, Sucursal } from '../../../../services/areasService';
import Alert from "../../../../components/ui/alert/Alert";
import { useLanguage } from "../../../../context/LanguageContext";

function FormularioAreas() {
  const { t } = useLanguage();
  
  // Define las opciones de estado con traducciones
  const estatusOptions = [
    { value: 'ACTIVO', label: t("form.area.active") },
    { value: 'INACTI', label: t("form.area.inactive") }
  ];
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
        alert(t("form.area.errorInitial"));
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
      alert(t("form.area.errorLoad"));
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
      newErrors.c_codigo_area = t("form.area.codeRequired");
    } else if (formData.c_codigo_area.length > 6) {
      newErrors.c_codigo_area = t("form.area.codeMaxLength");
    }

    if (!formData.s_area.trim()) {
      newErrors.s_area = t("form.area.nameRequired");
    }

    if (!formData.s_descripcion_area.trim()) {
      newErrors.s_descripcion_area = t("form.area.descriptionRequired");
    }

    if (!formData.ck_sucursal) {
      newErrors.ck_sucursal = t("form.area.branchRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert(t("form.correctErrors"));
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
            setSuccessMessage(t("form.area.updated"));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
              window.location.href = '/catalogos/areas/consulta/';
            }, 1300); 
          } else {
            alert(response.message || t("form.area.errorUpdate"));
          }
        }
      } else {
        response = await areasService.createArea(formData);
        if (response.success) {
          setShowSuccess(true);
          setSuccessMessage(t("form.area.created"));
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            window.location.href = '/catalogos/areas/consulta/';
          }, 1300);
        } else {
          alert(response.message || t("form.area.errorCreate"));
        }
      }
    } catch (error: any) {
      console.error('Error al guardar el área:', error);
      alert(t("form.area.errorCreate") + ': ' + (error.message || 'Error desconocido'));
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
        <span className="ml-3 text-gray-600">{t("form.area.loading")}</span>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={isEditing ? t("form.area.edit") + " - Sistema de Turnos" : t("form.area.create") + " - Sistema de Turnos"}
        description="Formulario para gestionar áreas del sistema"
      />

      <PageBreadcrumb
        pageTitle={isEditing ? t("form.area.edit") : t("form.area.createNew")}
      />
      {showSuccess && (
        <div className="mb-8 mt-2">
          <Alert
            variant="success"
            title={t("form.success")}
            message={successMessage}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 gap-6">
          <ComponentCard title={t("form.area.title")}>
            <div className="space-y-6">
              <div>
                <Label>{t("form.area.code")} *</Label>
                <Input
                  type="text"
                  value={formData.c_codigo_area}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('c_codigo_area', e.target.value.toUpperCase())}
                  placeholder={t("form.area.codePlaceholder")}
                  className={errors.c_codigo_area ? 'border-red-500' : ''}
                />
                {errors.c_codigo_area && (
                  <p className="text-red-500 text-sm mt-1">{errors.c_codigo_area}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{t("form.area.codeMax")}</p>
              </div>

              <div>
                <Label>{t("form.area.name")} *</Label>
                <Input
                  type="text"
                  value={formData.s_area}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_area', e.target.value)}
                  placeholder={t("form.area.namePlaceholder")}
                  className={errors.s_area ? 'border-red-500' : ''}
                />
                {errors.s_area && (
                  <p className="text-red-500 text-sm mt-1">{errors.s_area}</p>
                )}
              </div>

            </div>
            <div>
              <Label>{t("form.area.description")} *</Label>
              <textarea
                value={formData.s_descripcion_area}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('s_descripcion_area', e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-vertical ${errors.s_descripcion_area ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder={t("form.area.descriptionPlaceholder")}
              />
              {errors.s_descripcion_area && (
                <p className="text-red-500 text-sm mt-1">{errors.s_descripcion_area}</p>
              )}
            </div>
          </ComponentCard>

          <ComponentCard title={t("form.area.additionalConfig")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>{t("form.area.branch")} *</Label>
                {/* REEMPLAZAR Select por select nativo para evitar errores */}
                <select
                  value={formData.ck_sucursal}
                  onChange={(e) => handleInputChange('ck_sucursal', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.ck_sucursal ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="" disabled hidden>{t("form.area.selectBranch")}</option>
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
                <Label>{t("form.area.status")}</Label>
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
                      {formData.ck_estatus === 'ACTIVO' ? t("form.area.active") : t("form.area.inactive")}
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
              {t("form.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? t("form.saving") : (isEditing ? t("form.area.update") : t("form.area.create"))}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioAreas;