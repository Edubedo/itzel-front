import React, { useEffect, useState, useRef } from 'react';
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import ComponentCard from "../../../../components/common/ComponentCard";
import Label from "../../../../components/form/Label";
import Input from "../../../../components/form/input/InputField";
import { usuariosService, UsuarioFormData, Usuario } from "../../../../services/usuariosService";
import { useAuth } from "../../../../contexts/AuthContext";
import Alert from "../../../../components/ui/alert/Alert";
import { useLanguage } from "../../../../context/LanguageContext";

function FormularioUsuarios() {
  const { t } = useLanguage();
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
      // Si es edición o no requiere verificación, redirigir inmediatamente
      if (isEditing) {
        setTimeout(() => {
          window.location.href = "/catalogos/usuarios/consulta/";
        }, 1000);
      }
      // Si es nuevo usuario, esperar más tiempo para mostrar mensaje de verificación
    }
  }, [showSuccess, isEditing]);

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
      alert(t("form.user.errorLoad") + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UsuarioFormData, value: string | number) => {
    // Validación especial para fecha de nacimiento
    if (field === 'd_fecha_nacimiento' && typeof value === 'string') {
      // Validar formato de fecha YYYY-MM-DD
      const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
      
      if (value) {
        // Si el valor tiene el formato completo, validarlo
        if (dateRegex.test(value)) {
          const year = parseInt(value.substring(0, 4), 10);
          const currentYear = new Date().getFullYear();
          
          // Validar que el año esté en un rango razonable (1900 - año actual)
          if (year < 1900 || year > currentYear) {
            return; // No actualizar si el año está fuera de rango
          }
        } else {
          // Si el usuario está escribiendo manualmente, asegurar que el año tenga máximo 4 dígitos
          const parts = value.split('-');
          if (parts[0] && parts[0].length > 4) {
            // Truncar el año a 4 dígitos
            parts[0] = parts[0].substring(0, 4);
            value = parts.join('-');
          }
          
          // No permitir más de 10 caracteres en total (YYYY-MM-DD)
          if (value.length > 10) {
            return;
          }
        }
      }
    }

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
        alert(t("form.user.errorImage"));
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert(t("form.user.errorImageSize"));
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
      newErrors.s_nombre = t("form.user.nameRequired");
    }

    if (!formData.s_correo_electronico.trim()) {
      newErrors.s_correo_electronico = t("form.user.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.s_correo_electronico)) {
      newErrors.s_correo_electronico = t("form.user.emailInvalid");
    }

    if (!isEditing && !formData.s_password?.trim()) {
      newErrors.s_password = t("form.user.passwordRequired");
    } else if (formData.s_password && formData.s_password.length < 6) {
      newErrors.s_password = t("form.user.passwordMin");
    }

    if (!formData.s_rfc.trim()) {
      newErrors.s_rfc = t("form.user.rfcRequired");
    } else if (formData.s_rfc.length !== 13) {
      newErrors.s_rfc = t("form.user.rfcLength");
    }

    if (!formData.d_fecha_nacimiento || formData.d_fecha_nacimiento === '  ') {
      newErrors.d_fecha_nacimiento = t("form.user.birthDate") + ' ' + t("form.required");
    }

    if (!formData.s_curp.trim()) {
      newErrors.s_curp = t("form.user.curpRequired");
    } else if (formData.s_curp.length !== 18) {
      newErrors.s_curp = t("form.user.curpLength");
    }

    if (!formData.s_domicilio.trim()) {
      newErrors.s_domicilio = t("form.user.addressRequired");
    }

    // Validar teléfono si se proporciona
    if (formData.s_telefono && !/^\d{10}$/.test(formData.s_telefono)) {
      newErrors.s_telefono = t("form.user.phoneInvalid");
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
        if (isEditing) {
          setSuccessMessage(t("form.user.updated"));
        } else {
          // Para nuevos usuarios con verificación de email
          setSuccessMessage(t("form.user.created"));
          
          setTimeout(() => {
            window.location.href = "/catalogos/usuarios/consulta/";
          }, 3000);
        }
      }
    } catch (error: any) {
      console.error('Error al guardar el usuario:', error);
      alert(t("form.user.errorCreate") + ': ' + error.message);
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
        <span className="ml-3 text-gray-600">{t("form.user.loading")}</span>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={isEditing ? t("form.user.edit") + " - Sistema de Turnos" : t("form.user.create") + " - Sistema de Turnos"}
        description="Formulario para gestionar usuarios del sistema"
      />

      <PageBreadcrumb
        pageTitle={isEditing ? t("form.user.edit") : t("form.user.createNew")}
      />

      {showSuccess && (
        <div ref={successRef} className="mb-8 mt-2">
          <Alert
            variant="success"
            title={t("form.success")}
            message={successMessage}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">

          {/* Información Personal */}
          <ComponentCard title={t("form.user.personalInfo")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>{t("form.user.name")} <span className="text-red-500 text-sm">*</span></Label>
                <Input
                  type="text"
                  value={formData.s_nombre}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_nombre', e.target.value)}
                  placeholder={t("form.user.namePlaceholder")}
                  className={errors.s_nombre ? 'border-red-500' : ''}
                />
                {errors.s_nombre && <p className="text-red-500 text-sm mt-1">{errors.s_nombre}</p>}
              </div>

              <div>
                <Label>{t("form.user.lastName")}</Label>
                <Input
                  type="text"
                  value={formData.s_apellido_paterno}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_apellido_paterno', e.target.value)}
                  placeholder={t("form.user.lastNamePlaceholder")}
                />
              </div>

              <div>
                <Label>{t("form.user.motherLastName")}</Label>
                <Input
                  type="text"
                  value={formData.s_apellido_materno}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_apellido_materno', e.target.value)}
                  placeholder={t("form.user.motherLastNamePlaceholder")}
                />
              </div>

              <div>
                <Label>{t("form.user.birthDate")} <span className="text-red-500 text-sm">*</span></Label>
                <Input
                  type="date"
                  value={formData.d_fecha_nacimiento}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let value = e.target.value;
                    // Asegurar que el año tenga máximo 4 dígitos
                    if (value) {
                      const parts = value.split('-');
                      if (parts[0] && parts[0].length > 4) {
                        parts[0] = parts[0].substring(0, 4);
                        value = parts.join('-');
                        e.target.value = value;
                      }
                    }
                    handleInputChange('d_fecha_nacimiento', value);
                  }}
                  min="1900-01-01"
                  max={new Date().toISOString().split('T')[0]}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    // Prevenir entrada manual de más de 4 dígitos en el año
                    const input = e.currentTarget;
                    const cursorPosition = input.selectionStart || 0;
                    const currentValue = input.value || '';
                    
                    // Si está escribiendo en la posición del año (primeros 4 caracteres)
                    if (cursorPosition <= 4 && e.key.match(/\d/)) {
                      const yearPart = currentValue.substring(0, 4).replace(/\D/g, '');
                      // Si ya hay 4 dígitos en el año y está intentando escribir más, prevenir
                      if (yearPart.length >= 4 && cursorPosition <= 4) {
                        e.preventDefault();
                      }
                    }
                  }}
                />
              </div>

              <div>
                <Label>{t("form.user.phone")}</Label>
                <input
                  type="tel"
                  value={formData.s_telefono}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_telefono', e.target.value)}
                  placeholder={t("form.user.phonePlaceholder")}
                  maxLength={10}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.s_telefono ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.s_telefono && <p className="text-red-500 text-sm mt-1">{errors.s_telefono}</p>}
              </div>
            </div>
          </ComponentCard>

          {/* Información de Contacto y Acceso */}
          <ComponentCard title={t("form.user.contactInfo")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>{t("form.user.email")} <span className="text-red-500 text-sm">*</span></Label>
                <Input
                  type="email"
                  value={formData.s_correo_electronico}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_correo_electronico', e.target.value)}
                  placeholder={t("form.user.emailPlaceholder")}
                  className={errors.s_correo_electronico ? 'border-red-500' : ''}
                />
                {errors.s_correo_electronico && <p className="text-red-500 text-sm mt-1">{errors.s_correo_electronico}</p>}
              </div>

              <div>
                <Label>{isEditing ? t("form.user.newPassword") : t("form.user.password") + ' *'}</Label>
                <Input
                  type="password"
                  value={formData.s_password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_password', e.target.value)}
                  placeholder={isEditing ? t("form.user.passwordPlaceholderEdit") : t("form.user.passwordPlaceholder")}
                  className={errors.s_password ? 'border-red-500' : ''}
                />
                {errors.s_password && <p className="text-red-500 text-sm mt-1">{errors.s_password}</p>}
              </div>
            </div>
          </ComponentCard>

          {/* Información Oficial */}
          <ComponentCard title={t("form.user.officialInfo")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>{t("form.user.rfc")} <span className="text-red-500 text-sm">*</span></Label>
                <input
                  type="text"
                  value={formData.s_rfc}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_rfc', e.target.value.toUpperCase())}
                  placeholder={t("form.user.rfcPlaceholder")}
                  maxLength={13}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.s_rfc ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.s_rfc && <p className="text-red-500 text-sm mt-1">{errors.s_rfc}</p>}
              </div>

              <div>
                <Label>{t("form.user.curp")} <span className="text-red-500 text-sm">*</span></Label>
                <input
                  type="text"
                  value={formData.s_curp}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('s_curp', e.target.value.toUpperCase())}
                  placeholder={t("form.user.curpPlaceholder")}
                  maxLength={18}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${errors.s_curp ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.s_curp && <p className="text-red-500 text-sm mt-1">{errors.s_curp}</p>}
              </div>
            </div>

            <div className="mt-6">
              <Label>{t("form.user.address")} <span className="text-red-500 text-sm">*</span></Label>
              <textarea
                value={formData.s_domicilio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('s_domicilio', e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-vertical ${errors.s_domicilio ? 'border-red-500' : 'border-gray-300'}`}
                placeholder={t("form.user.addressPlaceholder")}
              />
              {errors.s_domicilio && <p className="text-red-500 text-sm mt-1">{errors.s_domicilio}</p>}
            </div>
          </ComponentCard>

          {/* Foto de Perfil */}
          <ComponentCard title={t("form.user.profilePhoto")}>
            <div className="space-y-4">
              <div>
                <Label>{t("form.user.selectImage")}</Label>
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
          <ComponentCard title={t("form.user.systemConfig")}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(user?.tipo_usuario === 1 || isEditing) && (
                <div>
                  <Label>{t("form.user.userType")}</Label>
                  <select
                    value={formData.i_tipo_usuario}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleInputChange('i_tipo_usuario', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    disabled={user?.tipo_usuario !== 1}
                  >
                    <option value={3}>{t("userType.advisor")}</option>
                    <option value={2}>{t("userType.executive")}</option>
                    {user?.tipo_usuario === 1 && (
                      <option value={1}>{t("userType.administrator")}</option>
                    )}
                  </select>
                </div>
              )}

              <div>
                <Label>{t("form.user.status")}</Label>
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
                      {formData.ck_estatus === 'ACTIVO' ? t("form.user.active") : t("form.user.inactive")}
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
              {t("form.cancel")}
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {loading ? t("form.saving") : (isEditing ? t("form.user.update") : t("form.user.create"))}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FormularioUsuarios;