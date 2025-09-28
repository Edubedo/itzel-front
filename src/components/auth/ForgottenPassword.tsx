// ...existing code...

import React from "react";

const PasswordRecoveryModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    setLoading(true);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      if (!res.ok) throw new Error("Código incorrecto o error");
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <button className="absolute top-2 right-2" onClick={onClose}>✕</button>
        {step === 1 && (
          <>
            <h2 className="text-lg font-bold mb-2">Recuperar contraseña</h2>
            <input
              type="email"
              className="w-full mb-2 p-2 border rounded"
              placeholder="Correo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={handleSendCode}
              disabled={loading || !email}
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-lg font-bold mb-2">Verifica tu código</h2>
            <input
              type="text"
              className="w-full mb-2 p-2 border rounded"
              placeholder="Código recibido"
              value={code}
              onChange={e => setCode(e.target.value)}
              disabled={loading}
            />
            <input
              type="password"
              className="w-full mb-2 p-2 border rounded"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={loading}
            />
            <button
              className="w-full bg-green-600 text-white py-2 rounded"
              onClick={handleVerifyCode}
              disabled={loading || !code || !newPassword}
            >
              {loading ? "Verificando..." : "Cambiar contraseña"}
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </>
        )}
        {step === 3 && (
          <div className="text-green-600 font-bold text-center">
            ¡Contraseña cambiada exitosamente!
          </div>
        )}
      </div>
    </div>
  );
};

// Ejemplo de uso en AppHeader
const [showRecovery, setShowRecovery] = useState(false);

// ...en tu JSX, agrega un botón para abrir el modal, por ejemplo cerca de UserDropdown:
{/* <button onClick={() => setShowRecovery(true)} className="ml-2 text-xs underline">¿Olvidaste tu contraseña?</button> */}
<PasswordRecoveryModal open={showRecovery} onClose={() => setShowRecovery(false)} />

// ...existing code...