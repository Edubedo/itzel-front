import React, { useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import VoiceCommandsInterface from './VoiceCommandsInterface';
import { 
  Settings, 
  Type, 
  MousePointer, 
  Volume2, 
  Eye, 
  Zap,
  RotateCcw,
  CheckCircle
} from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings, announceToScreenReader } = useAccessibility();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetSettings();
    setShowResetConfirm(false);
    announceToScreenReader('Configuraciones de accesibilidad restablecidas');
  };

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSetting(key, value);
    announceToScreenReader(`Configuración actualizada: ${key}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-brand-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuración de Accesibilidad
          </h2>
        </div>

        <div className="space-y-6">
          {/* Escalado de Texto */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tamaño del Texto
              </h3>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Escala: {Math.round(settings.textScale * 100)}%
              </label>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.1"
                value={settings.textScale}
                onChange={(e) => handleSettingChange('textScale', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                aria-label="Ajustar tamaño del texto"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>80%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>
          </div>

          {/* Navegación por Teclado */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <MousePointer className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Navegación por Teclado
              </h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.keyboardNavigation}
                  onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                  className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
                  aria-describedby="keyboard-help"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Habilitar navegación por teclado mejorada
                </span>
              </label>
              <p id="keyboard-help" className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                Mejora la navegación usando solo el teclado con indicadores de foco más visibles
              </p>
            </div>
          </div>

          {/* Tamaño del Foco */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Indicador de Foco
              </h3>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tamaño del indicador de foco
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSettingChange('focusSize', size)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      settings.focusSize === size
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    aria-pressed={settings.focusSize === size}
                  >
                    {size === 'small' ? 'Pequeño' : size === 'medium' ? 'Mediano' : 'Grande'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modo de Alto Contraste */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contraste
              </h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.highContrastMode}
                  onChange={(e) => handleSettingChange('highContrastMode', e.target.checked)}
                  className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
                  aria-describedby="contrast-help"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Modo de alto contraste
                </span>
              </label>
              <p id="contrast-help" className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                Aumenta el contraste de colores para mejor visibilidad
              </p>
            </div>
          </div>

          {/* Reducción de Movimiento */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Animaciones
              </h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                  className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
                  aria-describedby="motion-help"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reducir animaciones
                </span>
              </label>
              <p id="motion-help" className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                Reduce las animaciones para usuarios sensibles al movimiento
              </p>
            </div>
          </div>

          {/* Comandos de Voz */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Comandos de Voz
              </h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.voiceCommands}
                  onChange={(e) => handleSettingChange('voiceCommands', e.target.checked)}
                  className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
                  aria-describedby="voice-help"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Habilitar comandos de voz
                </span>
              </label>
              <p id="voice-help" className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                Permite controlar la aplicación usando comandos de voz (experimental)
              </p>
              
              {/* Interfaz de comandos de voz */}
              {settings.voiceCommands && (
                <div className="mt-4">
                  <VoiceCommandsInterface />
                </div>
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Restablecer
            </Button>
            <Button
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Aplicar Cambios
            </Button>
          </div>
        </div>

        {/* Modal de confirmación para reset */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ¿Restablecer configuraciones?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Esto restablecerá todas las configuraciones de accesibilidad a sus valores por defecto.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReset}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Restablecer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AccessibilityPanel;
