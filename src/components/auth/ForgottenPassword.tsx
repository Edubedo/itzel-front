import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { authService } from "../../services/authService";
import { useLogo } from "../../contexts/LogoContext";

export default function ForgottenPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { logoLight, logoDark } = useLogo();



  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.sendRecoveryCode(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Error al enviar el código");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await authService.verifyRecoveryCode(email, code, newPassword);
      setStep(3);
      setSuccess("¡Contraseña cambiada exitosamente!");
    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-[#70A18E] transition-colors hover:text-[#547A6B] dark:text-[#8ECAB2] dark:hover:text-[#B7F2DA]"
        >
          <ChevronLeftIcon className="size-5" />
          Volver al inicio
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Logo dinámico */}
        <div className="flex justify-center mb-6">
          <img src={logoLight} alt="Logo" className="h-14 dark:hidden" />
          <img src={logoDark} alt="Logo" className="h-14 hidden dark:block" />
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-bold text-[#0A1310] text-title-sm dark:text-white sm:text-title-md">
              Recuperar contraseña
            </h1>
            <p className="text-sm text-[#547A6B] dark:text-gray-300">
              Ingresa tu correo para recibir el código de recuperación
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg">
              {success}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Correo electrónico <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-[#F8F9FA] dark:bg-gray-700 border-[#8ECAB2] dark:border-[#70A18E] focus:border-[#70A18E] dark:focus:border-[#8ECAB2] focus:ring-[#70A18E]/20 dark:focus:ring-[#8ECAB2]/20 text-[#0A1310] dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #70A18E 0%, #547A6B 100%)',
                      boxShadow: '0 4px 15px -5px rgba(112, 161, 142, 0.4)'
                    }}
                    disabled={isLoading || !email}
                  >
                    {isLoading ? "Enviando..." : "Enviar código"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Código recibido <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="code"
                    type="text"
                    placeholder="Código"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    disabled={isLoading}
                    className="bg-[#F8F9FA] dark:bg-gray-700 border-[#8ECAB2] dark:border-[#70A18E] focus:border-[#70A18E] dark:focus:border-[#8ECAB2] focus:ring-[#70A18E]/20 dark:focus:ring-[#8ECAB2]/20 text-[#0A1310] dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label>
                    Nueva contraseña <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="newPassword"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-[#F8F9FA] dark:bg-gray-700 border-[#8ECAB2] dark:border-[#70A18E] focus:border-[#70A18E] dark:focus:border-[#8ECAB2] focus:ring-[#70A18E]/20 dark:focus:ring-[#8ECAB2]/20 text-[#0A1310] dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm font-semibold text-white rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #70A18E 0%, #547A6B 100%)',
                      boxShadow: '0 4px 15px -5px rgba(112, 161, 142, 0.4)'
                    }}
                    disabled={isLoading || !code || !newPassword}
                  >
                    {isLoading ? "Verificando..." : "Cambiar contraseña"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#0A1310] dark:text-white mb-2">¡Contraseña cambiada exitosamente!</h3>
                <p className="text-sm text-[#547A6B] dark:text-gray-300">Ya puedes iniciar sesión con tu nueva contraseña</p>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => navigate("/signin")}
                  className="w-full"
                  style={{
                    background: 'linear-gradient(135deg, #70A18E 0%, #547A6B 100%)',
                    boxShadow: '0 4px 15px -5px rgba(112, 161, 142, 0.4)'
                  }}
                >
                  Ir a iniciar sesión
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}