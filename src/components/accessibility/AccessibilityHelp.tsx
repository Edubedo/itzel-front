import React from 'react';
import { X, Keyboard, Mic, Eye, Volume2, Zap, Type, HelpCircle } from 'lucide-react';

interface AccessibilityHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityHelp: React.FC<AccessibilityHelpProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Guía de Accesibilidad</h2>
                <p className="text-white/80 text-sm">Cómo usar las funcionalidades de accesibilidad</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Cerrar guía de accesibilidad"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Navegación por Teclado */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Keyboard className="w-6 h-6 text-[#70A18E]" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Navegación por Teclado
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Navegar entre elementos</span>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Tab</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Activar elemento</span>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Enter</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Cerrar modales</span>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Esc</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Abrir accesibilidad</span>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Alt + A</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar ayuda</span>
                  <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">F1</kbd>
                </div>
              </div>
            </div>

            {/* Comandos de Voz */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mic className="w-6 h-6 text-[#70A18E]" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Comandos de Voz
                </h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Navegación:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• "ir a inicio"</li>
                    <li>• "cerrar"</li>
                    <li>• "ayuda"</li>
                  </ul>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Texto:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• "aumentar texto"</li>
                    <li>• "disminuir texto"</li>
                    <li>• "texto normal"</li>
                  </ul>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Configuración:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• "activar voz"</li>
                    <li>• "reducir movimiento"</li>
                    <li>• "activar anuncios"</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Configuraciones Visuales */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-[#70A18E]" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configuraciones Visuales
                </h3>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Tamaño del Texto:</strong>
                  <p className="mt-1">Ajusta el tamaño desde 80% hasta 200% para mejor legibilidad.</p>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Alto Contraste:</strong>
                  <p className="mt-1">Mejora la visibilidad para usuarios con problemas de visión.</p>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Reducir Animaciones:</strong>
                  <p className="mt-1">Elimina movimientos para usuarios sensibles al movimiento.</p>
                </div>
              </div>
            </div>

            {/* Configuraciones de Audio */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Volume2 className="w-6 h-6 text-[#70A18E]" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configuraciones de Audio
                </h3>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Anuncios de Lector de Pantalla:</strong>
                  <p className="mt-1">Proporciona retroalimentación audible para cambios importantes.</p>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Niveles de Verbosidad:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>• <strong>Bajo:</strong> Solo información esencial</li>
                    <li>• <strong>Medio:</strong> Información balanceada</li>
                    <li>• <strong>Alto:</strong> Información detallada</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Skip Links */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                  Skip Links (Enlaces de Salto)
                </h3>
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="mb-3">
                  Los Skip Links aparecen cuando presionas <kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs font-mono">Tab</kbd> al cargar la página:
                </p>
                <ul className="space-y-2">
                  <li>• <strong>Saltar al contenido principal:</strong> Va directamente al área principal de la página</li>
                  <li>• <strong>Saltar a la navegación:</strong> Va al menú de navegación</li>
                  <li>• <strong>Saltar a la selección de cliente:</strong> Va directamente a los botones de selección</li>
                </ul>
              </div>
            </div>

            {/* Consejos Adicionales */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Type className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">
                  Consejos Adicionales
                </h3>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
                <p>• <strong>Para usuarios con lectores de pantalla:</strong> Los elementos tienen etiquetas descriptivas y estructura semántica correcta.</p>
                <p>• <strong>Para usuarios con problemas de visión:</strong> Puedes aumentar el texto y activar el alto contraste.</p>
                <p>• <strong>Para usuarios con problemas de movimiento:</strong> Puedes desactivar las animaciones y usar comandos de voz.</p>
                <p>• <strong>Para usuarios con problemas cognitivos:</strong> Los anuncios proporcionan contexto claro de las acciones.</p>
                <p>• <strong>Para todos los usuarios:</strong> La navegación por teclado funciona de manera lógica y predecible.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#70A18E] text-white rounded-lg hover:bg-[#547A6B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#70A18E] focus:ring-offset-2"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityHelp;

