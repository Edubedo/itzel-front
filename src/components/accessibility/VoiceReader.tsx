import React, { useEffect, useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

interface VoiceReaderProps {
  text: string;
  autoRead?: boolean;
  delay?: number;
}

const VoiceReader: React.FC<VoiceReaderProps> = ({ 
  text, 
  autoRead = false, 
  delay = 1000 
}) => {
  const { settings } = useAccessibility();
  const [isReading, setIsReading] = useState(false);

  const readText = (textToRead: string) => {
    if (!settings.voiceEnabled || !('speechSynthesis' in window)) {
      return;
    }

    // Cancelar cualquier lectura anterior
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9; // Velocidad ligeramente más lenta para mejor comprensión
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    speechSynthesis.cancel();
    setIsReading(false);
  };

  useEffect(() => {
    if (autoRead && settings.voiceEnabled && text) {
      const timer = setTimeout(() => {
        readText(text);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [text, autoRead, settings.voiceEnabled, delay]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  if (!settings.voiceEnabled) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => isReading ? stopReading() : readText(text)}
        className="p-2 bg-[#70A18E] hover:bg-[#547A6B] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#70A18E]/50"
        aria-label={isReading ? 'Detener lectura' : 'Leer texto'}
        title={isReading ? 'Detener lectura' : 'Leer texto'}
      >
        {isReading ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
      
      {isReading && (
        <div className="flex items-center gap-1 text-sm text-[#70A18E]">
          <div className="w-2 h-2 bg-[#70A18E] rounded-full animate-pulse"></div>
          <span>Leyendo...</span>
        </div>
      )}
    </div>
  );
};

export default VoiceReader;
