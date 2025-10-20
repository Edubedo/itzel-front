import React, { useState } from 'react';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Mic, MicOff, HelpCircle, X } from 'lucide-react';
import Button from '../ui/button/Button';

interface VoiceCommandsInterfaceProps {
  className?: string;
}

const VoiceCommandsInterface: React.FC<VoiceCommandsInterfaceProps> = ({ className = "" }) => {
  const { settings } = useAccessibility();
  const [showHelp, setShowHelp] = useState(false);

  // Comandos de voz básicos
  const voiceCommands = [
    {
      command: 'ayuda',
      action: () => setShowHelp(true),
      description: 'Mostrar ayuda de comandos'
    },
    {
      command: 'cerrar ayuda',
      action: () => setShowHelp(false),
      description: 'Cerrar ayuda de comandos'
    },
    {
      command: 'ir a inicio',
      action: () => {
        const homeLink = document.querySelector('a[href="/home"]') as HTMLAnchorElement;
        if (homeLink) homeLink.click();
      },
      description: 'Ir a la página de inicio'
    },
    {
      command: 'abrir menú',
      action: () => {
        const menuButton = document.querySelector('[aria-label*="menú de navegación"]') as HTMLButtonElement;
        if (menuButton) menuButton.click();
      },
      description: 'Abrir el menú de navegación'
    },
    {
      command: 'buscar',
      action: () => {
        const searchInput = document.querySelector('input[placeholder*="Buscar"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      },
      description: 'Enfocar el campo de búsqueda'
    }
  ];

  const {
    isListening,
    isSupported,
    isVoiceCommandsEnabled,
    transcript,
    interimTranscript,
    error,
    toggleListening,
    clearTranscript,
    showHelp: showVoiceHelp
  } = useVoiceCommands({ commands: voiceCommands });

  // No mostrar si los comandos de voz están deshabilitados
  if (!isVoiceCommandsEnabled) {
    return null;
  }

  // No mostrar si no es compatible
  if (!isSupported) {
    return (
      <div className={`p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg ${className}`}>
        <div className="flex items-center gap-2">
          <MicOff className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Los comandos de voz no son compatibles con este navegador
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controles principales */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Button
          onClick={toggleListening}
          variant={isListening ? "primary" : "outline"}
          size="sm"
          className="flex items-center gap-2"
          aria-label={isListening ? "Detener escucha" : "Iniciar escucha"}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              Detener
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              Escuchar
            </>
          )}
        </Button>

        <Button
          onClick={() => setShowHelp(!showHelp)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          aria-label="Mostrar ayuda de comandos"
        >
          <HelpCircle className="w-4 h-4" />
          Ayuda
        </Button>

        {transcript && (
          <Button
            onClick={clearTranscript}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            aria-label="Limpiar transcripción"
          >
            <X className="w-4 h-4" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Estado de escucha */}
      {isListening && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Escuchando comandos de voz...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Transcripción */}
      {(transcript || interimTranscript) && (
        <div className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transcripción:
          </h4>
          <p className="text-sm text-gray-900 dark:text-white">
            {transcript}
            {interimTranscript && (
              <span className="text-gray-500 italic">
                {interimTranscript}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Ayuda de comandos */}
      {showHelp && (
        <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Comandos de Voz Disponibles
            </h3>
            <Button
              onClick={() => setShowHelp(false)}
              variant="outline"
              size="sm"
              aria-label="Cerrar ayuda"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {voiceCommands.map((cmd, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    "{cmd.command}"
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {cmd.description}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comandos adicionales:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• "ayuda" - Mostrar esta ayuda</li>
                <li>• "cerrar" - Cerrar ventanas o menús abiertos</li>
                <li>• "navegar" - Ir al contenido principal</li>
                <li>• "buscar" - Enfocar el campo de búsqueda</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceCommandsInterface;

