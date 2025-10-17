import React, { useEffect, useRef } from 'react';

interface KeyboardNavigationProps {
  children: React.ReactNode;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
}

const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onTab,
  onShiftTab,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Solo manejar eventos si el contenedor está enfocado
      if (!containerRef.current?.contains(document.activeElement)) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onEscape?.();
          break;
        case 'Enter':
          event.preventDefault();
          onEnter?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onArrowRight?.();
          break;
        case 'Tab':
          if (event.shiftKey) {
            event.preventDefault();
            onShiftTab?.();
          } else {
            event.preventDefault();
            onTab?.();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, onShiftTab]);

  return (
    <div ref={containerRef} tabIndex={0} className="focus:outline-none">
      {children}
    </div>
  );
};

export default KeyboardNavigation;
