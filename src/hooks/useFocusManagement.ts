import { useRef, useCallback, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

interface FocusManagementOptions {
  trapFocus?: boolean;
  restoreFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  onFocusChange?: (element: HTMLElement | null) => void;
}

export const useFocusManagement = (options: FocusManagementOptions = {}) => {
  const { trapFocus = false, restoreFocus = false, initialFocusRef, onFocusChange } = options;
  const { settings, setFocus, announceToScreenReader } = useAccessibility();
  
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const focusableElements = useRef<HTMLElement[]>([]);

  // Obtener elementos enfocables dentro del contenedor
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([aria-disabled="true"])',
      '[role="menuitem"]',
      '[role="tab"]',
      '[role="option"]'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  // Actualizar lista de elementos enfocables
  const updateFocusableElements = useCallback(() => {
    focusableElements.current = getFocusableElements();
  }, [getFocusableElements]);

  // Enfocar el primer elemento
  const focusFirst = useCallback(() => {
    updateFocusableElements();
    if (focusableElements.current.length > 0) {
      const firstElement = focusableElements.current[0];
      firstElement.focus();
      onFocusChange?.(firstElement);
    }
  }, [updateFocusableElements, onFocusChange]);

  // Enfocar el último elemento
  const focusLast = useCallback(() => {
    updateFocusableElements();
    if (focusableElements.current.length > 0) {
      const lastElement = focusableElements.current[focusableElements.current.length - 1];
      lastElement.focus();
      onFocusChange?.(lastElement);
    }
  }, [updateFocusableElements, onFocusChange]);

  // Enfocar el siguiente elemento
  const focusNext = useCallback(() => {
    updateFocusableElements();
    const currentIndex = focusableElements.current.findIndex(
      el => el === document.activeElement
    );
    
    if (currentIndex >= 0 && currentIndex < focusableElements.current.length - 1) {
      const nextElement = focusableElements.current[currentIndex + 1];
      nextElement.focus();
      onFocusChange?.(nextElement);
    } else if (currentIndex === focusableElements.current.length - 1) {
      // Si estamos en el último elemento, ir al primero
      focusFirst();
    }
  }, [updateFocusableElements, onFocusChange, focusFirst]);

  // Enfocar el elemento anterior
  const focusPrevious = useCallback(() => {
    updateFocusableElements();
    const currentIndex = focusableElements.current.findIndex(
      el => el === document.activeElement
    );
    
    if (currentIndex > 0) {
      const previousElement = focusableElements.current[currentIndex - 1];
      previousElement.focus();
      onFocusChange?.(previousElement);
    } else if (currentIndex === 0) {
      // Si estamos en el primer elemento, ir al último
      focusLast();
    }
  }, [updateFocusableElements, onFocusChange, focusLast]);

  // Restaurar el foco al elemento anterior
  const restorePreviousFocus = useCallback(() => {
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      onFocusChange?.(previousActiveElement.current);
    }
  }, [onFocusChange]);

  // Manejar teclas de navegación
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!containerRef.current?.contains(event.target as Node)) return;

    switch (event.key) {
      case 'Tab':
        if (trapFocus) {
          event.preventDefault();
          if (event.shiftKey) {
            focusPrevious();
          } else {
            focusNext();
          }
        }
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        focusNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        focusPrevious();
        break;
      case 'Home':
        event.preventDefault();
        focusFirst();
        break;
      case 'End':
        event.preventDefault();
        focusLast();
        break;
      case 'Escape':
        if (restoreFocus) {
          restorePreviousFocus();
        }
        break;
    }
  }, [trapFocus, restoreFocus, focusNext, focusPrevious, focusFirst, focusLast, restorePreviousFocus]);

  // Efecto para manejar el foco inicial y la captura de teclas
  useEffect(() => {
    if (containerRef.current) {
      // Guardar el elemento activo anterior
      if (restoreFocus) {
        previousActiveElement.current = document.activeElement as HTMLElement;
      }

      // Enfocar el elemento inicial si se especifica
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        onFocusChange?.(initialFocusRef.current);
      } else {
        focusFirst();
      }

      // Agregar listener de teclas
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [initialFocusRef, restoreFocus, focusFirst, handleKeyDown, onFocusChange]);

  // Efecto para actualizar elementos enfocables cuando cambia el contenido
  useEffect(() => {
    if (containerRef.current) {
      const observer = new MutationObserver(() => {
        updateFocusableElements();
      });

      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'tabindex', 'aria-disabled']
      });

      return () => observer.disconnect();
    }
  }, [updateFocusableElements]);

  // Función para enfocar un elemento específico por ID
  const focusElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      onFocusChange?.(element);
    }
  }, [onFocusChange]);

  // Función para enfocar un elemento específico por selector
  const focusElementBySelector = useCallback((selector: string) => {
    const element = containerRef.current?.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      onFocusChange?.(element);
    }
  }, [onFocusChange]);

  // Función para obtener el elemento actualmente enfocado
  const getCurrentFocusedElement = useCallback(() => {
    return document.activeElement as HTMLElement | null;
  }, []);

  // Función para verificar si un elemento está enfocado
  const isElementFocused = useCallback((element: HTMLElement) => {
    return document.activeElement === element;
  }, []);

  // Función para obtener información de accesibilidad del elemento enfocado
  const getFocusedElementInfo = useCallback(() => {
    const focused = getCurrentFocusedElement();
    if (!focused) return null;

    return {
      element: focused,
      tagName: focused.tagName.toLowerCase(),
      role: focused.getAttribute('role'),
      ariaLabel: focused.getAttribute('aria-label'),
      ariaLabelledBy: focused.getAttribute('aria-labelledby'),
      textContent: focused.textContent?.trim(),
      id: focused.id,
      className: focused.className
    };
  }, [getCurrentFocusedElement]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    focusElement,
    focusElementBySelector,
    getCurrentFocusedElement,
    isElementFocused,
    getFocusedElementInfo,
    updateFocusableElements,
    restorePreviousFocus
  };
};

export default useFocusManagement;

