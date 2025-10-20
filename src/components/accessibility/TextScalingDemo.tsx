import React from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

const TextScalingDemo: React.FC = () => {
  const { settings, updateSetting } = useAccessibility();

  const handleScaleChange = (scale: number) => {
    updateSetting('textScale', scale);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Demostración de Escalado de Texto
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tamaño actual: {Math.round(settings.textScale * 100)}%
          </label>
          <input
            type="range"
            min="0.8"
            max="2.0"
            step="0.1"
            value={settings.textScale}
            onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            aria-label="Ajustar tamaño del texto"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>80%</span>
            <span>100%</span>
            <span>150%</span>
            <span>200%</span>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Ejemplo de Texto Escalado
          </h3>
          
          <div className="space-y-3">
            <p className="text-scalable text-gray-700 dark:text-gray-300">
              Este es un párrafo de ejemplo que se escala según la configuración del usuario. 
              El texto se ajusta automáticamente para mejorar la legibilidad.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-scalable font-semibold text-gray-900 dark:text-white mb-2">
                Título de Ejemplo
              </h4>
              <p className="text-scalable text-sm text-gray-600 dark:text-gray-400">
                Texto más pequeño que también se escala proporcionalmente.
              </p>
            </div>
            
            <div className="flex gap-2">
              <button className="text-scalable px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                Botón de Ejemplo
              </button>
              <button className="text-scalable px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                Botón Secundario
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Información de Accesibilidad
          </h3>
          <div className="text-scalable text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              <strong>Escalado de texto:</strong> Permite a los usuarios ajustar el tamaño del texto 
              para mejorar la legibilidad sin afectar el diseño general de la aplicación.
            </p>
            <p>
              <strong>Rango recomendado:</strong> 80% a 200% para cubrir las necesidades de la mayoría de usuarios.
            </p>
            <p>
              <strong>Compatibilidad:</strong> Funciona con lectores de pantalla y tecnologías de asistencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextScalingDemo;

