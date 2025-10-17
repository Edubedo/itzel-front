import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface VoiceNavigationProps {
  children: React.ReactNode;
  onNavigate?: (direction: string) => void;
  onActivate?: () => void;
  onGoBack?: () => void;
  onHelp?: () => void;
}

const VoiceNavigation: React.FC<VoiceNavigationProps> = ({
  children,
  onNavigate,
  onActivate,
  onGoBack,
  onHelp
}) => {
  const { settings, announceToScreenReader } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [currentElement, setCurrentElement] = useState<HTMLElement | null>(null);
  const [elementIndex, setElementIndex] = useState(0);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Comandos de voz en español
  const voiceCommands = {
    'siguiente': 'next',
    'anterior': 'previous',
    'primero': 'first',
    'último': 'last',
    'activar': 'activate',
    'seleccionar': 'select',
    'confirmar': 'confirm',
    'cancelar': 'cancel',
    'atrás': 'back',
    'ayuda': 'help',
    'repetir': 'repeat',
    'menú': 'menu',
    'inicio': 'home',
    'formulario': 'form',
    'botón': 'button',
    'enlace': 'link',
    'campo': 'field',
    'texto': 'text'
  };

  useEffect(() => {
    if (!settings.voiceEnabled) return;

    // Inicializar reconocimiento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        announceToScreenReader('Escuchando comandos de voz...');
      };

      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        handleVoiceCommand(command);
      };

      recognition.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error);
        announceToScreenReader('Error en el reconocimiento de voz');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }

    // Obtener elementos navegables
    updateNavigableElements();

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [settings.voiceEnabled]);

  const updateNavigableElements = () => {
    if (!containerRef.current) return;

    const navigableElements = containerRef.current.querySelectorAll(
      'button, input, select, textarea, a, [tabindex], [role="button"], [role="link"], [role="menuitem"]'
    ) as NodeListOf<HTMLElement>;

    setElements(Array.from(navigableElements));
  };

  const handleVoiceCommand = (command: string) => {
    const normalizedCommand = command.toLowerCase().trim();
    
    // Buscar comando exacto
    if (voiceCommands[normalizedCommand as keyof typeof voiceCommands]) {
      const action = voiceCommands[normalizedCommand as keyof typeof voiceCommands];
      executeCommand(action);
      return;
    }

    // Buscar comando parcial
    for (const [spanish, english] of Object.entries(voiceCommands)) {
      if (normalizedCommand.includes(spanish)) {
        executeCommand(english);
        return;
      }
    }

    // Comando no reconocido
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
      case 'select':
        activateCurrentElement();
        break;
      case 'confirm':
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
        navigateToMenu();
        break;
      case 'home':
        navigateToHome();
        break;
      case 'form':
        navigateToForm();
        break;
      case 'button':
        navigateToButtons();
        break;
      case 'link':
        navigateToLinks();
        break;
      case 'field':
        navigateToFields();
        break;
      case 'text':
        navigateToText();
        break;
    }
  };

  const navigateToNext = () => {
    if (elements.length === 0) return;
    
    const nextIndex = (elementIndex + 1) % elements.length;
    setElementIndex(nextIndex);
    focusElement(elements[nextIndex]);
    announceElement(elements[nextIndex]);
  };

  const navigateToPrevious = () => {
    if (elements.length === 0) return;
    
    const prevIndex = elementIndex === 0 ? elements.length - 1 : elementIndex - 1;
    setElementIndex(prevIndex);
    focusElement(elements[prevIndex]);
    announceElement(elements[prevIndex]);
  };

  const navigateToFirst = () => {
    if (elements.length === 0) return;
    
    setElementIndex(0);
    focusElement(elements[0]);
    announceElement(elements[0]);
  };

  const navigateToLast = () => {
    if (elements.length === 0) return;
    
    const lastIndex = elements.length - 1;
    setElementIndex(lastIndex);
    focusElement(elements[lastIndex]);
    announceElement(elements[lastIndex]);
  };

  const activateCurrentElement = () => {
    if (currentElement) {
      currentElement.click();
      announceToScreenReader('Elemento activado');
    }
  };

  const focusElement = (element: HTMLElement) => {
    element.focus();
    setCurrentElement(element);
  };

  const announceElement = (element: HTMLElement) => {
    const elementType = getElementType(element);
    const elementText = getElementText(element);
    const elementDescription = getElementDescription(element);
    
    const announcement = `${elementType}: ${elementText}. ${elementDescription}`;
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
    }
  };

  const showHelp = () => {
    const helpText = `
      Comandos de voz disponibles:
      - "Siguiente" o "Anterior" para navegar
      - "Primero" o "Último" para ir al inicio o final
      - "Activar" o "Seleccionar" para activar el elemento actual
      - "Atrás" o "Cancelar" para regresar
      - "Ayuda" para repetir estos comandos
      - "Repetir" para repetir el elemento actual
      - "Menú" para ir al menú principal
      - "Inicio" para ir al inicio
      - "Formulario" para ir a los campos de formulario
      - "Botón" para ir a los botones
      - "Enlace" para ir a los enlaces
      - "Campo" para ir a los campos de entrada
      - "Texto" para ir al contenido de texto
    `;
    
    announceToScreenReader(helpText);
    onHelp?.();
  };

  const navigateToMenu = () => {
    const menuElements = elements.filter(el => 
      el.getAttribute('role') === 'menuitem' || 
      el.tagName.toLowerCase() === 'a'
    );
    
    if (menuElements.length > 0) {
      const index = elements.indexOf(menuElements[0]);
      setElementIndex(index);
      focusElement(menuElements[0]);
      announceElement(menuElements[0]);
    }
  };

  const navigateToHome = () => {
    const homeElements = elements.filter(el => 
      el.textContent?.toLowerCase().includes('inicio') ||
      el.textContent?.toLowerCase().includes('home') ||
      el.getAttribute('aria-label')?.toLowerCase().includes('inicio')
    );
    
    if (homeElements.length > 0) {
      const index = elements.indexOf(homeElements[0]);
      setElementIndex(index);
      focusElement(homeElements[0]);
      announceElement(homeElements[0]);
    }
  };

  const navigateToForm = () => {
    const formElements = elements.filter(el => 
      el.tagName.toLowerCase() === 'input' ||
      el.tagName.toLowerCase() === 'select' ||
      el.tagName.toLowerCase() === 'textarea' ||
      el.getAttribute('role') === 'textbox' ||
      el.getAttribute('role') === 'combobox'
    );
    
    if (formElements.length > 0) {
      const index = elements.indexOf(formElements[0]);
      setElementIndex(index);
      focusElement(formElements[0]);
      announceElement(formElements[0]);
    }
  };

  const navigateToButtons = () => {
    const buttonElements = elements.filter(el => 
      el.tagName.toLowerCase() === 'button' ||
      el.getAttribute('role') === 'button'
    );
    
    if (buttonElements.length > 0) {
      const index = elements.indexOf(buttonElements[0]);
      setElementIndex(index);
      focusElement(buttonElements[0]);
      announceElement(buttonElements[0]);
    }
  };

  const navigateToLinks = () => {
    const linkElements = elements.filter(el => 
      el.tagName.toLowerCase() === 'a' ||
      el.getAttribute('role') === 'link'
    );
    
    if (linkElements.length > 0) {
      const index = elements.indexOf(linkElements[0]);
      setElementIndex(index);
      focusElement(linkElements[0]);
      announceElement(linkElements[0]);
    }
  };

  const navigateToFields = () => {
    const fieldElements = elements.filter(el => 
      el.tagName.toLowerCase() === 'input' ||
      el.tagName.toLowerCase() === 'select' ||
      el.tagName.toLowerCase() === 'textarea'
    );
    
    if (fieldElements.length > 0) {
      const index = elements.indexOf(fieldElements[0]);
      setElementIndex(index);
      focusElement(fieldElements[0]);
      announceElement(fieldElements[0]);
    }
  };

  const navigateToText = () => {
    const textElements = elements.filter(el => 
      el.tagName.toLowerCase() === 'p' ||
      el.tagName.toLowerCase() === 'h1' ||
      el.tagName.toLowerCase() === 'h2' ||
      el.tagName.toLowerCase() === 'h3' ||
      el.tagName.toLowerCase() === 'h4' ||
      el.tagName.toLowerCase() === 'h5' ||
      el.tagName.toLowerCase() === 'h6' ||
      el.tagName.toLowerCase() === 'span' ||
      el.tagName.toLowerCase() === 'div'
    );
    
    if (textElements.length > 0) {
      const index = elements.indexOf(textElements[0]);
      setElementIndex(index);
      focusElement(textElements[0]);
      announceElement(textElements[0]);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!settings.voiceEnabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="voice-navigation-container">
      {/* Controles de voz */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={startListening}
          disabled={isListening}
          className="px-3 py-2 bg-[#70A18E] text-white rounded-lg text-sm font-medium disabled:opacity-50"
          aria-label="Iniciar reconocimiento de voz"
        >
          {isListening ? 'Escuchando...' : '🎤 Iniciar Voz'}
        </button>
        
        <button
          onClick={stopListening}
          disabled={!isListening}
          className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          aria-label="Detener reconocimiento de voz"
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
        <div className="fixed top-20 left-4 z-50 bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-medium animate-pulse">
          🎤 Escuchando comandos de voz...
        </div>
      )}

      {children}
    </div>
  );
};

export default VoiceNavigation;
