import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface ScreenReaderContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  announcePageChange: (pageTitle: string) => void;
  announceFormError: (fieldName: string, errorMessage: string) => void;
  announceFormSuccess: (fieldName: string) => void;
  announceNavigation: (destination: string) => void;
  announceLoading: (isLoading: boolean, message?: string) => void;
  announceCount: (count: number, itemType: string) => void;
  announceSelection: (selectedItem: string, totalItems: number) => void;
}

const ScreenReaderContext = createContext<ScreenReaderContextType | undefined>(undefined);

export const useScreenReader = () => {
  const context = useContext(ScreenReaderContext);
  if (!context) {
    throw new Error('useScreenReader debe ser usado dentro de un ScreenReaderProvider');
  }
  return context;
};

interface ScreenReaderProviderProps {
  children: ReactNode;
}

export const ScreenReaderProvider: React.FC<ScreenReaderProviderProps> = ({ children }) => {
  const { settings, announceToScreenReader } = useAccessibility();
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Función principal para anunciar mensajes
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (settings.screenReaderVerbosity === 'minimal') return;
    
    announceToScreenReader(message, priority);
    
    // Agregar a la lista de anuncios para debugging
    setAnnouncements(prev => [...prev.slice(-4), message]);
  };

  // Anunciar cambio de página
  const announcePageChange = (pageTitle: string) => {
    announce(`Navegando a ${pageTitle}`, 'polite');
  };

  // Anunciar error de formulario
  const announceFormError = (fieldName: string, errorMessage: string) => {
    announce(`Error en ${fieldName}: ${errorMessage}`, 'assertive');
  };

  // Anunciar éxito de formulario
  const announceFormSuccess = (fieldName: string) => {
    announce(`${fieldName} completado correctamente`, 'polite');
  };

  // Anunciar navegación
  const announceNavigation = (destination: string) => {
    announce(`Navegando a ${destination}`, 'polite');
  };

  // Anunciar estado de carga
  const announceLoading = (isLoading: boolean, message?: string) => {
    if (isLoading) {
      announce(message || 'Cargando contenido...', 'polite');
    } else {
      announce('Carga completada', 'polite');
    }
  };

  // Anunciar conteo de elementos
  const announceCount = (count: number, itemType: string) => {
    const message = count === 1 
      ? `1 ${itemType}` 
      : `${count} ${itemType}s`;
    announce(message, 'polite');
  };

  // Anunciar selección
  const announceSelection = (selectedItem: string, totalItems: number) => {
    announce(`${selectedItem} seleccionado, ${totalItems} elementos disponibles`, 'polite');
  };

  // Efecto para limpiar anuncios antiguos
  useEffect(() => {
    if (announcements.length > 5) {
      setAnnouncements(prev => prev.slice(-5));
    }
  }, [announcements]);

  const value: ScreenReaderContextType = {
    announce,
    announcePageChange,
    announceFormError,
    announceFormSuccess,
    announceNavigation,
    announceLoading,
    announceCount,
    announceSelection
  };

  return (
    <ScreenReaderContext.Provider value={value}>
      {children}
      {/* Región de anuncios para lectores de pantalla */}
      <div
        id="screen-reader-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements.map((announcement, index) => (
          <div key={index} className="sr-only">
            {announcement}
          </div>
        ))}
      </div>
    </ScreenReaderContext.Provider>
  );
};

export default ScreenReaderProvider;

