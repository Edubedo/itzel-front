import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

const AccessibilityPanel: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large' | 'extra-large') => {
    updateSettings({ fontSize });
  };

  const handleToggle = (setting: keyof typeof settings) => {
    updateSettings({ [setting]: !settings[setting] });
  };

  const handleVoiceToggle = () => {
    if ('speechSynthesis' in window) {
      if (settings.voiceEnabled) {
        speechSynthesis.cancel();
        updateSettings({ voiceEnabled: false });
      } else {
        updateSettings({ voiceEnabled: true });
        // Leer el contenido actual
        const text = document.querySelector('h1, h2, h3')?.textContent || 'Página cargada';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <>
      {/* Botón flotante para abrir panel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-[#70A18E] hover:bg-[#547A6B] text-white p-3 rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#70A18E]/50"
        aria-label="Abrir configuración de accesibilidad"
        title="Configuración de accesibilidad"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Panel de configuración */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Configuración de Accesibilidad</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                  aria-label="Cerrar panel"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Tamaño de fuente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Tamaño de texto</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'small', label: 'Pequeño' },
                    { value: 'medium', label: 'Mediano' },
                    { value: 'large', label: 'Grande' },
                    { value: 'extra-large', label: 'Muy Grande' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFontSizeChange(option.value as any)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        settings.fontSize === option.value
                          ? 'border-[#70A18E] bg-[#70A18E]/10 text-[#70A18E]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opciones de accesibilidad */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Opciones de accesibilidad</h3>
                

                {/* Movimiento reducido */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">Movimiento reducido</div>
                    <div className="text-sm text-gray-600">Reduce las animaciones</div>
                  </div>
                  <button
                    onClick={() => handleToggle('reducedMotion')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.reducedMotion ? 'bg-[#70A18E]' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={settings.reducedMotion}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                {/* Lector de pantalla */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">Lector de pantalla</div>
                    <div className="text-sm text-gray-600">Anuncios para lectores de pantalla</div>
                  </div>
                  <button
                    onClick={() => handleToggle('screenReader')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.screenReader ? 'bg-[#70A18E]' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={settings.screenReader}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.screenReader ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                {/* Navegación por teclado */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">Navegación por teclado</div>
                    <div className="text-sm text-gray-600">Resalta elementos navegables</div>
                  </div>
                  <button
                    onClick={() => handleToggle('keyboardNavigation')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.keyboardNavigation ? 'bg-[#70A18E]' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={settings.keyboardNavigation}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                {/* Voz */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">Síntesis de voz</div>
                    <div className="text-sm text-gray-600">Lee el contenido en voz alta</div>
                  </div>
                  <button
                    onClick={handleVoiceToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.voiceEnabled ? 'bg-[#70A18E]' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={settings.voiceEnabled}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                {/* Control por voz */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">Control por voz</div>
                    <div className="text-sm text-gray-600">Navegación completa por comandos de voz</div>
                  </div>
                  <button
                    onClick={() => handleToggle('voiceControl')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.voiceControl ? 'bg-[#70A18E]' : 'bg-gray-200'
                    }`}
                    role="switch"
                    aria-checked={settings.voiceControl}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.voiceControl ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={resetSettings}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Restablecer
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-[#70A18E] text-white rounded-lg hover:bg-[#547A6B] transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityPanel;
