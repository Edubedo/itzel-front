import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface ColorContrastCheckerProps {
  className?: string;
}

interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  color1: string;
  color2: string;
  textSize: 'normal' | 'large';
}

const ColorContrastChecker: React.FC<ColorContrastCheckerProps> = ({ className = "" }) => {
  const { settings } = useAccessibility();
  const [contrastResults, setContrastResults] = useState<ContrastResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  // Función para convertir color hex a RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Función para calcular luminancia relativa
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Función para calcular contraste
  const getContrast = (color1: string, color2: string): number => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  };

  // Función para determinar el nivel de contraste
  const getContrastLevel = (ratio: number, textSize: 'normal' | 'large'): ContrastResult['level'] => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return textSize === 'large' ? 'AA Large' : 'AA';
    if (ratio >= 3) return textSize === 'large' ? 'AA' : 'Fail';
    return 'Fail';
  };

  // Función para verificar contraste de elementos
  const checkElementContrast = (element: HTMLElement): ContrastResult[] => {
    const results: ContrastResult[] = [];
    const computedStyle = window.getComputedStyle(element);
    
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    const fontSize = parseFloat(computedStyle.fontSize);
    
    // Convertir colores a hex
    const bgHex = rgbToHex(backgroundColor);
    const textHex = rgbToHex(color);
    
    if (bgHex && textHex) {
      const ratio = getContrast(bgHex, textHex);
      const textSize = fontSize >= 18 ? 'large' : 'normal';
      const level = getContrastLevel(ratio, textSize);
      
      results.push({
        ratio: Math.round(ratio * 100) / 100,
        level,
        color1: textHex,
        color2: bgHex,
        textSize
      });
    }
    
    return results;
  };

  // Función para convertir RGB a hex
  const rgbToHex = (rgb: string): string | null => {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return null;
    
    const [, r, g, b] = match.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  // Función para verificar contraste de toda la página
  const checkPageContrast = () => {
    setIsChecking(true);
    const results: ContrastResult[] = [];
    
    // Elementos a verificar
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p, span, div',
      'button',
      'input',
      'a',
      '[role="button"]',
      '[role="link"]'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const elementResults = checkElementContrast(element as HTMLElement);
        results.push(...elementResults);
      });
    });
    
    // Eliminar duplicados
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => 
        r.color1 === result.color1 && 
        r.color2 === result.color2 && 
        r.textSize === result.textSize
      )
    );
    
    setContrastResults(uniqueResults);
    setIsChecking(false);
  };

  // Verificar contraste al cargar el componente
  useEffect(() => {
    checkPageContrast();
  }, []);

  // Verificar contraste cuando cambie el modo de alto contraste
  useEffect(() => {
    if (settings.highContrastMode) {
      setTimeout(checkPageContrast, 100);
    }
  }, [settings.highContrastMode]);

  const getLevelColor = (level: ContrastResult['level']) => {
    switch (level) {
      case 'AAA': return 'text-green-600 dark:text-green-400';
      case 'AA': return 'text-blue-600 dark:text-blue-400';
      case 'AA Large': return 'text-yellow-600 dark:text-yellow-400';
      case 'Fail': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getLevelIcon = (level: ContrastResult['level']) => {
    switch (level) {
      case 'AAA': return '✅';
      case 'AA': return '✅';
      case 'AA Large': return '⚠️';
      case 'Fail': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Verificador de Contraste de Colores
        </h2>
        <button
          onClick={checkPageContrast}
          disabled={isChecking}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          {isChecking ? 'Verificando...' : 'Verificar Contraste'}
        </button>
      </div>

      {contrastResults.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contrastResults.map((result, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getLevelIcon(result.level)}</span>
                  <span className={`font-semibold ${getLevelColor(result.level)}`}>
                    {result.level}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: result.color1 }}
                      title={`Color de texto: ${result.color1}`}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Texto: {result.color1}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: result.color2 }}
                      title={`Color de fondo: ${result.color2}`}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Fondo: {result.color2}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Ratio: </span>
                    <span className={getLevelColor(result.level)}>
                      {result.ratio}:1
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="font-medium">Tamaño: </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {result.textSize === 'large' ? 'Grande (≥18px)' : 'Normal (<18px)'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Niveles de Contraste:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <strong>AAA:</strong> Ratio 7:1 o superior (excelente)</li>
              <li>• <strong>AA:</strong> Ratio 4.5:1 o superior (bueno para texto normal)</li>
              <li>• <strong>AA Large:</strong> Ratio 3:1 o superior (bueno para texto grande)</li>
              <li>• <strong>Fail:</strong> Ratio menor a 3:1 (necesita mejora)</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {isChecking ? 'Verificando contraste...' : 'No se encontraron elementos para verificar'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorContrastChecker;

