import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useLogo } from "../../contexts/LogoContext";
import { useLanguage } from "../../context/LanguageContext";


export default function SignInForm() {
  const [formData, setFormData] = useState({
    s_usuario: '',
    s_contrasena: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { logoLight, logoDark } = useLogo();
  const { t } = useLanguage();

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
      setError(t("auth.fillAllFields"));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.code === 'USER_NOT_FOUND') {
        setFieldError({ usuario: err.message });
      } else if (err.code === 'WRONG_PASSWORD') {
        setFieldError({ contrasena: err.message });
      } else {
        setError(err.message || t("auth.invalidCredentials"));
      }
    } finally {
        setIsLoading(false); 
      }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-[#70A18E] transition-colors hover:text-[#547A6B] dark:text-[#8ECAB2] dark:hover:text-[#B7F2DA]"
        >
          <ChevronLeftIcon className="size-5" />
          {t("auth.back")}
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Logo dinámico */}
        <div className="flex justify-center mb-6">
          <img
            src={logoLight}
            alt="Logo"
            className="h-14 dark:hidden"
          />
          <img
            src={logoDark}
            alt="Logo"
            className="h-14 hidden dark:block"
          />
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-bold text-[#0A1310] text-title-sm dark:text-white sm:text-title-md">
              {t("auth.signIn")}
            </h1>
            <p className="text-sm text-[#547A6B] dark:text-gray-300">
              {t("auth.loginDescription")}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  {t("auth.usernameOrEmail")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="s_usuario"
                  type="text"
                  placeholder={t("auth.usernameOrEmailPlaceholder")}
                  value={formData.s_usuario}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-[#F8F9FA] dark:bg-gray-700 border-[#8ECAB2] dark:border-[#70A18E] focus:border-[#70A18E] dark:focus:border-[#8ECAB2] focus:ring-[#70A18E]/20 dark:focus:ring-[#8ECAB2]/20 text-[#0A1310] dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                />
                {fieldError.usuario && (
                  <p className="text-red-500 text-sm mt-1">{fieldError.usuario}</p>
                )}
              </div>
              <div>
                <Label>
                  {t("auth.password")} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    name="s_contrasena"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.passwordPlaceholder")}
                    value={formData.s_contrasena}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-[#F8F9FA] dark:bg-gray-700 border-[#8ECAB2] dark:border-[#70A18E] focus:border-[#70A18E] dark:focus:border-[#8ECAB2] focus:ring-[#70A18E]/20 dark:focus:ring-[#8ECAB2]/20 text-[#0A1310] dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-[#70A18E] dark:fill-[#8ECAB2] size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-[#70A18E] dark:fill-[#8ECAB2] size-5" />
                    )}
                  </span>
                </div>
                {fieldError.contrasena && (
                  <p className="text-red-500 text-sm mt-1">{fieldError.contrasena}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-[#3A554B] dark:text-gray-300 text-theme-sm">
                    {t("auth.keepSessionActive")}
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-[#70A18E] hover:text-[#547A6B] dark:text-[#8ECAB2] dark:hover:text-[#B7F2DA] transition-colors"
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #70A18E 0%, #547A6B 100%)',
                    boxShadow: '0 4px 15px -5px rgba(112, 161, 142, 0.4)'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.signingIn") : t("auth.signIn")}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
