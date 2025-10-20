import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import AccessibilityPanel from '../components/accessibility/AccessibilityPanel';
import TextScalingDemo from '../components/accessibility/TextScalingDemo';
import VoiceCommandsInterface from '../components/accessibility/VoiceCommandsInterface';
import ColorContrastChecker from '../components/accessibility/ColorContrastChecker';
import AccessibilityValidator from '../components/accessibility/AccessibilityValidator';
import FocusIndicator from '../components/accessibility/FocusIndicator';
import { useState } from 'react';

const AccessibilityDemo: React.FC = () => {
  const { settings } = useAccessibility();
  const [showPanel, setShowPanel] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Demostración de Accesibilidad
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Esta página demuestra las funcionalidades de accesibilidad implementadas en el sistema.
            </p>
          </div>

          {/* Panel de configuración */}
          <div className="mb-8">
            <button
              onClick={() => setShowPanel(true)}
              className="px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Abrir Panel de Accesibilidad
            </button>
          </div>

          {/* Grid de demostraciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Escalado de texto */}
            <div className="lg:col-span-2">
              <TextScalingDemo />
            </div>

            {/* Comandos de voz */}
            {settings.voiceCommands && (
              <div className="lg:col-span-2">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Comandos de Voz
                  </h2>
                  <VoiceCommandsInterface />
                </div>
              </div>
            )}

            {/* Verificador de contraste */}
            <div>
              <ColorContrastChecker />
            </div>

            {/* Validador de accesibilidad */}
            <div>
              <AccessibilityValidator />
            </div>

            {/* Demostración de foco */}
            <div className="lg:col-span-2">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Demostración de Indicadores de Foco
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Usa la tecla Tab para navegar entre los elementos y observa los indicadores de foco mejorados.
                </p>
                
                <FocusIndicator className="space-y-4">
                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                      Botón Primario
                    </button>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                      Botón Secundario
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      Botón de Peligro
                    </button>
                  </div>
                  
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Campo de texto"
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    />
                    <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                      <option>Opción 1</option>
                      <option>Opción 2</option>
                      <option>Opción 3</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="text-brand-500 hover:text-brand-600 underline focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 rounded"
                    >
                      Enlace de ejemplo
                    </a>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                      />
                      <span>Checkbox de ejemplo</span>
                    </label>
                  </div>
                </FocusIndicator>
              </div>
            </div>

            {/* Demostración de formularios accesibles */}
            <div className="lg:col-span-2">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Formulario Accesible
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Este formulario demuestra las mejores prácticas de accesibilidad.
                </p>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      required
                      aria-describedby="nombre-help"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    />
                    <p id="nombre-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Ingresa tu nombre completo como aparece en tu identificación
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      aria-describedby="email-help"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    />
                    <p id="email-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Usaremos este correo para contactarte
                    </p>
                  </div>
                  
                  <div>
                    <fieldset>
                      <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferencias de comunicación
                      </legend>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="comunicacion"
                            value="email"
                            className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                          />
                          <span>Correo electrónico</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="comunicacion"
                            value="telefono"
                            className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                          />
                          <span>Teléfono</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="comunicacion"
                            value="ambos"
                            className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-500"
                          />
                          <span>Ambos</span>
                        </label>
                      </div>
                    </fieldset>
                  </div>
                  
                  <div>
                    <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Comentarios adicionales
                    </label>
                    <textarea
                      id="comentarios"
                      name="comentarios"
                      rows={4}
                      aria-describedby="comentarios-help"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    ></textarea>
                    <p id="comentarios-help" className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Comparte cualquier información adicional que consideres relevante
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    >
                      Enviar formulario
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de accesibilidad */}
      <AccessibilityPanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
      />
    </div>
  );
};

export default AccessibilityDemo;

