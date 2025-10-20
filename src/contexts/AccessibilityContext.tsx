import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para las configuraciones de accesibilidad
interface AccessibilitySettings {
  // Escalado de texto
  textSize: number; // 80 a 200
  // Contraste alto
  highContrast: boolean;
  // Reducción de animaciones
  reducedMotion: boolean;
  // Comandos de voz
  voiceCommands: boolean;
  // Anuncios para lectores de pantalla
  screenReaderAnnouncements: boolean;
  // Nivel de verbosidad para lectores de pantalla
  screenReaderVerbosity: 'low' | 'medium' | 'high';
  // Navegación por teclado
  keyboardNavigation: boolean;
  // Atajos de teclado
  keyboardShortcuts: boolean;
}

// Configuración por defecto
const defaultSettings: AccessibilitySettings = {
  textSize: 100,
  highContrast: false,
  reducedMotion: false,
  voiceCommands: false,
  screenReaderAnnouncements: true,
  screenReaderVerbosity: 'medium',
  keyboardNavigation: true,
  keyboardShortcuts: true
};

// Contexto de accesibilidad
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  // Funciones de utilidad
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  // Estado de comandos de voz
  isVoiceCommandActive: boolean;
  setVoiceCommandActive: (active: boolean) => void;
  // Funciones de navegación
  setFocus: (elementId: string) => void;
  // Funciones de teclado
  handleKeyboardShortcuts: (event: KeyboardEvent) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe ser usado dentro de un AccessibilityProvider');
  }
  return context;
};

// Props del provider
interface AccessibilityProviderProps {
  children: ReactNode;
}

// Provider del contexto
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isVoiceCommandActive, setIsVoiceCommandActive] = useState(false);

  // Cargar configuraciones guardadas al inicializar
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch (error) {
        console.warn('Error al cargar configuraciones de accesibilidad:', error);
      }
    }
  }, []);

  // Guardar configuraciones cuando cambien
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Aplicar configuraciones de escalado de texto
  useEffect(() => {
    document.body.className = document.body.className.split(' ').filter(c => !c.startsWith('text-scale-')).join(' ');
    document.body.classList.add(`text-scale-${settings.textSize}`);
  }, [settings.textSize]);

  // Aplicar modo de alto contraste
  useEffect(() => {
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  }, [settings.highContrast]);

  // Aplicar reducción de movimiento
  useEffect(() => {
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [settings.reducedMotion]);

  // Función para actualizar una configuración específica
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Función para resetear todas las configuraciones
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // Función para anunciar mensajes a lectores de pantalla
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.screenReaderAnnouncements) return;
    
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remover el elemento después de un tiempo
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  // Función para establecer el foco en un elemento específico
  const setFocus = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      // Anunciar el cambio de foco para lectores de pantalla
      const label = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.textContent ||
                   'Elemento enfocado';
      announce(`Enfocado: ${label}`);
    }
  };

  // Función para activar/desactivar comandos de voz
  const setVoiceCommandActive = (active: boolean) => {
    setIsVoiceCommandActive(active);
    if (active) {
      announce('Comandos de voz activados');
    } else {
      announce('Comandos de voz desactivados');
    }
  };

  // Función para manejar atajos de teclado
  const handleKeyboardShortcuts = (event: KeyboardEvent) => {
    if (!settings.keyboardShortcuts) return;

    // Alt + A para abrir accesibilidad
    if (event.altKey && event.key === 'a') {
      event.preventDefault();
      const accessibilityButton = document.querySelector('[aria-label*="accesibilidad"], [aria-label*="Accesibilidad"]') as HTMLElement;
      if (accessibilityButton) {
        accessibilityButton.click();
        announce('Panel de accesibilidad abierto');
      }
    }

    // Esc para cerrar modales
    if (event.key === 'Escape') {
      const modal = document.querySelector('[role="dialog"]') as HTMLElement;
      if (modal) {
        const closeButton = modal.querySelector('[aria-label*="cerrar"], [aria-label*="Cerrar"]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    }

    // Tab para navegación mejorada
    if (event.key === 'Tab') {
      const focusedElement = document.activeElement as HTMLElement;
      if (focusedElement) {
        const label = focusedElement.getAttribute('aria-label') || 
                     focusedElement.textContent ||
                     focusedElement.tagName;
        announce(`Navegando a: ${label}`);
      }
    }
  };

  // Configurar atajos de teclado
  useEffect(() => {
    if (settings.keyboardShortcuts) {
      document.addEventListener('keydown', handleKeyboardShortcuts);
      return () => {
        document.removeEventListener('keydown', handleKeyboardShortcuts);
      };
    }
  }, [settings.keyboardShortcuts]);

  const value: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    announce,
    isVoiceCommandActive,
    setVoiceCommandActive,
    setFocus,
    handleKeyboardShortcuts
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityContext;