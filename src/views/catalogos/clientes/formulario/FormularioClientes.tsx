import React, { useEffect, useState } from 'react';
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import { clientesService, Cliente } from '../../../../services/clientesService';
import Alert from "../../../../components/ui/alert/Alert";

function FormularioClientes() {
  const [formData, setFormData] = useState<Omit<Cliente, 'ck_cliente'>>({
    c_codigo_cliente: '',
    s_nombre: '',
    s_apellido_paterno: '',
    s_apellido_materno: '',
    s_tipo_contrato: '',
    s_domicilio: '',
    s_description_cliente: '',
    l_cliente_premium: false,
    ck_estatus: 'ACTIVO',
    c_codigo_contrato: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Omit<Cliente, 'ck_cliente'>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [notFound, setNotFound] = useState(false);

  // Cargar datos si es edición
  useEffect(() => {
    const initializeForm = async () => {
      setInitialLoading(true);
      try {
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const clienteId = urlParams.get('id');
          if (clienteId) {
            setIsEditing(true);
            const response = await clientesService.getClienteById(clienteId);
            if (response.success && response.data) {
              setFormData({
                c_codigo_cliente: response.data.c_codigo_cliente || '',
                s_nombre: response.data.s_nombre || '',
                s_apellido_paterno: response.data.s_apellido_paterno || '',
                s_apellido_materno: response.data.s_apellido_materno || '',
                s_tipo_contrato: response.data.s_tipo_contrato || '',
                s_domicilio: response.data.s_domicilio || '',
                s_description_cliente: response.data.s_description_cliente || '',
                l_cliente_premium: !!response.data.l_cliente_premium,
                ck_estatus: response.data.ck_estatus || 'ACTIVO',
                c_codigo_contrato: response.data.c_codigo_contrato || ''
              });
            } else {
              setNotFound(true);
            }
          }
        }
      } catch (error) {
        setNotFound(true);
      } finally {
        setInitialLoading(false);
      }
    };
    initializeForm();
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Omit<Cliente, 'ck_cliente'>> = {};
    if (!formData.c_codigo_cliente.trim()) {
      newErrors.c_codigo_cliente = 'El código del cliente es obligatorio';
    } else if (!/^[A-Z0-9]{6}$/.test(formData.c_codigo_cliente.trim())) {
      newErrors.c_codigo_cliente = 'El código debe ser alfanumérico y tener exactamente 6 caracteres';
    }
    if (!formData.s_nombre.trim()) {
      newErrors.s_nombre = 'El nombre es obligatorio';
    }
    if (!formData.s_apellido_paterno.trim()) {
      newErrors.s_apellido_paterno = 'El apellido paterno es obligatorio';
    }
    if (!formData.s_domicilio.trim()) {
      newErrors.s_domicilio = 'El domicilio es obligatorio';
    }
    if (!formData.s_tipo_contrato.trim()) {
      newErrors.s_tipo_contrato = 'El tipo de contrato es obligatorio';
    }
    if (!formData.c_codigo_contrato || !formData.c_codigo_contrato.trim()) {
      newErrors.c_codigo_contrato = 'El código de contrato es obligatorio';
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
    setLoading(true);
    try {
      let response;
      if (isEditing && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const clienteId = urlParams.get('id');
        if (clienteId) {
          response = await clientesService.updateCliente(clienteId, formData);
          if (response?.success) {
            setShowSuccess(true);
            setSuccessMessage('Cliente actualizado correctamente');
            setTimeout(() => {
              window.location.href = '/catalogos/clientes/consulta/';
            }, 1800);
          } else {
            alert(response?.message || 'Error al guardar cliente');
          }
        }
      } else {
        response = await clientesService.createCliente(formData);
        if (response?.success) {
          setShowSuccess(true);
          setSuccessMessage('Cliente creado correctamente');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setTimeout(() => {
            window.location.href = '/catalogos/clientes/consulta/';
          }, 3000);
        } else {
          alert(response?.message || 'Error al guardar cliente');
        }
      }
    } catch (error: any) {
      alert('Error al guardar el cliente: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/catalogos/clientes/consulta/';
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando formulario...</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-xl text-red-500 font-bold mb-4">😅 Eso no existe</span>
        <button
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => window.location.href = '/catalogos/clientes/consulta/'}
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={isEditing ? "Editar Cliente - Sistema de Turnos" : "Crear Cliente - Sistema de Turnos"}
        description="Formulario para gestionar clientes del sistema"
      />
      <PageBreadcrumb pageTitle={isEditing ? "Editar Cliente" : "Crear Nuevo Cliente"} />
      {showSuccess && (
        <div className="mb-8 mt-2">
          <Alert
            variant="success"
            title="¡Operación exitosa!"
            message={successMessage}
          />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <ComponentCard title="Información del Cliente">
            <div className="space-y-6">
              <div>
                <Label>Código del Cliente *</Label>
                <Input
                  type="text"
                  value={formData.c_codigo_cliente}
                  onChange={e => {
                    const upper = e.target.value.toUpperCase();
                    const sanitized = upper.replace(/[^A-Z0-9]/g, '').slice(0, 6);
                    handleInputChange('c_codigo_cliente', sanitized);
                  }}
                  placeholder="Ej: CL001"
                  className={errors.c_codigo_cliente ? 'border-red-500' : ''}
                />
                {errors.c_codigo_cliente && (
                  <p className="text-red-500 text-sm mt-1">{errors.c_codigo_cliente}</p>
                )}
              </div>
              <div>
                <Label>Nombre *</Label>
                <Input
                  type="text"
                  value={formData.s_nombre}
                  onChange={e => handleInputChange('s_nombre', e.target.value)}
                  placeholder="Nombre"
                  className={errors.s_nombre ? 'border-red-500' : ''}
                />
                {errors.s_nombre && (
                  <p className="text-red-500 text-sm mt-1">{errors.s_nombre}</p>
                )}
              </div>
              <div>
                <Label>Apellido Paterno *</Label>
                <Input
                  type="text"
                  value={formData.s_apellido_paterno}
                  onChange={e => handleInputChange('s_apellido_paterno', e.target.value)}
                  placeholder="Apellido paterno"
                  className={errors.s_apellido_paterno ? 'border-red-500' : ''}
                />
                {errors.s_apellido_paterno && (
                  <p className="text-red-500 text-sm mt-1">{errors.s_apellido_paterno}</p>
                )}
              </div>
              <div>
                <Label>Apellido Materno</Label>
                <Input
                  type="text"
                  value={formData.s_apellido_materno}
                  onChange={e => handleInputChange('s_apellido_materno', e.target.value)}
                  placeholder="Apellido materno"
                />
              </div>
              <div>
                <Label>Domicilio *</Label>
                <Input
                  type="text"
                  value={formData.s_domicilio}
                  onChange={e => handleInputChange('s_domicilio', e.target.value)}
                  placeholder="Domicilio"
                  className={errors.s_domicilio ? 'border-red-500' : ''}
                />
                {errors.s_domicilio && (
                  <p className="text-red-500 text-sm mt-1">{errors.s_domicilio}</p>
                )}
              </div>
            </div>
          </ComponentCard>
          <ComponentCard title="Información Adicional">
            <div>
              <Label>Tipo de Contrato *</Label>
              <select
                value={formData.s_tipo_contrato}
                onChange={e => handleInputChange('s_tipo_contrato', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.s_tipo_contrato ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="" disabled hidden>Selecciona una opción</option>
                <option value="MONOFÁSICA">Monofásica</option>
                <option value="BIFÁSICA">Bifásica</option>
                <option value="TRIFÁSICA">Trifásica</option>
                {/* Agrega más opciones si lo necesitas */}
              </select>
              {errors.s_tipo_contrato && (
                <p className="text-red-500 text-sm mt-1">{errors.s_tipo_contrato}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Cliente Premium</Label>
                <input
                  type="checkbox"
                  checked={formData.l_cliente_premium}
                  onChange={e => handleInputChange('l_cliente_premium', e.target.checked)}
                  className="mr-2"
                />
                <span>{formData.l_cliente_premium ? 'Sí' : 'No'}</span>
              </div>
              <div>
                <Label>Estado</Label>
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${formData.ck_estatus === 'ACTIVO' ? 'bg-blue-600' : 'bg-gray-300'}`}
                    onClick={() =>
                      handleInputChange('ck_estatus', formData.ck_estatus === 'ACTIVO' ? 'INACTI' : 'ACTIVO')
                    }
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${formData.ck_estatus === 'ACTIVO' ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                  <span className="ml-3 text-sm">
                    {formData.ck_estatus === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              <div>
                <Label>Código de Contrato *</Label>
                <Input
                  type="text"
                  value={formData.c_codigo_contrato}
                  onChange={e => handleInputChange('c_codigo_contrato', e.target.value)}
                  placeholder="Número de teléfono"
                  className={errors.c_codigo_contrato ? 'border-red-500' : ''}
                />
                {errors.c_codigo_contrato && (
                  <p className="text-red-500 text-sm mt-1">{errors.c_codigo_contrato}</p>
                )}
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
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar Cliente' : 'Crear Cliente')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioClientes;