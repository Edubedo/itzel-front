import React, { useEffect, useState, useRef } from 'react';
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import { usuariosService, UsuarioFormData, Usuario } from "../../../../services/usuariosService";
import { useAuth } from "../../../../contexts/AuthContext";
import Alert from "../../../../components/ui/alert/Alert"; // Importa el componente de alerta

function FormularioUsuarios() {
  const [formData, setFormData] = useState<UsuarioFormData>({
    s_nombre: '',
    s_apellido_paterno: '',
    s_apellido_materno: '',
    s_correo_electronico: '',
    s_telefono: '',
    s_password: '',
    i_tipo_usuario: 3,
    ck_estatus: 'ACTIVO',
    d_fecha_nacimiento: '',
    s_rfc: '',
    s_curp: '',
    s_domicilio: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useAuth();

  // Warning/Success states
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showSuccess) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        window.location.href = "/catalogos/usuarios/consulta/";
      }, 1000);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const usuarioId = urlParams.get('id');

      if (usuarioId) {
        setIsEditing(true);
        fetchUsuarioData(usuarioId);
      }
    }
  }, []);

  const fetchUsuarioData = async (id: string) => {
    try {
      setLoading(true);
      const response = await usuariosService.getUsuarioById(id);

      if (response.success) {
        const usuario: Usuario = response.data;
        setFormData({
          s_nombre: usuario.s_nombre,
          s_apellido_paterno: usuario.s_apellido_paterno || '',
          s_apellido_materno: usuario.s_apellido_materno || '',
          s_correo_electronico: usuario.s_correo_electronico,
          s_telefono: usuario.s_telefono || '',
          s_password: '', // No mostrar contraseña por seguridad
          i_tipo_usuario: usuario.i_tipo_usuario,
          ck_estatus: usuario.ck_estatus,
          d_fecha_nacimiento: usuario.d_fecha_nacimiento ?
            new Date(usuario.d_fecha_nacimiento).toISOString().split('T')[0] : '',
          s_rfc: usuario.s_rfc || '',
          s_curp: usuario.s_curp || '',
          s_domicilio: usuario.s_domicilio || ''
        });

        // Mostrar imagen actual si existe
        if (usuario.s_foto) {
          setImagePreview(usuariosService.getImageUrl(usuario.s_foto));
        }
      }
    } catch (error: any) {
      console.error('Error al cargar datos del usuario:', error);
      alert('Error al cargar datos del usuario: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UsuarioFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen válido');
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede ser mayor a 5MB');
        return;
      }

      setImageFile(file);

      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('imagen') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validaciones requeridas
    if (!formData.s_nombre.trim()) {
      newErrors.s_nombre = 'El nombre es requerido';
    }

    if (!formData.s_correo_electronico.trim()) {
      newErrors.s_correo_electronico = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.s_correo_electronico)) {
      newErrors.s_correo_electronico = 'Formato de correo electrónico inválido';
    }

    if (!isEditing && !formData.s_password?.trim()) {
      newErrors.s_password = 'La contraseña es requerida para usuarios nuevos';
    } else if (formData.s_password && formData.s_password.length < 6) {
      newErrors.s_password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.s_rfc.trim()) {
      newErrors.s_rfc = 'El RFC es requerido';
    } else if (formData.s_rfc.length !== 13) {
      newErrors.s_rfc = 'El RFC debe tener exactamente 13 caracteres';
    }

    if (!formData.d_fecha_nacimiento || formData.d_fecha_nacimiento === '  ') {
      newErrors.d_fecha_nacimiento = 'La fecha de nacimiento es requerida';
    }

    if (!formData.s_curp.trim()) {
      newErrors.s_curp = 'El CURP es requerido';
    } else if (formData.s_curp.length !== 18) {
      newErrors.s_curp = 'El CURP debe tener exactamente 18 caracteres';
    }

    if (!formData.s_domicilio.trim()) {
      newErrors.s_domicilio = 'El domicilio es requerido';
    }

    // Validar teléfono si se proporciona
    if (formData.s_telefono && !/^\d{10}$/.test(formData.s_telefono)) {
      newErrors.s_telefono = 'El teléfono debe tener 10 dígitos';
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

      const submitData: UsuarioFormData = {
        ...formData,
        s_foto: imageFile || undefined
      };

      let response;
      if (isEditing && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const usuarioId = urlParams.get('id');
        response = await usuariosService.updateUsuario(usuarioId!, submitData);
      } else {
        response = await usuariosService.createUsuario(submitData);
      }

      if (response.success) {
        setShowSuccess(true);
        setSuccessMessage(isEditing ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
      }
    } catch (error: any) {
      console.error('Error al guardar el usuario:', error);
      alert('Error al guardar el usuario: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/catalogos/usuarios/consulta/';
    }
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando datos del usuario...</span>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={isEditing ? "Editar Usuario - Sistema de Turnos" : "Crear Usuario - Sistema de Turnos"}
        description="Formulario para gestionar usuarios del sistema"
      />

      <PageBreadcrumb
        pageTitle={isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
      />

      {showSuccess && (
        <div ref={successRef} className="mb-8 mt-2">
          <Alert
            variant="success"
            title="¡Operación exitosa!"
            message={successMessage}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">

          {/* Información Personal */}
          <ComponentCard title="Información Personal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Nombre <span className="text-red-500 text-sm">*</span></Label>
                <Input
                  type="text"
                  value={formData.s_nombre}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_nombre', e.target.value)}
                  placeholder="Nombre del usuario"
                  className={errors.s_nombre ? 'border-red-500' : ''}
                />
                {errors.s_nombre && <p className="text-red-500 text-sm mt-1">{errors.s_nombre}</p>}
              </div>

              <div>
                <Label>Apellido Paterno</Label>
                <Input
                  type="text"
                  value={formData.s_apellido_paterno}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_apellido_paterno', e.target.value)}
                  placeholder="Apellido paterno"
                />
              </div>

              <div>
                <Label>Apellido Materno</Label>
                <Input
                  type="text"
                  value={formData.s_apellido_materno}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_apellido_materno', e.target.value)}
                  placeholder="Apellido materno"
                />
              </div>

              <div>
                <Label>Fecha de Nacimiento <span className="text-red-500 text-sm">*</span></Label>
                <Input
                  type="date"
                  value={formData.d_fecha_nacimiento}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('d_fecha_nacimiento', e.target.value)}
                />
              </div>

              <div>
                <Label>Teléfono</Label>
                <input
                  type="tel"
                  value={formData.s_telefono}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_telefono', e.target.value)}
                  placeholder="10 dígitos"
                  maxLength={10}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.s_telefono ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.s_telefono && <p className="text-red-500 text-sm mt-1">{errors.s_telefono}</p>}
              </div>
            </div>
          </ComponentCard>

          {/* Información de Contacto y Acceso */}
          <ComponentCard title="Información de Contacto y Acceso">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Correo Electrónico <span className="text-red-500 text-sm">*</span></Label>
                <Input
                  type="email"
                  value={formData.s_correo_electronico}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_correo_electronico', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={errors.s_correo_electronico ? 'border-red-500' : ''}
                />
                {errors.s_correo_electronico && <p className="text-red-500 text-sm mt-1">{errors.s_correo_electronico}</p>}
              </div>

              <div>
                <Label>{isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}</Label>
                <Input
                  type="password"
                  value={formData.s_password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_password', e.target.value)}
                  placeholder={isEditing ? 'Dejar en blanco para mantener actual' : 'Mínimo 6 caracteres'}
                  className={errors.s_password ? 'border-red-500' : ''}
                />
                {errors.s_password && <p className="text-red-500 text-sm mt-1">{errors.s_password}</p>}
              </div>
            </div>
          </ComponentCard>

          {/* Información Oficial */}
          <ComponentCard title="Información Oficial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>RFC <span className="text-red-500 text-sm">*</span></Label>
                <input
                  type="text"
                  value={formData.s_rfc}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_rfc', e.target.value.toUpperCase())}
                  placeholder="13 caracteres"
                  maxLength={13}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.s_rfc ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.s_rfc && <p className="text-red-500 text-sm mt-1">{errors.s_rfc}</p>}
              </div>

              <div>
                <Label>CURP <span className="text-red-500 text-sm">*</span></Label>
                <input
                  type="text"
                  value={formData.s_curp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_curp', e.target.value.toUpperCase())}
                  placeholder="18 caracteres"
                  maxLength={18}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.s_curp ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.s_curp && <p className="text-red-500 text-sm mt-1">{errors.s_curp}</p>}
              </div>
            </div>

            <div className="mt-6">
              <Label>Domicilio <span className="text-red-500 text-sm">*</span></Label>
              <textarea
                value={formData.s_domicilio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('s_domicilio', e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-vertical ${errors.s_domicilio ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Dirección completa del usuario..."
              />
              {errors.s_domicilio && <p className="text-red-500 text-sm mt-1">{errors.s_domicilio}</p>}
            </div>
          </ComponentCard>

          {/* Foto de Perfil */}
          <ComponentCard title="Foto de Perfil">
            <div className="space-y-4">
              <div>
                <Label>Seleccionar Imagen</Label>
                <input
                  id="imagen"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 5MB</p>
              </div>

              {imagePreview && (
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Vista previa de la imagen</p>
                    <p className="text-xs text-gray-500">Haga clic en la × para remover</p>
                  </div>
                </div>
              )}
            </div>
          </ComponentCard>

          {/* Configuración del Sistema */}
          <ComponentCard title="Configuración del Sistema">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(user?.tipo_usuario === 1 || isEditing) && (
                <div>
                  <Label>Tipo de Usuario</Label>
                  <select
                    value={formData.i_tipo_usuario}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleInputChange('i_tipo_usuario', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={user?.tipo_usuario !== 1}
                  >
                    <option value={3}>Asesor</option>
                    <option value={2}>Ejecutivo</option>
                    {user?.tipo_usuario === 1 && (
                      <option value={1}>Administrador</option>
                    )}
                  </select>
                </div>
              )}

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

          {/* Botones de acción */}
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {loading ? 'Guardando...' : (isEditing ? 'Actualizar Usuario' : 'Crear Usuario')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioUsuarios;