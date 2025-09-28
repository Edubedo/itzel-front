import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

export default function ForgottenPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("No se pudo enviar el código");
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
      const res = await fetch("http://localhost:3001/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      if (!res.ok) throw new Error("Código incorrecto o error");
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
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Volver al inicio
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Recuperar contraseña
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tu correo para recibir el código de recuperación
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Correo electrónico <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    Código recibido <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    name="code"
                    type="text"
                    placeholder="Código"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>
                    Nueva contraseña <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    name="newPassword"
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm bg-brand-500 text-white rounded hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !code || !newPassword}
                  >
                    {isLoading ? "Verificando..." : "Cambiar contraseña"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-green-600 font-bold text-center py-8">
              ¡Contraseña cambiada exitosamente!
              <div className="mt-6">
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full"
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