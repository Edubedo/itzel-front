import React, { useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { X, Settings, Type, Volume2, Zap, RotateCcw, CheckCircle, Mic, MicOff } from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings, announce, isVoiceCommandActive, setVoiceCommandActive } = useAccessibility();
  const [isListening, setIsListening] = useState(false);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSetting(key, value);
    announce(`Configuración de ${key} actualizada a ${value}`, "polite");
  };

  const handleReset = () => {
    resetSettings();
    announce("Configuración de accesibilidad restablecida a los valores por defecto.", "polite");
  };

  const toggleVoiceCommands = () => {
    const newValue = !settings.voiceCommands;
    handleSettingChange('voiceCommands', newValue);
    setVoiceCommandActive(newValue);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      announce("El reconocimiento de voz no es compatible con este navegador.", "assertive");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      setIsListening(true);
      announce("Escuchando comandos de voz...", "polite");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      announce(`Comando recibido: ${transcript}`, "polite");
      
      // Comandos básicos funcionales
      if (transcript.includes('ayuda')) {
        announce("Mostrando ayuda de comandos de voz", "polite");
      } else if (transcript.includes('cerrar') || transcript.includes('salir')) {
        onClose();
      } else if (transcript.includes('aumentar texto') || transcript.includes('texto más grande')) {
        const newSize = Math.min(settings.textSize + 10, 200);
        handleSettingChange('textSize', newSize);
      } else if (transcript.includes('disminuir texto') || transcript.includes('texto más pequeño')) {
        const newSize = Math.max(settings.textSize - 10, 80);
        handleSettingChange('textSize', newSize);
      } else if (transcript.includes('reducir movimiento') || transcript.includes('menos animación')) {
        handleSettingChange('reducedMotion', !settings.reducedMotion);
      } else {
        announce("Comando no reconocido. Intenta decir 'ayuda' para ver los comandos disponibles.", "polite");
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      announce(`Error en el reconocimiento de voz: ${event.error}`, "assertive");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      announce("Reconocimiento de voz finalizado.", "polite");
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    announce("Deteniendo comandos de voz.", "polite");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-7 h-7" />
              <h2 className="text-2xl font-bold">Configuración de Accesibilidad</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Cerrar configuración de accesibilidad"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="space-y-6">
            {/* Text Size */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tamaño del Texto
                </h3>
              </div>
              <div className="space-y-3">
                <label htmlFor="text-size-range" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ajustar tamaño del texto: {settings.textSize}%
                </label>
                <input
                  type="range"
                  id="text-size-range"
                  min="80"
                  max="200"
                  step="10"
                  value={settings.textSize}
                  onChange={(e) => handleSettingChange('textSize', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  aria-valuenow={settings.textSize}
                  aria-valuemin={80}
                  aria-valuemax={200}
                  aria-valuetext={`${settings.textSize}%`}
                  aria-label="Control deslizante para ajustar el tamaño del texto"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Aumenta o disminuye el tamaño de la fuente en toda la aplicación.
                </p>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reducir Movimiento
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
                    Habilitar movimiento reducido
                  </span>
                </label>
                <p id="motion-help" className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                  Reduce las animaciones para usuarios sensibles al movimiento
                </p>
              </div>
            </div>

            {/* Voice Commands */}
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
                    onChange={toggleVoiceCommands}
                    className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
                    aria-describedby="voice-help"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Habilitar comandos de voz
                  </span>
                </label>
                <p id="voice-help" className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                  Permite controlar la aplicación usando comandos de voz
                </p>

                {settings.voiceCommands && (
                  <div className="ml-7 mt-4 space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={isListening ? stopListening : startListening}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isListening 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                        aria-label={isListening ? "Detener escucha de comandos de voz" : "Iniciar escucha de comandos de voz"}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        {isListening ? 'Detener' : 'Escuchar'}
                      </button>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Comandos disponibles:</h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• "ayuda" - Mostrar ayuda</li>
                        <li>• "cerrar" - Cerrar panel</li>
                        <li>• "aumentar texto" - Hacer texto más grande</li>
                        <li>• "disminuir texto" - Hacer texto más pequeño</li>
                        <li>• "reducir movimiento" - Activar/desactivar animaciones</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Screen Reader Announcements */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Anuncios para Lector de Pantalla
                </h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.screenReaderAnnouncements}
                    onChange={(e) => handleSettingChange('screenReaderAnnouncements', e.target.checked)}
                    className="w-4 h-4 text-brand-500 bg-gray-100 border-gray-300 rounded focus:ring-brand-500"
                    aria-describedby="announcements-help"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Habilitar anuncios de lector de pantalla
                  </span>
                </label>
                <p id="announcements-help" className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                  Proporciona retroalimentación audible para cambios importantes en la interfaz.
                </p>
                {settings.screenReaderAnnouncements && (
                  <div className="ml-7 mt-3">
                    <label htmlFor="verbosity-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nivel de Verbosidad:
                    </label>
                    <select
                      id="verbosity-select"
                      value={settings.screenReaderVerbosity}
                      onChange={(e) => handleSettingChange('screenReaderVerbosity', e.target.value as 'low' | 'medium' | 'high')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      aria-label="Seleccionar nivel de verbosidad para lector de pantalla"
                    >
                      <option value="low">Bajo</option>
                      <option value="medium">Medio</option>
                      <option value="high">Alto</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg"
            aria-label="Restablecer todas las configuraciones de accesibilidad"
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 bg-[#70A18E] text-white rounded-lg hover:bg-[#547A6B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#70A18E] focus:ring-offset-2"
            aria-label="Guardar y cerrar configuración de accesibilidad"
          >
            <CheckCircle className="w-4 h-4" />
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityModal;

