// src/context/ToastContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import NotificationToast from "../components/header/notificacionToast";

interface Toast {
  id: number;
  mensaje: string;
}

interface ToastContextType {
  agregarToast: (mensaje: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  agregarToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const agregarToast = (mensaje: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje }]);
  };

  const eliminarToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ agregarToast }}>
      {children}
      {/* Renderizar toasts en esquina inferior derecha */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <NotificationToast
            key={t.id}
            mensaje={t.mensaje}
            onClose={() => eliminarToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
