import React, { useEffect } from "react";

interface ToastProps {
  mensaje: string;
  onClose: () => void;
}

export default function NotificationToast({ mensaje, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-green-50 border border-green-400 text-green-800 p-4 rounded-lg shadow-lg animate-fade-in">
      {mensaje}
    </div>
  );
}
