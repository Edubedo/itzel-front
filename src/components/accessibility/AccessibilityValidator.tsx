import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

interface AccessibilityValidatorProps {
  className?: string;
}

interface ValidationResult {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: HTMLElement;
  fix?: string;
}

const AccessibilityValidator: React.FC<AccessibilityValidatorProps> = ({ className = "" }) => {
  const { settings } = useAccessibility();
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [summary, setSummary] = useState({ errors: 0, warnings: 0, info: 0 });

  // Función para validar elementos
  const validateElements = (): ValidationResult[] => {
    const validationResults: ValidationResult[] = [];

    // Validar imágenes sin alt text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        validationResults.push({
          id: `img-${index}`,
          type: 'error',
          message: 'Imagen sin texto alternativo',
          element: img as HTMLElement,
          fix: 'Agregar atributo alt o aria-hidden="true"'
        });
      }
    });

    // Validar enlaces sin texto
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      const text = link.textContent?.trim();
      const ariaLabel = link.getAttribute('aria-label');
      if (!text && !ariaLabel) {
        validationResults.push({
          id: `link-${index}`,
          type: 'error',
          message: 'Enlace sin texto visible o etiqueta ARIA',
          element: link as HTMLElement,
          fix: 'Agregar texto visible o aria-label'
        });
      }
    });

    // Validar botones sin etiquetas
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      const text = button.textContent?.trim();
      const ariaLabel = button.getAttribute('aria-label');
      const ariaLabelledBy = button.getAttribute('aria-labelledby');
      if (!text && !ariaLabel && !ariaLabelledBy) {
        validationResults.push({
          id: `button-${index}`,
          type: 'error',
          message: 'Botón sin etiqueta accesible',
          element: button as HTMLElement,
          fix: 'Agregar texto visible, aria-label o aria-labelledby'
        });
      }
    });

    // Validar formularios sin etiquetas
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      const placeholder = input.getAttribute('placeholder');
      
      if (!id && !ariaLabel && !ariaLabelledBy && !placeholder) {
        validationResults.push({
          id: `input-${index}`,
          type: 'error',
          message: 'Campo de formulario sin etiqueta',
          element: input as HTMLElement,
          fix: 'Agregar id, aria-label, aria-labelledby o placeholder'
        });
      }
    });

    // Validar elementos con roles ARIA
    const elementsWithRoles = document.querySelectorAll('[role]');
    elementsWithRoles.forEach((element, index) => {
      const role = element.getAttribute('role');
      const ariaLabel = element.getAttribute('aria-label');
      const ariaLabelledBy = element.getAttribute('aria-labelledby');
      const text = element.textContent?.trim();
      
      if (!ariaLabel && !ariaLabelledBy && !text) {
        validationResults.push({
          id: `role-${index}`,
          type: 'warning',
          message: `Elemento con rol "${role}" sin etiqueta accesible`,
          element: element as HTMLElement,
          fix: 'Agregar aria-label, aria-labelledby o texto visible'
        });
      }
    });

    // Validar contraste de colores (básico)
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    textElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      if (color === backgroundColor) {
        validationResults.push({
          id: `contrast-${index}`,
          type: 'error',
          message: 'Texto y fondo con el mismo color',
          element: element as HTMLElement,
          fix: 'Cambiar color del texto o fondo para mejorar contraste'
        });
      }
    });

    // Validar elementos con tabindex
    const tabElements = document.querySelectorAll('[tabindex]');
    tabElements.forEach((element, index) => {
      const tabindex = element.getAttribute('tabindex');
      if (tabindex === '0' && !element.getAttribute('role')) {
        validationResults.push({
          id: `tabindex-${index}`,
          type: 'info',
          message: 'Elemento con tabindex="0" sin rol ARIA',
          element: element as HTMLElement,
          fix: 'Agregar rol ARIA apropiado'
        });
      }
    });

    // Validar elementos interactivos sin foco visible
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    interactiveElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const outline = computedStyle.outline;
      const outlineWidth = computedStyle.outlineWidth;
      
      if (outline === 'none' && outlineWidth === '0px') {
        validationResults.push({
          id: `focus-${index}`,
          type: 'warning',
          message: 'Elemento interactivo sin indicador de foco visible',
          element: element as HTMLElement,
          fix: 'Agregar estilos de foco visibles'
        });
      }
    });

    return validationResults;
  };

  // Función para ejecutar validación
  const runValidation = () => {
    setIsValidating(true);
    
    setTimeout(() => {
      const validationResults = validateElements();
      setResults(validationResults);
      
      // Calcular resumen
      const summary = {
        errors: validationResults.filter(r => r.type === 'error').length,
        warnings: validationResults.filter(r => r.type === 'warning').length,
        info: validationResults.filter(r => r.type === 'info').length
      };
      setSummary(summary);
      
      setIsValidating(false);
    }, 1000);
  };

  // Ejecutar validación al cargar
  useEffect(() => {
    runValidation();
  }, []);

  const getTypeColor = (type: ValidationResult['type']) => {
    switch (type) {
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: ValidationResult['type']) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '❓';
    }
  };

  const scrollToElement = (element: HTMLElement) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.focus();
  };

  return (
    <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Validador de Accesibilidad
        </h2>
        <button
          onClick={runValidation}
          disabled={isValidating}
          className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          {isValidating ? 'Validando...' : 'Validar Accesibilidad'}
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.errors}</div>
          <div className="text-sm text-red-800 dark:text-red-200">Errores</div>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{summary.warnings}</div>
          <div className="text-sm text-yellow-800 dark:text-yellow-200">Advertencias</div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.info}</div>
          <div className="text-sm text-blue-800 dark:text-blue-200">Información</div>
        </div>
      </div>

      {/* Resultados */}
      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{getTypeIcon(result.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${getTypeColor(result.type)}`}>
                      {result.type.toUpperCase()}
                    </span>
                    {result.element && (
                      <button
                        onClick={() => scrollToElement(result.element!)}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
                      >
                        Ver elemento
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {result.message}
                  </p>
                  {result.fix && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Solución:</strong> {result.fix}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-gray-500 dark:text-gray-400">
            {isValidating ? 'Validando accesibilidad...' : '¡Excelente! No se encontraron problemas de accesibilidad'}
          </p>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Tipos de problemas:
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• <strong>Errores:</strong> Problemas críticos que impiden el acceso</li>
          <li>• <strong>Advertencias:</strong> Problemas que pueden dificultar el acceso</li>
          <li>• <strong>Información:</strong> Sugerencias para mejorar la accesibilidad</li>
        </ul>
      </div>
    </div>
  );
};

export default AccessibilityValidator;

