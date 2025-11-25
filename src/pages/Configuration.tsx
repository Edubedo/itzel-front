import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import { useState, useEffect } from "react";
import { getConfiguracion, updateConfiguracion } from "../services/configuracionService";
import { useLogo } from "../contexts/LogoContext";
import Alert from "../components/ui/alert/Alert";
import { useLanguage } from "../context/LanguageContext";

export default function Configuration() {
  const [systemConfig, setSystemConfig] = useState({
    ck_sistema: "", // UUID de la BD
    ck_estatus: "ACTIVO",
    s_nombre_empresa: "CFE",
    s_logo_light: "",
    s_logo_dark: "",
    s_nombre_sistema: "Sistema de Turnos"
  });

  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { setLogoLight, setLogoDark } = useLogo();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { t } = useLanguage();


  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const data = await getConfiguracion();
      console.log('Datos cargados desde BD:', data);

      setSystemConfig(prev => ({
        ...prev,
        ck_sistema: data.ck_sistema, // UUID de la BD
        ck_estatus: data.ck_estatus || "ACTIVO",
        s_nombre_empresa: data.s_nombre_empresa || "CFE",
        s_nombre_sistema: data.s_nombre_sistema || "Sistema de Turnos",
        s_logo_light: data.s_logo_light || "",
        s_logo_dark: data.s_logo_dark || ""
      }));

      // Establecer fecha y hora de última actualización desde la BD
      if (data.updated_at) {
        setLastUpdate(new Date(data.updated_at).toLocaleString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }));
      } else {
        setLastUpdate('No disponible');
      }

      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Error cargando configuración", err);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSystemConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    mode: "light" | "dark"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tamaño del archivo (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      alert(t("configuration.fileTooLarge"));
      event.target.value = '';
      return;
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert(t("configuration.invalidFormat"));
      event.target.value = '';
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;

      if (base64 && base64.startsWith('data:image')) {
        const fieldName = mode === "light" ? "s_logo_light" : "s_logo_dark";

        setSystemConfig(prev => ({
          ...prev,
          [fieldName]: base64
        }));

        // SOLO actualizar el estado local, NO el contexto global
        console.log(`Logo ${mode} cargado (pendiente de guardar):`, base64.substring(0, 50) + '...');

        setHasUnsavedChanges(true);
      } else {
        alert(t("configuration.imageError"));
        event.target.value = '';
      }
    };
    reader.onerror = () => {
      alert(t("configuration.fileReadError"));
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Preparar datos para enviar - usar el UUID real como ck_sistema
      const dataToSend = {
        ck_sistema: systemConfig.ck_sistema, // Este es el UUID de la BD
        ck_estatus: systemConfig.ck_estatus,
        s_nombre_empresa: systemConfig.s_nombre_empresa,
        s_nombre_sistema: systemConfig.s_nombre_sistema,
        s_logo_light: systemConfig.s_logo_light || null,
        s_logo_dark: systemConfig.s_logo_dark || null
      };

      console.log('Enviando configuración con UUID:', {
        ...dataToSend,
        ck_sistema: dataToSend.ck_sistema, // Mostrar UUID completo
        s_logo_light: dataToSend.s_logo_light ? `Base64 (${dataToSend.s_logo_light.length} chars)` : 'null',
        s_logo_dark: dataToSend.s_logo_dark ? `Base64 (${dataToSend.s_logo_dark.length} chars)` : 'null'
      });

      const data = await updateConfiguracion(dataToSend);

      setHasUnsavedChanges(false);
      setShowSuccess(true);
      setSuccessMessage(t("configuration.updateSuccess"));
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setShowSuccess(false), 2500);

      // ACTUALIZAR CONTEXTO GLOBAL SOLO DESPUÉS DE GUARDAR EXITOSAMENTE
      // Si hay logo light en base64, actualizarlo en el contexto
      if (data.s_logo_light && data.s_logo_light.startsWith('data:image')) {
        setLogoLight(data.s_logo_light);
        console.log('Logo light actualizado en contexto global (base64)');
      } else {
        // Si no hay logo o está vacío, usar el logo por defecto
        setLogoLight("/images/logo/itzelLogoR.png");
        console.log('Logo light restablecido a valor por defecto');
      }

      // Si hay logo dark en base64, actualizarlo en el contexto
      if (data.s_logo_dark && data.s_logo_dark.startsWith('data:image')) {
        setLogoDark(data.s_logo_dark);
        console.log('Logo dark actualizado en contexto global (base64)');
      } else {
        // Si no hay logo o está vacío, usar el logo por defecto
        setLogoDark("/images/logo/itzelLogoR_dark.png");
        console.log('Logo dark restablecido a valor por defecto');
      }

      // Actualizar estado local con la respuesta del servidor
      setSystemConfig(prev => ({
        ...prev,
        ...data
      }));

      // Actualizar fecha y hora de última actualización
      setLastUpdate(new Date().toLocaleString('es-MX', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));

      setHasUnsavedChanges(false);

    } catch (err: any) {
      console.error("Error al guardar:", err);
      alert(`${t("configuration.saveError")} ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm(t("configuration.resetConfirm"))) {
      // Mantener el UUID actual, solo resetear los demás campos
      setSystemConfig(prev => ({
        ...prev,
        ck_estatus: "ACTIVO",
        s_nombre_empresa: "CFE",
        s_logo_light: "",
        s_logo_dark: "",
        s_nombre_sistema: "Sistema de Turnos"
      }));

      // NO restablecer los logos en el contexto global hasta que se guarde
      setHasUnsavedChanges(true);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges && confirm(t("configuration.cancelConfirm"))) {
      loadConfiguration(); // Recargar desde la BD
    }
  };

  return (
    <>
      <PageMeta
        title="Configuración - ITZEL"
        description="Configuración general del sistema ITZEL"
      />

      <PageBreadcrumb pageTitle={t("configuration.title")} />
      {showSuccess && (
        <div className="mb-8 mt-2">
          <Alert
            variant="success"
            title={t("configuration.successTitle")}
            message={successMessage}
          />
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8 xl:flex-row">
          <div className="relative">
            <div className="w-16 h-16 overflow-hidden border-2 border-gray-300 rounded-full dark:border-gray-600">
              {systemConfig.s_logo_light && systemConfig.s_logo_light.startsWith('data:image') ? (
                <img
                  src={systemConfig.s_logo_light}
                  alt="Logo Light"
                  className="object-cover w-full h-full dark:hidden"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 dark:hidden">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-300">T</span>
                </div>
              )}
              {systemConfig.s_logo_dark && systemConfig.s_logo_dark.startsWith('data:image') ? (
                <img
                  src={systemConfig.s_logo_dark}
                  alt="Logo Dark"
                  className="object-cover w-full h-full hidden dark:block"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-900 to-blue-800 dark:block hidden">
                  <span className="text-lg font-bold text-blue-300">T</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 bg-green-500"></div>
          </div>
          <div className="text-center xl:text-left">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
              {systemConfig.s_nombre_sistema}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {systemConfig.s_nombre_empresa}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
{t("configuration.active")}
              </span>
              {hasUnsavedChanges && (
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
{t("configuration.unsavedChanges")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Información General */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#8ECAB2] rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
{t("configuration.generalInfo")}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="ck_estatus">{t("configuration.systemStatus")}</Label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-800 dark:text-green-300">{t("configuration.active")}</span>
                  </div>
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
{t("configuration.systemActiveMessage")}
                  </p>
                </div>
              </div>
              <div>
                <Label htmlFor="s_nombre_empresa">{t("configuration.companyName")}</Label>
                <Input
                  id="s_nombre_empresa"
                  type="text"
                  value={systemConfig.s_nombre_empresa}
                  onChange={(e) => handleInputChange('s_nombre_empresa', e.target.value)}
                  placeholder="Mi Empresa S.A."
                />
              </div>
              <div>
                <Label htmlFor="s_nombre_sistema">{t("configuration.systemName")}</Label>
                <Input
                  id="s_nombre_sistema"
                  type="text"
                  value={systemConfig.s_nombre_sistema}
                  onChange={(e) => handleInputChange('s_nombre_sistema', e.target.value)}
                  placeholder="Sistema de Turnos"
                />
              </div>
            </div>
          </div>

          {/* Logo y Apariencia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#547A6B] rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
{t("configuration.logoAndAppearance")}
              </h3>
            </div>
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 overflow-hidden border-2 border-dashed border-gray-300 rounded-2xl dark:border-gray-600">
                  {systemConfig.s_logo_light && systemConfig.s_logo_light.startsWith('data:image') ? (
                    <img
                      src={systemConfig.s_logo_light}
                      alt="Logo Light preview"
                      className="object-cover w-full h-full dark:hidden"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 dark:bg-gray-800 dark:hidden">
                      <span className="text-2xl">🏢</span>
                      <span className="text-xs text-gray-500 mt-2">Logo Light</span>
                    </div>
                  )}
                  {systemConfig.s_logo_dark && systemConfig.s_logo_dark.startsWith('data:image') ? (
                    <img
                      src={systemConfig.s_logo_dark}
                      alt="Logo Dark preview"
                      className="object-cover w-full h-full hidden dark:block"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-800 dark:block hidden">
                      <span className="text-2xl">🌙</span>
                      <span className="text-xs text-gray-400 mt-2">Logo Dark</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="s_logo_light">{t("configuration.uploadLightLogo")}</Label>
                  <input
                    id="s_logo_light"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                    onChange={(e) => handleLogoUpload(e, "light")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("configuration.fileFormats")}
                  </p>
                </div>
                <div>
                  <Label htmlFor="s_logo_dark">{t("configuration.uploadDarkLogo")}</Label>
                  <input
                    id="s_logo_dark"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                    onChange={(e) => handleLogoUpload(e, "dark")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("configuration.fileFormats")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col gap-3 pt-6 border-t border-gray-200 dark:border-gray-600 sm:flex-row sm:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>{t("configuration.lastUpdate")} {lastUpdate}</p>
        </div>
        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {t("configuration.cancel")}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            {t("configuration.resetAll")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !hasUnsavedChanges}
            className="bg-gradient-to-r from-[#8ECAB2] to-[#547A6B] hover:from-[#70A18E] hover:to-[#3A554B] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("configuration.saving") : t("configuration.saveConfiguration")}
          </Button>
        </div>
      </div>
    </>
  );
}