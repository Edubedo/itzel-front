import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface ScreenReaderAnnouncementsProps {
  announcements: string[];
  priority?: 'polite' | 'assertive';
  className?: string;
}

const ScreenReaderAnnouncements: React.FC<ScreenReaderAnnouncementsProps> = ({
  announcements,
  priority = 'polite',
  className = ''
}) => {
  const { settings } = useAccessibility();
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcements.length > 0 && announcementRef.current) {
      // Limpiar anuncios anteriores
      announcementRef.current.innerHTML = '';
      
      // Crear nuevo elemento de anuncio
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = announcements[announcements.length - 1];
      
      announcementRef.current.appendChild(announcement);
      
      // Remover el elemento después de un tiempo
      setTimeout(() => {
        if (announcementRef.current?.contains(announcement)) {
          announcementRef.current.removeChild(announcement);
        }
      }, 1000);
    }
  }, [announcements, priority]);

  // No renderizar nada si no hay anuncios o si la verbosidad es mínima
  if (announcements.length === 0 || settings.screenReaderVerbosity === 'minimal') {
    return null;
  }

  return (
    <div
      ref={announcementRef}
      className={`sr-only ${className}`}
      aria-live={priority}
      aria-atomic="true"
    />
  );
};

export default ScreenReaderAnnouncements;

