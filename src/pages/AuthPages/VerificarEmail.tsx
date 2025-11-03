import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface VerificationStatus {
  loading: boolean;
  success: boolean;
  message: string;
}

function VerificarEmail() {
  const [status, setStatus] = useState<VerificationStatus>({
    loading: true,
    success: false,
    message: 'Verificando tu correo electrónico...'
  });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setStatus({
            loading: false,
            success: false,
            message: 'No se proporcionó un token de verificación'
          });
          // Cerrar ventana automáticamente después de 2 segundos
          setTimeout(() => window.close(), 2000);
          return;
        }

        // Llamar al endpoint de verificación
        const response = await axios.get(`${API_BASE_URL}/catalogos/usuarios/verify-email`, {
          params: { token }
        });

        if (response.data.success) {
          setStatus({
            loading: false,
            success: true,
            message: '¡Correo verificado correctamente!'
          });

          // Cerrar ventana automáticamente después de 1.5 segundos
          setTimeout(() => {
            window.close();
            // Si no se puede cerrar (depende del navegador), mostrar mensaje
            setStatus(prev => ({
              ...prev,
              message: '¡Listo! Puedes cerrar esta ventana'
            }));
          }, 1500);
        }
      } catch (error: any) {
        console.error('Error al verificar email:', error);
        
        // Si el error es por token inválido/usado, es porque ya se verificó
        const isTokenUsed = error.response?.status === 404 || 
                           error.response?.data?.message?.includes('inválido');
        
        setStatus({
          loading: false,
          success: isTokenUsed,
          message: isTokenUsed 
            ? '¡Tu correo ya fue verificado anteriormente!' 
            : 'Error al verificar. Por favor, intenta nuevamente.'
        });

        // Cerrar automáticamente incluso si hay error
        setTimeout(() => {
          window.close();
          setStatus(prev => ({
            ...prev,
            message: 'Puedes cerrar esta ventana'
          }));
        }, 2000);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-12">
        <div className="text-center">
          {status.loading ? (
            // Verificando...
            <>
              <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Verificando...
              </h2>
              <p className="text-gray-600">
                Por favor espera un momento
              </p>
            </>
          ) : status.success ? (
            // Éxito
            <>
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                ¡Verificado!
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                {status.message}
              </p>
              <p className="text-sm text-gray-500">
                Esta ventana se cerrará automáticamente...
              </p>
            </>
          ) : (
            // Error (raro)
            <>
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6">
                <svg
                  className="h-12 w-12 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Aviso
              </h2>
              <p className="text-gray-700 mb-4">
                {status.message}
              </p>
              <p className="text-sm text-gray-500">
                Puedes cerrar esta ventana
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerificarEmail;

