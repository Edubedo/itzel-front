import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface FocusIndicatorProps {
  children: React.ReactNode;
  className?: string;
  showFocusRing?: boolean;
  focusColor?: string;
  focusSize?: 'small' | 'medium' | 'large';
}

const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  children,
  className = "",
  showFocusRing = true,
  focusColor,
  focusSize
}) => {
  const { settings } = useAccessibility();
  const [isFocused, setIsFocused] = useState(false);
  const [focusPosition, setFocusPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const currentFocusSize = focusSize || settings.focusSize;
  const currentFocusColor = focusColor || (settings.highContrastMode ? '#0000ff' : '#465fff');

  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        setIsFocused(true);
        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        setFocusPosition({
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height
        });
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        // Pequeño delay para permitir que el nuevo foco se establezca
        setTimeout(() => {
          if (!containerRef.current?.contains(document.activeElement as Node)) {
            setIsFocused(false);
          }
        }, 10);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const getFocusRingStyles = () => {
    const baseSize = currentFocusSize === 'small' ? 2 : currentFocusSize === 'large' ? 4 : 3;
    const offset = baseSize + 2;
    
    return {
      position: 'absolute' as const,
      left: `${focusPosition.x - offset}px`,
      top: `${focusPosition.y - offset}px`,
      width: `${focusPosition.width + (offset * 2)}px`,
      height: `${focusPosition.height + (offset * 2)}px`,
      border: `${baseSize}px solid ${currentFocusColor}`,
      borderRadius: '8px',
      pointerEvents: 'none' as const,
      zIndex: 1000,
      boxShadow: `0 0 0 ${baseSize}px ${currentFocusColor}20`,
      transition: 'all 0.2s ease-in-out'
    };
  };

  if (!showFocusRing) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      {isFocused && (
        <div
          style={getFocusRingStyles()}
          className="focus-indicator"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default FocusIndicator;

