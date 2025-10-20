import { useEffect, useRef, useState, useCallback } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
}

interface VoiceCommandsOptions {
  commands: VoiceCommand[];
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  language?: string;
}

export const useVoiceCommands = (options: VoiceCommandsOptions) => {
  const { commands, continuous = false, interimResults = true, maxAlternatives = 1, language = 'es-ES' } = options;
  const { settings, announceToScreenReader } = useAccessibility();
  
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const commandsRef = useRef(commands);

  // Actualizar comandos cuando cambien
  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  // Verificar soporte de reconocimiento de voz
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
    } else {
      setIsSupported(false);
      setError('El reconocimiento de voz no es compatible con este navegador');
    }
  }, []);

  // Configurar reconocimiento de voz
  useEffect(() => {
    if (!recognitionRef.current || !isSupported) return;

    const recognition = recognitionRef.current;
    
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = maxAlternatives;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      announceToScreenReader('Escuchando comandos de voz');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript);
      setInterimTranscript(interimTranscript);

      // Procesar comandos cuando hay resultados finales
      if (finalTranscript) {
        processCommand(finalTranscript.toLowerCase().trim());
      }
    };

    recognition.onerror = (event) => {
      setError(`Error de reconocimiento: ${event.error}`);
      setIsListening(false);
      
      let errorMessage = 'Error en el reconocimiento de voz';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No se detectó habla';
          break;
        case 'audio-capture':
          errorMessage = 'No se pudo acceder al micrófono';
          break;
        case 'not-allowed':
          errorMessage = 'Permisos de micrófono denegados';
          break;
        case 'network':
          errorMessage = 'Error de red en el reconocimiento de voz';
          break;
      }
      
      announceToScreenReader(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
      announceToScreenReader('Reconocimiento de voz detenido');
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [continuous, interimResults, maxAlternatives, language, announceToScreenReader]);

  // Procesar comandos de voz
  const processCommand = useCallback((commandText: string) => {
    const matchedCommand = commandsRef.current.find(cmd => 
      cmd.command.toLowerCase() === commandText ||
      commandText.includes(cmd.command.toLowerCase())
    );

    if (matchedCommand) {
      try {
        matchedCommand.action();
        announceToScreenReader(`Comando ejecutado: ${matchedCommand.description}`);
      } catch (error) {
        console.error('Error ejecutando comando de voz:', error);
        announceToScreenReader('Error ejecutando comando');
      }
    } else {
      // Comandos por defecto
      if (commandText.includes('ayuda') || commandText.includes('help')) {
        showHelp();
      } else if (commandText.includes('cerrar') || commandText.includes('close')) {
        // Cerrar modales o menús abiertos
        const closeButtons = document.querySelectorAll('[aria-label*="cerrar"], [aria-label*="close"]');
        if (closeButtons.length > 0) {
          (closeButtons[0] as HTMLElement).click();
        }
      } else if (commandText.includes('navegar') || commandText.includes('navigate')) {
        // Navegar al contenido principal
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
        }
      } else {
        announceToScreenReader('Comando no reconocido. Di "ayuda" para ver los comandos disponibles');
      }
    }
  }, [announceToScreenReader]);

  // Mostrar ayuda de comandos
  const showHelp = useCallback(() => {
    const helpText = commandsRef.current.map(cmd => 
      `"${cmd.command}": ${cmd.description}`
    ).join('. ');
    
    announceToScreenReader(`Comandos disponibles: ${helpText}. Comandos adicionales: "ayuda", "cerrar", "navegar"`);
  }, [announceToScreenReader]);

  // Iniciar reconocimiento de voz
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      setError(null);
      recognitionRef.current.start();
    } catch (error) {
      setError('No se pudo iniciar el reconocimiento de voz');
      console.error('Error iniciando reconocimiento:', error);
    }
  }, [isListening]);

  // Detener reconocimiento de voz
  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Error deteniendo reconocimiento:', error);
    }
  }, [isListening]);

  // Alternar reconocimiento de voz
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Limpiar transcripción
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  // Verificar si los comandos de voz están habilitados
  const isVoiceCommandsEnabled = settings.voiceCommands && isSupported;

  return {
    isListening,
    isSupported,
    isVoiceCommandsEnabled,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    toggleListening,
    clearTranscript,
    showHelp
  };
};

export default useVoiceCommands;

