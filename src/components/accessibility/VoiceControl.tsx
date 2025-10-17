import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface VoiceControlProps {
  children: React.ReactNode;
  onNavigate?: (direction: string) => void;
  onActivate?: () => void;
  onGoBack?: () => void;
  onHelp?: () => void;
  onMenu?: () => void;
  onHome?: () => void;
  onForm?: () => void;
  onButton?: () => void;
  onLink?: () => void;
  onField?: () => void;
  onText?: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  children,
  onNavigate,
  onActivate,
  onGoBack,
  onHelp,
  onMenu,
  onHome,
  onForm,
  onButton,
  onLink,
  onField,
  onText
}) => {
  const { settings, announceToScreenReader } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [currentElement, setCurrentElement] = useState<HTMLElement | null>(null);
  const [elementIndex, setElementIndex] = useState(0);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = useRef<SpeechSynthesisUtterance | null>(null);

  // Comandos de voz en español con variaciones
  const voiceCommands = {
    // Navegación básica
    'siguiente': 'next',
    'siguiente elemento': 'next',
    'adelante': 'next',
    'anterior': 'previous',
    'elemento anterior': 'previous',
    'atrás': 'previous',
    'primero': 'first',
    'primer elemento': 'first',
    'inicio': 'first',
    'último': 'last',
    'último elemento': 'last',
    'final': 'last',
    
    // Activación
    'activar': 'activate',
    'seleccionar': 'activate',
    'hacer clic': 'activate',
    'pulsar': 'activate',
    'confirmar': 'activate',
    'aceptar': 'activate',
    'sí': 'activate',
    'ok': 'activate',
    
    // Navegación específica
    'menú': 'menu',
    'ir al menú': 'menu',
    'mostrar menú': 'menu',
    'página principal': 'home',
    'ir al inicio': 'home',
    'inicio': 'home',
    'formulario': 'form',
    'ir al formulario': 'form',
    'campos': 'form',
    'botón': 'button',
    'botones': 'button',
    'enlace': 'link',
    'enlaces': 'link',
    'campo': 'field',
    'campos de entrada': 'field',
    'texto': 'text',
    'contenido': 'text',
    
    // Acciones
    'cancelar': 'cancel',
    'no': 'cancel',
    'atrás': 'back',
    'regresar': 'back',
    'volver': 'back',
    'ayuda': 'help',
    'mostrar ayuda': 'help',
    'repetir': 'repeat',
    'repetir elemento': 'repeat',
    'qué hay aquí': 'repeat',
    'describir': 'repeat',
    
    // Control del sistema
    'iniciar': 'start',
    'comenzar': 'start',
    'empezar': 'start',
    'parar': 'stop',
    'detener': 'stop',
    'pausar': 'stop',
    'continuar': 'continue',
    'siguiente paso': 'continue',
    'terminar': 'finish',
    'finalizar': 'finish',
    'salir': 'exit',
    'cerrar': 'exit'
  };

  useEffect(() => {
    if (!settings.voiceEnabled) return;

    // Inicializar reconocimiento de voz
    initializeVoiceRecognition();

    // Obtener elementos navegables
    updateNavigableElements();

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [settings.voiceEnabled]);

  const initializeVoiceRecognition = async () => {
    try {
      // Verificar soporte del navegador
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        announceToScreenReader('Su navegador no soporta reconocimiento de voz. Por favor use Chrome o Edge.');
        return;
      }

      // Solicitar permiso de micrófono
      await requestMicrophonePermission();

      // Configurar reconocimiento de voz
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        announceToScreenReader('Escuchando comandos de voz...');
      };

      recognition.onresult = (event: any) => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        const results = event.results;
        const lastResult = results[results.length - 1];
        
        if (lastResult.isFinal) {
          const command = lastResult[0].transcript.toLowerCase().trim();
          console.log('Comando reconocido:', command);
          handleVoiceCommand(command);
        }
        
        setTimeout(() => setIsProcessing(false), 500);
      };

      recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        
        switch (event.error) {
          case 'no-speech':
            announceToScreenReader('No se detectó voz. Intente hablar más fuerte.');
            break;
          case 'audio-capture':
            announceToScreenReader('Error de micrófono. Verifique que esté conectado.');
            break;
          case 'not-allowed':
            announceToScreenReader('Permiso de micrófono denegado. Por favor permita el acceso al micrófono.');
            break;
          case 'network':
            announceToScreenReader('Error de red. Verifique su conexión a internet.');
            break;
          default:
            announceToScreenReader('Error en el reconocimiento de voz. Intente nuevamente.');
        }
        
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Reiniciar automáticamente si estaba escuchando
        if (isPermissionGranted && settings.voiceEnabled) {
          setTimeout(() => {
            if (recognition && !isListening) {
              recognition.start();
            }
          }, 1000);
        }
      };

      setRecognition(recognition);
      setIsInitialized(true);
      
    } catch (error) {
      console.error('Error inicializando reconocimiento de voz:', error);
      announceToScreenReader('Error inicializando el sistema de voz. Por favor recargue la página.');
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsPermissionGranted(true);
      announceToScreenReader('Permiso de micrófono concedido. Sistema de voz activado.');
      
      // Detener el stream ya que solo necesitamos el permiso
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Error solicitando permiso de micrófono:', error);
      setIsPermissionGranted(false);
      announceToScreenReader('Permiso de micrófono denegado. El sistema de voz no funcionará correctamente.');
    }
  };

  const updateNavigableElements = () => {
    if (!containerRef.current) return;

    const navigableElements = containerRef.current.querySelectorAll(
      'button, input, select, textarea, a, [tabindex], [role="button"], [role="link"], [role="menuitem"], [role="tab"], [role="option"]'
    ) as NodeListOf<HTMLElement>;

    setElements(Array.from(navigableElements));
  };

  const handleVoiceCommand = (command: string) => {
    const normalizedCommand = command.toLowerCase().trim();
    console.log('Comando recibido:', normalizedCommand);
    
    // Buscar comando exacto
    if (voiceCommands[normalizedCommand as keyof typeof voiceCommands]) {
      const action = voiceCommands[normalizedCommand as keyof typeof voiceCommands];
      console.log('Comando exacto encontrado:', action);
      executeCommand(action);
      return;
    }

    // Buscar comando parcial con mejor lógica
    for (const [spanish, english] of Object.entries(voiceCommands)) {
      // Buscar si el comando contiene la palabra clave
      if (normalizedCommand.includes(spanish) || spanish.includes(normalizedCommand)) {
        console.log('Comando parcial encontrado:', spanish, '->', english);
        executeCommand(english);
        return;
      }
    }

    // Buscar comandos específicos que podrían no estar siendo reconocidos
    if (normalizedCommand.includes('siguiente') || normalizedCommand.includes('adelante')) {
      console.log('Comando siguiente detectado');
      executeCommand('next');
      return;
    }
    
    if (normalizedCommand.includes('anterior') || normalizedCommand.includes('atrás')) {
      console.log('Comando anterior detectado');
      executeCommand('previous');
      return;
    }
    
    if (normalizedCommand.includes('ayuda') || normalizedCommand.includes('help')) {
      console.log('Comando ayuda detectado');
      executeCommand('help');
      return;
    }
    
    if (normalizedCommand.includes('activar') || normalizedCommand.includes('seleccionar')) {
      console.log('Comando activar detectado');
      executeCommand('activate');
      return;
    }

    // Comando no reconocido
    console.log('Comando no reconocido:', normalizedCommand);
    announceToScreenReader(`Comando no reconocido: ${command}. Diga "ayuda" para ver los comandos disponibles.`);
  };

  const executeCommand = (action: string) => {
    switch (action) {
      case 'next':
        navigateToNext();
        break;
      case 'previous':
        navigateToPrevious();
        break;
      case 'first':
        navigateToFirst();
        break;
      case 'last':
        navigateToLast();
        break;
      case 'activate':
        activateCurrentElement();
        break;
      case 'cancel':
        onGoBack?.();
        break;
      case 'back':
        onGoBack?.();
        break;
      case 'help':
        showHelp();
        break;
      case 'repeat':
        repeatCurrentElement();
        break;
      case 'menu':
        onMenu?.();
        break;
      case 'home':
        onHome?.();
        break;
      case 'form':
        onForm?.();
        break;
      case 'button':
        onButton?.();
        break;
      case 'link':
        onLink?.();
        break;
      case 'field':
        onField?.();
        break;
      case 'text':
        onText?.();
        break;
      case 'start':
        startListening();
        break;
      case 'stop':
        stopListening();
        break;
      case 'continue':
        continueListening();
        break;
      case 'finish':
        finishNavigation();
        break;
      case 'exit':
        exitVoiceControl();
        break;
    }
  };

  const navigateToNext = () => {
    if (elements.length === 0) {
      announceToScreenReader('No hay elementos para navegar.');
      return;
    }
    
    const nextIndex = (elementIndex + 1) % elements.length;
    setElementIndex(nextIndex);
    focusElement(elements[nextIndex]);
    announceElement(elements[nextIndex]);
    console.log('Navegando al siguiente elemento:', nextIndex, 'de', elements.length);
  };

  const navigateToPrevious = () => {
    if (elements.length === 0) {
      announceToScreenReader('No hay elementos para navegar.');
      return;
    }
    
    const prevIndex = elementIndex === 0 ? elements.length - 1 : elementIndex - 1;
    setElementIndex(prevIndex);
    focusElement(elements[prevIndex]);
    announceElement(elements[prevIndex]);
  };

  const navigateToFirst = () => {
    if (elements.length === 0) {
      announceToScreenReader('No hay elementos para navegar.');
      return;
    }
    
    setElementIndex(0);
    focusElement(elements[0]);
    announceElement(elements[0]);
  };

  const navigateToLast = () => {
    if (elements.length === 0) {
      announceToScreenReader('No hay elementos para navegar.');
      return;
    }
    
    const lastIndex = elements.length - 1;
    setElementIndex(lastIndex);
    focusElement(elements[lastIndex]);
    announceElement(elements[lastIndex]);
  };

  const activateCurrentElement = () => {
    if (currentElement) {
      console.log('Activando elemento:', currentElement);
      currentElement.click();
      onActivate?.();
      announceToScreenReader('Elemento activado');
    } else {
      console.log('No hay elemento seleccionado para activar');
      announceToScreenReader('No hay elemento seleccionado para activar.');
    }
  };

  const focusElement = (element: HTMLElement) => {
    element.focus();
    setCurrentElement(element);
    onNavigate?.('focus');
  };

  const announceElement = (element: HTMLElement) => {
    const elementType = getElementType(element);
    const elementText = getElementText(element);
    const elementDescription = getElementDescription(element);
    const position = elements.indexOf(element) + 1;
    const total = elements.length;
    
    const announcement = `${elementType}: ${elementText}. ${elementDescription} Posición ${position} de ${total}.`;
    announceToScreenReader(announcement);
  };

  const getElementType = (element: HTMLElement): string => {
    const tagName = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    
    if (role) {
      switch (role) {
        case 'button': return 'Botón';
        case 'link': return 'Enlace';
        case 'menuitem': return 'Elemento de menú';
        case 'tab': return 'Pestaña';
        case 'option': return 'Opción';
        case 'textbox': return 'Campo de texto';
        case 'checkbox': return 'Casilla de verificación';
        case 'radio': return 'Botón de opción';
        case 'combobox': return 'Lista desplegable';
        default: return 'Elemento';
      }
    }
    
    switch (tagName) {
      case 'button': return 'Botón';
      case 'a': return 'Enlace';
      case 'input': return 'Campo de entrada';
      case 'select': return 'Lista desplegable';
      case 'textarea': return 'Área de texto';
      default: return 'Elemento';
    }
  };

  const getElementText = (element: HTMLElement): string => {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    const textContent = element.textContent?.trim();
    if (textContent) return textContent;
    
    const placeholder = element.getAttribute('placeholder');
    if (placeholder) return placeholder;
    
    const value = element.getAttribute('value');
    if (value) return value;
    
    return 'Sin texto';
  };

  const getElementDescription = (element: HTMLElement): string => {
    const ariaDescribedBy = element.getAttribute('aria-describedby');
    if (ariaDescribedBy) {
      const describedElement = document.getElementById(ariaDescribedBy);
      if (describedElement) {
        return describedElement.textContent || '';
      }
    }
    
    const ariaDescription = element.getAttribute('aria-description');
    if (ariaDescription) return ariaDescription;
    
    return '';
  };

  const repeatCurrentElement = () => {
    if (currentElement) {
      announceElement(currentElement);
    } else {
      announceToScreenReader('No hay elemento seleccionado para repetir.');
    }
  };

  const showHelp = () => {
    const helpText = `Comandos de voz disponibles: Navegación: Siguiente o Adelante para ir al siguiente elemento, Anterior o Atrás para ir al elemento anterior, Primero o Inicio para ir al primer elemento, Último o Final para ir al último elemento. Activación: Activar o Seleccionar para activar el elemento actual, Hacer clic o Pulsar para hacer clic, Confirmar o Aceptar para confirmar. Navegación específica: Menú para ir al menú principal, Página principal para ir al inicio, Formulario para ir a los campos, Botón para ir a los botones, Enlace para ir a los enlaces, Campo para ir a los campos de entrada, Texto para ir al contenido de texto. Control: Ayuda para repetir estos comandos, Repetir para repetir el elemento actual, Iniciar para comenzar a escuchar, Parar para detener la escucha, Salir para salir del control por voz.`;
    
    // Usar síntesis de voz para leer la ayuda
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(helpText);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.current = utterance;
      speechSynthesis.speak(utterance);
    }
    
    announceToScreenReader(helpText);
    onHelp?.();
  };

  const startListening = () => {
    if (recognition && !isListening && isPermissionGranted) {
      recognition.start();
      announceToScreenReader('Iniciando escucha de comandos de voz...');
    } else if (!isPermissionGranted) {
      announceToScreenReader('Primero debe conceder permiso de micrófono.');
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      announceToScreenReader('Deteniendo escucha de comandos de voz...');
    }
  };

  const continueListening = () => {
    if (recognition && !isListening && isPermissionGranted) {
      recognition.start();
      announceToScreenReader('Continuando escucha de comandos de voz...');
    }
  };

  const finishNavigation = () => {
    if (currentElement) {
      activateCurrentElement();
    }
  };

  const exitVoiceControl = () => {
    stopListening();
    announceToScreenReader('Saliendo del control por voz...');
  };

  if (!settings.voiceEnabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="voice-control-container">
      {/* Controles de voz */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={startListening}
          disabled={isListening || !isPermissionGranted}
          className="px-3 py-2 bg-[#70A18E] text-white rounded-lg text-sm font-medium disabled:opacity-50"
          aria-label="Iniciar control por voz"
        >
          {isListening ? '🎤 Escuchando...' : '🎤 Iniciar Voz'}
        </button>
        
        <button
          onClick={stopListening}
          disabled={!isListening}
          className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          aria-label="Detener control por voz"
        >
          ⏹️ Detener
        </button>
        
        <button
          onClick={showHelp}
          className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
          aria-label="Mostrar ayuda de comandos de voz"
        >
          ❓ Ayuda
        </button>
      </div>

      {/* Indicador de estado */}
      {isListening && (
        <div className="fixed top-20 left-4 z-50 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium animate-pulse">
          🎤 Escuchando comandos de voz...
        </div>
      )}

      {/* Indicador de permiso */}
      {!isPermissionGranted && (
        <div className="fixed top-20 left-4 z-50 bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
          ⚠️ Permiso de micrófono requerido
        </div>
      )}

      {/* Instrucciones de uso */}
      {isInitialized && isPermissionGranted && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm">
          <div className="text-center">
            <p className="font-bold mb-2">Control por Voz Activo</p>
            <p>Diga "ayuda" para ver todos los comandos disponibles</p>
            <p>Diga "siguiente" para navegar, "activar" para seleccionar</p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default VoiceControl;
