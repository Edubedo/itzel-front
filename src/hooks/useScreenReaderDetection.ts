import { useState, useEffect } from 'react';

interface ScreenReaderInfo {
  isActive: boolean;
  name: string | null;
  version: string | null;
  detected: boolean;
}

export const useScreenReaderDetection = () => {
  const [screenReaderInfo, setScreenReaderInfo] = useState<ScreenReaderInfo>({
    isActive: false,
    name: null,
    version: null,
    detected: false
  });

  useEffect(() => {
    const detectScreenReader = () => {
      const info: ScreenReaderInfo = {
        isActive: false,
        name: null,
        version: null,
        detected: false
      };

      // Detectar NVDA (Windows)
      if (window.navigator.userAgent.includes('Windows')) {
        const nvdaElements = document.querySelectorAll('[aria-live], [role="status"], [role="alert"]');
        if (nvdaElements.length > 0) {
          info.isActive = true;
          info.name = 'NVDA';
          info.detected = true;
        }
      }

      // Detectar JAWS (Windows)
      if (window.navigator.userAgent.includes('Windows')) {
        const jawsElements = document.querySelectorAll('[aria-label], [aria-labelledby]');
        if (jawsElements.length > 0 && window.speechSynthesis) {
          info.isActive = true;
          info.name = 'JAWS';
          info.detected = true;
        }
      }

      // Detectar VoiceOver (macOS/iOS)
      if (window.navigator.userAgent.includes('Mac') || window.navigator.userAgent.includes('iPhone') || window.navigator.userAgent.includes('iPad')) {
        const voiceOverElements = document.querySelectorAll('[aria-hidden="true"]');
        if (voiceOverElements.length > 0) {
          info.isActive = true;
          info.name = 'VoiceOver';
          info.detected = true;
        }
      }

      // Detectar TalkBack (Android)
      if (window.navigator.userAgent.includes('Android')) {
        const talkBackElements = document.querySelectorAll('[role="button"], [role="link"]');
        if (talkBackElements.length > 0) {
          info.isActive = true;
          info.name = 'TalkBack';
          info.detected = true;
        }
      }

      // Detectar Orca (Linux)
      if (window.navigator.userAgent.includes('Linux')) {
        const orcaElements = document.querySelectorAll('[tabindex]');
        if (orcaElements.length > 0) {
          info.isActive = true;
          info.name = 'Orca';
          info.detected = true;
        }
      }

      // Detectar lectores de pantalla genéricos
      if (!info.detected) {
        // Verificar si hay elementos de accesibilidad
        const accessibilityElements = document.querySelectorAll(
          '[aria-label], [aria-labelledby], [aria-describedby], [role], [tabindex]'
        );
        
        if (accessibilityElements.length > 10) {
          info.isActive = true;
          info.name = 'Screen Reader';
          info.detected = true;
        }
      }

      // Verificar preferencias de usuario
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        info.isActive = true;
        if (!info.name) {
          info.name = 'Screen Reader';
          info.detected = true;
        }
      }

      setScreenReaderInfo(info);
    };

    // Detectar inmediatamente
    detectScreenReader();

    // Detectar cambios en el DOM
    const observer = new MutationObserver(() => {
      detectScreenReader();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-label', 'aria-labelledby', 'aria-describedby', 'role', 'tabindex']
    });

    // Detectar cambios en preferencias del usuario
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMediaChange = () => {
      detectScreenReader();
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Función para verificar si un lector de pantalla está activo
  const isScreenReaderActive = () => {
    return screenReaderInfo.isActive;
  };

  // Función para obtener información del lector de pantalla
  const getScreenReaderInfo = () => {
    return screenReaderInfo;
  };

  // Función para simular activación de lector de pantalla (para testing)
  const simulateScreenReader = (name: string) => {
    setScreenReaderInfo({
      isActive: true,
      name,
      version: '1.0.0',
      detected: true
    });
  };

  // Función para desactivar detección de lector de pantalla
  const disableScreenReaderDetection = () => {
    setScreenReaderInfo({
      isActive: false,
      name: null,
      version: null,
      detected: false
    });
  };

  return {
    screenReaderInfo,
    isScreenReaderActive,
    getScreenReaderInfo,
    simulateScreenReader,
    disableScreenReaderDetection
  };
};

export default useScreenReaderDetection;

