import React, { useState } from 'react';
import { clientesService } from '../../services/clientesService';
import { useLanguage } from '../../context/LanguageContext';

interface ContractValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (clientData: any) => void;
}

export default function ContractValidationModal({
  isOpen,
  onClose,
  onSuccess
}: ContractValidationModalProps) {
  const [contractNumber, setContractNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState<{ contract?: string }>({});
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contractNumber.trim()) {
      setFieldError({ contract: 'Por favor ingrese su número de contrato' });
      return;
    }

    setLoading(true);
    setError('');
    setFieldError({});

    try {
      const response = await clientesService.validateContractNumber(contractNumber.trim());

      if (response.success) {
        onSuccess(response.data);
        setContractNumber('');
        onClose();
      } else {
        setError(response.message || 'Error al validar el contrato');
      }
    } catch (err: any) {
      console.log('Error capturado:', err);

      // Manejar errores específicos según el código
      if (err.code === 'CONTRACT_NOT_FOUND' || err.status === 404) {
        setFieldError({ contract: 'El número de contrato no se encuentra registrado en el sistema' });
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Error de conexión. Por favor, verifique su conexión a internet.');
      } else if (err.code === 'INVALID_CONTRACT') {
        setFieldError({ contract: 'El formato del número de contrato no es válido' });
      } else {
        // Error genérico
        setError(err.message || 'Error al validar el número de contrato. Por favor, intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContractNumber('');
    setError('');
    setFieldError({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md w-full mx-4 rounded-xl shadow-2xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Validación de Cliente
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ingrese su número de contrato
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Contrato
              </label>
              <input
                type="text"
                value={contractNumber}
                onChange={(e) => {
                  setContractNumber(e.target.value);
                  setError('');
                  setFieldError({});
                }}
                placeholder="Ingrese su número de contrato"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors dark:bg-gray-700 dark:text-white ${fieldError.contract
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:focus:ring-blue-400 dark:focus:border-blue-400'
                  }`}
                disabled={loading}
                autoFocus
              />
              {fieldError.contract && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldError.contract}
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                  }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validando...
                  </span>
                ) : (
                  'Validar'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          disabled={loading}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}






