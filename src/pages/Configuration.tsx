import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import { useState, useEffect } from "react";
import { getConfiguracion, updateConfiguracion } from "../services/configuracionService";
import { useLogo } from "../contexts/LogoContext";

export default function Configuration() {
  const [systemConfig, setSystemConfig] = useState({
    ck_sistema: "SISTEMA_TURNOS",
    ck_estatus: "ACTIVO",
    s_nombre_empresa: "CFE",
    s_logo_light: "",
    s_logo_dark: "",
    s_nombre_sistema: "Sistema de Turnos",
    horarioApertura: "08:00",
    horarioCierre: "18:00",
    duracionTurno: "30",
    timezone: "America/Mexico_City",
    notificaciones: true,
    maxTurnosDia: "10"
  });

  // Estados temporales para los logos
  const [pendingLogoLight, setPendingLogoLight] = useState<string>("");
  const [pendingLogoDark, setPendingLogoDark] = useState<string>("");

  useEffect(() => {
    getConfiguracion()
      .then(data => setSystemConfig(prev => ({
        ...prev,
        ...data
      })))
      .catch(err => console.error("Error cargando configuración", err));
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setSystemConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Solo actualiza los estados temporales, no el contexto global
  const handleLogoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    mode: "light" | "dark"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newLogo = e.target?.result as string;
        if (mode === "light") {
          setPendingLogoLight(newLogo);
          handleInputChange("s_logo_light", newLogo);
        } else {
          setPendingLogoDark(newLogo);
          handleInputChange("s_logo_dark", newLogo);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const { setLogoLight, setLogoDark } = useLogo();

  // Actualiza el contexto y el favicon solo al guardar
  const handleSave = () => {
    updateConfiguracion(systemConfig)
      .then(data => {
        alert("Configuración guardada exitosamente");
        setSystemConfig(prev => ({
          ...prev,
          ...data
        }));
        // Solo aquí actualizas el logo global y el favicon
        if (pendingLogoLight) setLogoLight(pendingLogoLight);
        if (pendingLogoDark) setLogoDark(pendingLogoDark);
      })
      .catch(err => alert("Error al guardar configuración"));
  };

  return (
    <>
      <PageMeta
        title="Configuración - ITZEL"
        description="Configuración general del sistema ITZEL"
      />
      <PageBreadcrumb pageTitle="Configuración" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8 xl:flex-row">
          <div className="relative">
            <div className="w-16 h-16 overflow-hidden border-2 border-gray-300 rounded-full dark:border-gray-600">
              {systemConfig.s_logo_light ? (
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
              {systemConfig.s_logo_dark ? (
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
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${systemConfig.ck_estatus === 'ACTIVO'
                ? 'bg-green-500'
                : systemConfig.ck_estatus === 'INACTIVO'
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              }`}></div>
          </div>
          <div className="text-center xl:text-left">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
              {systemConfig.s_nombre_sistema}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {systemConfig.s_nombre_empresa}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${systemConfig.ck_estatus === 'ACTIVO'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : systemConfig.ck_estatus === 'INACTIVO'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                {systemConfig.ck_estatus}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">ID: {systemConfig.ck_sistema}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Información General */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#8ECAB2] rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Información General
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="ck_sistema">Código del Sistema *</Label>
                <Input
                  id="ck_sistema"
                  type="text"
                  value={systemConfig.ck_sistema}
                  onChange={(e) => handleInputChange('ck_sistema', e.target.value)}
                  placeholder="SISTEMA_TURNOS"
                />
                <p className="mt-1 text-xs text-gray-500">Identificador único del sistema</p>
              </div>
              <div>
                <Label htmlFor="ck_estatus">Estatus del Sistema *</Label>
                <select
                  id="ck_estatus"
                  value={systemConfig.ck_estatus}
                  onChange={(e) => handleInputChange('ck_estatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="MANTENIMIENTO">EN MANTENIMIENTO</option>
                </select>
              </div>
              <div>
                <Label htmlFor="s_nombre_empresa">Nombre de la Empresa *</Label>
                <Input
                  id="s_nombre_empresa"
                  type="text"
                  value={systemConfig.s_nombre_empresa}
                  onChange={(e) => handleInputChange('s_nombre_empresa', e.target.value)}
                  placeholder="Mi Empresa S.A."
                />
              </div>
              <div>
                <Label htmlFor="s_nombre_sistema">Nombre del Sistema *</Label>
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

          {/* Configuración de Horarios */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#70A18E] rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Configuración de Horarios
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="horarioApertura">Hora de Apertura</Label>
                <Input
                  id="horarioApertura"
                  type="time"
                  value={systemConfig.horarioApertura}
                  onChange={(e) => handleInputChange('horarioApertura', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horarioCierre">Hora de Cierre</Label>
                <Input
                  id="horarioCierre"
                  type="time"
                  value={systemConfig.horarioCierre}
                  onChange={(e) => handleInputChange('horarioCierre', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxTurnosDia">Máx. Turnos/Día</Label>
                <Input
                  id="maxTurnosDia"
                  type="number"
                  value={systemConfig.maxTurnosDia}
                  onChange={(e) => handleInputChange('maxTurnosDia', e.target.value)}
                  min="1"
                  max="200"
                />
              </div>
            </div>
          </div>

          {/* Logo y Apariencia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-[#547A6B] rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Logo y Apariencia
              </h3>
            </div>
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 overflow-hidden border-2 border-dashed border-gray-300 rounded-2xl dark:border-gray-600">
                  {systemConfig.s_logo_light ? (
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
                  {systemConfig.s_logo_dark ? (
                    <img
                      src={systemConfig.s_logo_dark}
                      alt="Logo Dark preview"
                      className="object-cover w-full h-full hidden dark:block"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800 dark:block hidden">
                      <span className="text-2xl">🌙</span>
                      <span className="text-xs text-gray-400 mt-2">Logo Dark</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="s_logo_light">Subir Logo Light</Label>
                  <input
                    id="s_logo_light"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, "light")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Formatos: JPG, PNG, SVG. Máx. 2MB
                  </p>
                </div>
                <div>
                  <Label htmlFor="s_logo_dark">Subir Logo Dark</Label>
                  <input
                    id="s_logo_dark"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, "dark")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Formatos: JPG, PNG, SVG. Máx. 2MB
                  </p>
                </div>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={systemConfig.notificaciones}
                  onChange={(e) => handleInputChange('notificaciones', e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${systemConfig.notificaciones ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${systemConfig.notificaciones ? 'transform translate-x-5' : 'transform translate-x-1'
                  }`}></div>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Notificaciones por email
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col gap-3 pt-6 border-t border-gray-200 dark:border-gray-600 sm:flex-row sm:justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>Última actualización: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (confirm('¿Restablecer toda la configuración a valores por defecto?')) {
                setSystemConfig({
                  ck_sistema: "SISTEMA_TURNOS",
                  ck_estatus: "ACTIVO",
                  s_nombre_empresa: "CFE",
                  s_logo_light: "",
                  s_logo_dark: "",
                  s_nombre_sistema: "Sistema de Turnos",
                  horarioApertura: "08:00",
                  horarioCierre: "18:00",
                  duracionTurno: "30",
                  timezone: "America/Mexico_City",
                  notificaciones: true,
                  maxTurnosDia: "10"
                });
                setPendingLogoLight("");
                setPendingLogoDark("");
              }
            }}
          >
            Restablecer Todo
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#8ECAB2] to-[#547A6B] hover:from-[#70A18E] hover:to-[#3A554B]"
          >
            Guardar Configuración
          </Button>
        </div>
      </div>
    </>
  );
}