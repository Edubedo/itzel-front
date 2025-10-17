import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useLogo } from "../../contexts/LogoContext";
import { useAccessibility } from "../accessibility/AccessibilityProvider";
import VoiceReader from "../accessibility/VoiceReader";
import VoiceControl from "../accessibility/VoiceControl";


export default function SignInForm() {
  const { announceToScreenReader } = useAccessibility();
  const [formData, setFormData] = useState({
    s_usuario: '',
    s_contrasena: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { logoLight, logoDark } = useLogo();

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [fieldError, setFieldError] = useState<{ usuario?: string; contrasena?: string }>({});


  // Obtener la ruta desde donde se redirigió al login
  const from = location.state?.from?.pathname || '/home';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error general y de campo al escribir
    setError('');
    setFieldError({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.s_usuario || !formData.s_contrasena) {
      const message = 'Por favor completa todos los campos';
      setError(message);
      announceToScreenReader(message);
      return;
    }

    setIsLoading(true);
    setError('');
    const message = 'Iniciando sesión, por favor espere...';
    announceToScreenReader(message);

    try {
      await login(formData);
      const successMessage = 'Sesión iniciada exitosamente';
      announceToScreenReader(successMessage);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'USER_NOT_FOUND') {
        setFieldError({ usuario: err.message });
        announceToScreenReader(`Error: ${err.message}`);
      } else if (err.code === 'WRONG_PASSWORD') {
        setFieldError({ contrasena: err.message });
        announceToScreenReader(`Error: ${err.message}`);
      } else {
        const errorMessage = err.message || 'Credenciales Incorrectas';
        setError(errorMessage);
        announceToScreenReader(`Error: ${errorMessage}`);
      }
    } finally {
        setIsLoading(false); 
      }
  };

  return (
    <VoiceControl
      onNavigate={(direction) => {
        const message = `Navegando ${direction}`;
        announceToScreenReader(message);
      }}
      onActivate={() => {
        const message = 'Elemento activado';
        announceToScreenReader(message);
      }}
      onGoBack={() => {
        const message = 'Regresando a la página principal';
        announceToScreenReader(message);
      }}
      onHelp={() => {
        const message = 'Mostrando ayuda del formulario de inicio de sesión';
        announceToScreenReader(message);
      }}
      onForm={() => {
        const message = 'Navegando a los campos del formulario';
        announceToScreenReader(message);
      }}
      onButton={() => {
        const message = 'Navegando a los botones';
        announceToScreenReader(message);
      }}
      onLink={() => {
        const message = 'Navegando a los enlaces';
        announceToScreenReader(message);
      }}
      onField={() => {
        const message = 'Navegando a los campos de entrada';
        announceToScreenReader(message);
      }}
      onText={() => {
        const message = 'Navegando al contenido de texto';
        announceToScreenReader(message);
      }}
    >
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-[#70A18E] transition-colors hover:text-[#547A6B] dark:text-[#8ECAB2] dark:hover:text-[#B7F2DA] accessibility-link"
            aria-label="Volver a la página principal"
          >
            <ChevronLeftIcon className="size-5" aria-hidden="true" />
            Volver 
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Logo dinámico */}
        <div className="flex justify-center mb-6">
          <img
            src={logoLight}
            alt="Logo de ITZEL"
            className="h-14 dark:hidden"
          />
          <img
            src={logoDark}
            alt="Logo de ITZEL"
            className="h-14 hidden dark:block"
          />
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-bold text-[#0A1310] text-title-sm dark:text-white sm:text-title-md">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-[#547A6B] dark:text-gray-300">
              Ingresa tu usuario/email y contraseña para acceder al sistema de turnos
            </p>
            <VoiceReader 
              text="Formulario de inicio de sesión. Ingrese su usuario o email y contraseña para acceder al sistema."
              autoRead={true}
              delay={1000}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} role="form" aria-label="Formulario de inicio de sesión">
            <div className="space-y-6">
              <div className="accessibility-field-group">
                <Label className="accessibility-label">
                  Usuario o Email <span className="text-red-500 accessibility-required">*</span>
                </Label>
                <Input
                  name="s_usuario"
                  type="text"
                  placeholder="usuario o correo@ejemplo.com"
                  value={formData.s_usuario}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="accessibility-input bg-[#F8F9FA] dark:bg-gray-700 border-[#8ECAB2] dark:border-[#70A18E] focus:border-[#70A18E] dark:focus:border-[#8ECAB2] focus:ring-[#70A18E]/20 dark:focus:ring-[#8ECAB2]/20 text-[#0A1310] dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  aria-label="Campo de usuario o email"
                  aria-required="true"
                  aria-describedby={fieldError.usuario ? "usuario-error" : "usuario-help"}
                />
                {fieldError.usuario ? (
                  <p id="usuario-error" className="text-red-500 text-sm mt-1 accessibility-error" role="alert">{fieldError.usuario}</p>
                ) : (
                  <p id="usuario-help" className="text-gray-500 text-sm mt-1 accessibility-help">Ingrese su usuario o dirección de email</p>
                )}
              </div>
              <div className="accessibility-field-group">
                <Label className="accessibility-label">
                  Contraseña <span className="text-red-500 accessibility-required">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="s_contrasena"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={formData.s_contrasena}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="accessibility-input bg-[#F8F9FA] dark:bg-gray-700 border-[#8ECAB2] dark:border-[#70A18E] focus:border-[#70A18E] dark:focus:border-[#8ECAB2] focus:ring-[#70A18E]/20 dark:focus:ring-[#8ECAB2]/20 text-[#0A1310] dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    aria-label="Campo de contraseña"
                    aria-required="true"
                    aria-describedby={fieldError.contrasena ? "contrasena-error" : "contrasena-help"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 right-4 top-1/2 p-1"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-[#70A18E] dark:fill-[#8ECAB2] size-5" aria-hidden="true" />
                    ) : (
                      <EyeCloseIcon className="fill-[#70A18E] dark:fill-[#8ECAB2] size-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {fieldError.contrasena ? (
                  <p id="contrasena-error" className="text-red-500 text-sm mt-1 accessibility-error" role="alert">{fieldError.contrasena}</p>
                ) : (
                  <p id="contrasena-help" className="text-gray-500 text-sm mt-1 accessibility-help">Ingrese su contraseña</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={isChecked} 
                    onChange={setIsChecked}
                    aria-label="Mantener sesión iniciada"
                  />
                  <span className="block font-normal text-[#3A554B] dark:text-gray-300 text-theme-sm">
                    Mantener sesión iniciada
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-[#70A18E] hover:text-[#547A6B] dark:text-[#8ECAB2] dark:hover:text-[#B7F2DA] transition-colors accessibility-link"
                  aria-label="Recuperar contraseña olvidada"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed accessibility-action-button"
                  style={{
                    background: 'linear-gradient(135deg, #70A18E 0%, #547A6B 100%)',
                    boxShadow: '0 4px 15px -5px rgba(112, 161, 142, 0.4)'
                  }}
                  disabled={isLoading}
                  aria-label={isLoading ? "Iniciando sesión, por favor espere" : "Iniciar sesión en el sistema"}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
      </div>
    </VoiceControl>
  );
}
