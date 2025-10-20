import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { 
  X, Settings, Type, Volume2, Zap, RotateCcw, CheckCircle, 
  Mic, MicOff, Eye, EyeOff, Keyboard, MousePointer, 
  VolumeX, Volume1, Volume2 as Volume2Icon, 
  ZoomIn, ZoomOut, RotateCcw as ResetIcon,
  HelpCircle, Info
} from 'lucide-react';

interface AdvancedAccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdvancedAccessibilityModal: React.FC<AdvancedAccessibilityModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings, announce, isVoiceCommandActive, setVoiceCommandActive } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'audio' | 'navigation' | 'voice'>('visual');
  const [showHelp, setShowHelp] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSetting(key, value);
    announce(`Configuración de ${key} actualizada`, "polite");
  };

  const handleReset = () => {
    resetSettings();
    announce("Todas las configuraciones han sido restablecidas", "polite");
  };

  // Comandos de voz avanzados y funcionales
  const voiceCommands = {
    // Navegación
    'ir a inicio': () => window.location.href = '/',
    'ir a home': () => window.location.href = '/home',
    'cerrar': () => onClose(),
    'ayuda': () => setShowHelp(true),
    'ocultar ayuda': () => setShowHelp(false),
    
    // Texto
    'aumentar texto': () => {
      const newSize = Math.min(settings.textSize + 20, 200);
      handleSettingChange('textSize', newSize);
    },
    'disminuir texto': () => {
      const newSize = Math.max(settings.textSize - 20, 80);
      handleSettingChange('textSize', newSize);
    },
    'texto normal': () => handleSettingChange('textSize', 100),
    
    // Configuraciones
    'activar voz': () => {
      handleSettingChange('voiceCommands', true);
      setVoiceCommandActive(true);
    },
    'desactivar voz': () => {
      handleSettingChange('voiceCommands', false);
      setVoiceCommandActive(false);
    },
    'reducir movimiento': () => handleSettingChange('reducedMotion', !settings.reducedMotion),
    'activar anuncios': () => handleSettingChange('screenReaderAnnouncements', true),
    'desactivar anuncios': () => handleSettingChange('screenReaderAnnouncements', false),
    
    // Acciones de interfaz
    'abrir configuración': () => setActiveTab('visual'),
    'configuración de voz': () => setActiveTab('voice'),
    'configuración visual': () => setActiveTab('visual'),
    'configuración de audio': () => setActiveTab('audio'),
    'configuración de navegación': () => setActiveTab('navigation'),
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      announce("El reconocimiento de voz no es compatible con este navegador", "assertive");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'es-ES';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      announce("Escuchando comandos de voz. Di 'ayuda' para ver los comandos disponibles", "polite");
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      announce(`Comando recibido: ${transcript}`, "polite");
      
      // Buscar comando coincidente
      let commandFound = false;
      for (const [command, action] of Object.entries(voiceCommands)) {
        if (transcript.includes(command)) {
          action();
          announce(`Ejecutando: ${command}`, "polite");
          commandFound = true;
          break;
        }
      }
      
      if (!commandFound) {
        announce("Comando no reconocido. Di 'ayuda' para ver los comandos disponibles", "polite");
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      announce(`Error en el reconocimiento de voz: ${event.error}`, "assertive");
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Aplicar configuraciones visuales
  useEffect(() => {
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [settings.highContrast]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Accesibilidad Avanzada</h2>
                <p className="text-white/80 text-sm">Configuración completa para una mejor experiencia</p>
              </div>
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

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" role="tablist">
            {[
              { id: 'visual', label: 'Visual', icon: Eye },
              { id: 'audio', label: 'Audio', icon: Volume2 },
              { id: 'navigation', label: 'Navegación', icon: Keyboard },
              { id: 'voice', label: 'Voz', icon: Mic }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === id
                    ? 'border-[#70A18E] text-[#70A18E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                role="tab"
                aria-selected={activeTab === id}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
          {/* Visual Tab */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              {/* Text Size */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Type className="w-6 h-6 text-[#70A18E]" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Tamaño del Texto
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tamaño actual: {settings.textSize}%
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSettingChange('textSize', Math.max(settings.textSize - 10, 80))}
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        aria-label="Disminuir tamaño de texto"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSettingChange('textSize', 100)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm"
                        aria-label="Restablecer tamaño de texto"
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => handleSettingChange('textSize', Math.min(settings.textSize + 10, 200))}
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        aria-label="Aumentar tamaño de texto"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="200"
                    step="10"
                    value={settings.textSize}
                    onChange={(e) => handleSettingChange('textSize', Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    aria-label="Control deslizante para ajustar el tamaño del texto"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>80%</span>
                    <span>140%</span>
                    <span>200%</span>
                  </div>
                </div>
              </div>

              {/* High Contrast */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="w-6 h-6 text-[#70A18E]" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Contraste Alto
                  </h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.highContrast || false}
                      onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                      className="w-5 h-5 text-[#70A18E] bg-gray-100 border-gray-300 rounded focus:ring-[#70A18E]"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Activar modo de alto contraste
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-8">
                    Mejora la visibilidad para usuarios con problemas de visión
                  </p>
                </div>
              </div>

              {/* Reduced Motion */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-[#70A18E]" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Reducir Animaciones
                  </h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                      className="w-5 h-5 text-[#70A18E] bg-gray-100 border-gray-300 rounded focus:ring-[#70A18E]"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Reducir movimientos y animaciones
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-8">
                    Para usuarios sensibles al movimiento
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              {/* Screen Reader Announcements */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Volume2 className="w-6 h-6 text-[#70A18E]" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Anuncios de Lector de Pantalla
                  </h3>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.screenReaderAnnouncements}
                      onChange={(e) => handleSettingChange('screenReaderAnnouncements', e.target.checked)}
                      className="w-5 h-5 text-[#70A18E] bg-gray-100 border-gray-300 rounded focus:ring-[#70A18E]"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Habilitar anuncios de lector de pantalla
                    </span>
                  </label>
                  
                  {settings.screenReaderAnnouncements && (
                    <div className="ml-8 space-y-3">
                      <label htmlFor="verbosity-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nivel de Verbosidad:
                      </label>
                      <select
                        id="verbosity-select"
                        value={settings.screenReaderVerbosity}
                        onChange={(e) => handleSettingChange('screenReaderVerbosity', e.target.value as 'low' | 'medium' | 'high')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A18E] focus:border-[#70A18E] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="low">Bajo - Solo información esencial</option>
                        <option value="medium">Medio - Información balanceada</option>
                        <option value="high">Alto - Información detallada</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Test Announcement */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Probar Anuncios</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Haz clic en el botón para probar cómo suenan los anuncios
                </p>
                <button
                  onClick={() => announce("Este es un anuncio de prueba para el lector de pantalla", "polite")}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Probar Anuncio
                </button>
              </div>
            </div>
          )}

          {/* Navigation Tab */}
          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Keyboard className="w-6 h-6 text-[#70A18E]" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Navegación por Teclado
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Atajos de Teclado:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Tab</kbd> - Navegar entre elementos</li>
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Enter</kbd> - Activar elemento</li>
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd> - Cerrar modales</li>
                        <li><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Alt + A</kbd> - Abrir accesibilidad</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Skip Links:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Saltar al contenido principal</li>
                        <li>• Saltar a la navegación</li>
                        <li>• Saltar a la selección de cliente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Voice Tab */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              {/* Voice Commands */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mic className="w-6 h-6 text-[#70A18E]" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Comandos de Voz
                  </h3>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.voiceCommands}
                      onChange={(e) => {
                        handleSettingChange('voiceCommands', !settings.voiceCommands);
                        setVoiceCommandActive(!settings.voiceCommands);
                      }}
                      className="w-5 h-5 text-[#70A18E] bg-gray-100 border-gray-300 rounded focus:ring-[#70A18E]"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Habilitar comandos de voz
                    </span>
                  </label>

                  {settings.voiceCommands && (
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <button
                          onClick={isListening ? stopListening : startListening}
                          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                            isListening 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                          {isListening ? 'Detener Escucha' : 'Iniciar Escucha'}
                        </button>
                        <button
                          onClick={() => setShowHelp(!showHelp)}
                          className="flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <HelpCircle className="w-5 h-5" />
                          {showHelp ? 'Ocultar Ayuda' : 'Ver Comandos'}
                        </button>
                      </div>

                      {showHelp && (
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Comandos Disponibles:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Navegación:</h5>
                              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                <li>• "ir a inicio"</li>
                                <li>• "cerrar"</li>
                                <li>• "ayuda"</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Texto:</h5>
                              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                <li>• "aumentar texto"</li>
                                <li>• "disminuir texto"</li>
                                <li>• "texto normal"</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Configuración:</h5>
                              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                <li>• "activar voz"</li>
                                <li>• "reducir movimiento"</li>
                                <li>• "activar anuncios"</li>
                              </ul>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Interfaz:</h5>
                              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                <li>• "abrir configuración"</li>
                                <li>• "configuración visual"</li>
                                <li>• "configuración de voz"</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg"
          >
            <ResetIcon className="w-4 h-4" />
            Restablecer Todo
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Info className="w-4 h-4" />
              Ayuda
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2 bg-[#70A18E] text-white rounded-lg hover:bg-[#547A6B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#70A18E] focus:ring-offset-2"
            >
              <CheckCircle className="w-4 h-4" />
              Guardar y Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAccessibilityModal;

