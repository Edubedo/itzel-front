import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface SpatialAudioNavigationProps {
  children: React.ReactNode;
  onElementFocus?: (element: HTMLElement) => void;
  onElementActivate?: (element: HTMLElement) => void;
}

const SpatialAudioNavigation: React.FC<SpatialAudioNavigationProps> = ({
  children,
  onElementFocus,
  onElementActivate
}) => {
  const { settings, announceToScreenReader } = useAccessibility();
  const [currentElement, setCurrentElement] = useState<HTMLElement | null>(null);
  const [elementIndex, setElementIndex] = useState(0);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Configuración de audio espacial
  const audioConfig = {
    baseFrequency: 440, // Frecuencia base en Hz
    maxFrequency: 880,  // Frecuencia máxima
    minFrequency: 220,  // Frecuencia mínima
    volume: 0.3,        // Volumen base
    panRange: 1.0,      // Rango de panoramización
    duration: 200       // Duración del sonido en ms
  };

  useEffect(() => {
    if (!settings.voiceEnabled) return;

    // Inicializar contexto de audio
    initializeAudioContext();

    // Obtener elementos navegables
    updateNavigableElements();

    // Configurar navegación por teclado
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isNavigating) return;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          navigateToNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          navigateToPrevious();
          break;
        case 'Home':
          event.preventDefault();
          navigateToFirst();
          break;
        case 'End':
          event.preventDefault();
          navigateToLast();
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          activateCurrentElement();
          break;
        case 'Escape':
          event.preventDefault();
          stopNavigation();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cleanupAudio();
    };
  }, [isNavigating, elements, elementIndex]);

  const initializeAudioContext = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      // Crear nodo de ganancia para controlar el volumen
      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNodeRef.current = gainNode;
      
      // Configurar volumen inicial
      gainNode.gain.value = audioConfig.volume;
    } catch (error) {
      console.error('Error inicializando contexto de audio:', error);
    }
  };

  const cleanupAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const updateNavigableElements = () => {
    if (!containerRef.current) return;

    const navigableElements = containerRef.current.querySelectorAll(
      'button, input, select, textarea, a, [tabindex], [role="button"], [role="link"], [role="menuitem"]'
    ) as NodeListOf<HTMLElement>;

    setElements(Array.from(navigableElements));
  };

  const startNavigation = () => {
    setIsNavigating(true);
    announceToScreenReader('Navegación espacial activada. Use las flechas para navegar, Enter para activar, Escape para salir.');
    
    if (elements.length > 0) {
      setElementIndex(0);
      focusElement(elements[0]);
    }
  };

  const stopNavigation = () => {
    setIsNavigating(false);
    announceToScreenReader('Navegación espacial desactivada.');
  };

  const navigateToNext = () => {
    if (elements.length === 0) return;
    
    const nextIndex = (elementIndex + 1) % elements.length;
    setElementIndex(nextIndex);
    focusElement(elements[nextIndex]);
    playSpatialSound(nextIndex, elements.length, 'right');
  };

  const navigateToPrevious = () => {
    if (elements.length === 0) return;
    
    const prevIndex = elementIndex === 0 ? elements.length - 1 : elementIndex - 1;
    setElementIndex(prevIndex);
    focusElement(elements[prevIndex]);
    playSpatialSound(prevIndex, elements.length, 'left');
  };

  const navigateToFirst = () => {
    if (elements.length === 0) return;
    
    setElementIndex(0);
    focusElement(elements[0]);
    playSpatialSound(0, elements.length, 'center');
  };

  const navigateToLast = () => {
    if (elements.length === 0) return;
    
    const lastIndex = elements.length - 1;
    setElementIndex(lastIndex);
    focusElement(elements[lastIndex]);
    playSpatialSound(lastIndex, elements.length, 'center');
  };

  const focusElement = (element: HTMLElement) => {
    element.focus();
    setCurrentElement(element);
    onElementFocus?.(element);
    
    // Anunciar información del elemento
    const elementInfo = getElementInfo(element);
    announceToScreenReader(elementInfo);
  };

  const activateCurrentElement = () => {
    if (currentElement) {
      currentElement.click();
      onElementActivate?.(currentElement);
      playActivationSound();
      announceToScreenReader('Elemento activado');
    }
  };

  const playSpatialSound = (index: number, total: number, direction: 'left' | 'right' | 'center') => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    try {
      // Calcular frecuencia basada en la posición
      const position = index / (total - 1);
      const frequency = audioConfig.minFrequency + 
        (audioConfig.maxFrequency - audioConfig.minFrequency) * position;

      // Crear oscilador
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const pannerNode = audioContextRef.current.createStereoPanner();

      // Configurar frecuencia
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      // Configurar panoramización
      let panValue = 0;
      switch (direction) {
        case 'left':
          panValue = -audioConfig.panRange;
          break;
        case 'right':
          panValue = audioConfig.panRange;
          break;
        case 'center':
          panValue = 0;
          break;
      }
      pannerNode.pan.value = panValue;

      // Configurar volumen con fade in/out
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(audioConfig.volume, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + audioConfig.duration / 1000);

      // Conectar nodos
      oscillator.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(gainNodeRef.current);

      // Reproducir sonido
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + audioConfig.duration / 1000);

      // Limpiar referencia
      oscillatorRef.current = oscillator;
    } catch (error) {
      console.error('Error reproduciendo sonido espacial:', error);
    }
  };

  const playActivationSound = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    try {
      // Sonido de activación: dos tonos ascendentes
      const oscillator1 = audioContextRef.current.createOscillator();
      const oscillator2 = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      // Configurar frecuencias
      oscillator1.frequency.value = 523.25; // C5
      oscillator2.frequency.value = 659.25; // E5
      oscillator1.type = 'sine';
      oscillator2.type = 'sine';

      // Configurar volumen
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(audioConfig.volume * 0.5, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.3);

      // Conectar nodos
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(gainNodeRef.current);

      // Reproducir sonido
      oscillator1.start(audioContextRef.current.currentTime);
      oscillator2.start(audioContextRef.current.currentTime);
      oscillator1.stop(audioContextRef.current.currentTime + 0.3);
      oscillator2.stop(audioContextRef.current.currentTime + 0.3);
    } catch (error) {
      console.error('Error reproduciendo sonido de activación:', error);
    }
  };

  const getElementInfo = (element: HTMLElement): string => {
    const elementType = getElementType(element);
    const elementText = getElementText(element);
    const position = elements.indexOf(element) + 1;
    const total = elements.length;
    
    return `${elementType}: ${elementText}. Posición ${position} de ${total}.`;
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

  if (!settings.voiceEnabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="spatial-audio-navigation">
      {/* Controles de navegación espacial */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={startNavigation}
          disabled={isNavigating}
          className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          aria-label="Iniciar navegación espacial"
        >
          {isNavigating ? 'Navegando...' : '🎵 Navegación Espacial'}
        </button>
        
        <button
          onClick={stopNavigation}
          disabled={!isNavigating}
          className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          aria-label="Detener navegación espacial"
        >
          ⏹️ Detener
        </button>
      </div>

      {/* Indicador de estado */}
      {isNavigating && (
        <div className="fixed top-20 right-4 z-50 bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
          🎵 Navegación espacial activa. Use las flechas para navegar.
        </div>
      )}

      {/* Instrucciones de navegación */}
      {isNavigating && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm">
          <div className="text-center">
            <p className="font-bold mb-2">Navegación Espacial Activa</p>
            <p>Flechas: Navegar | Enter: Activar | Escape: Salir</p>
            <p>Escuche los sonidos para orientarse en la interfaz</p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default SpatialAudioNavigation;
