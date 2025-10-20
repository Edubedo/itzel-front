import React, { useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import AccessibilityModal from '../components/accessibility/AccessibilityModal';
import SkipLink from '../components/accessibility/SkipLink';
import Header from '../components/header/Header';

const ClientSelectionDemo: React.FC = () => {
  const { settings, announce } = useAccessibility();
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);

  const handleClientTypeSelection = (isClient: boolean) => {
    const tipoCliente = isClient ? 'Cliente CFE' : 'No cliente';
    announce(`Tipo de cliente seleccionado: ${tipoCliente}. Procediendo a la selección de servicios.`, 'polite');
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F4F4F4 0%, #DFDFDF 50%, #CAC9C9 100%)'
      }}>

      {/* Skip Links para navegación por teclado */}
      <SkipLink href="#main-content">Saltar al contenido principal</SkipLink>
      <SkipLink href="#client-selection">Saltar a la selección de cliente</SkipLink>

      <Header 
        showBranchSelector={false} 
        title="Demostración de Accesibilidad - Selección de Cliente" 
        onAccessibilityClick={() => setIsAccessibilityModalOpen(true)}
      />

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex items-center justify-center px-4 py-2 overflow-auto relative z-0">
        <div className="w-full max-w-6xl my-auto">

          {/* Welcome Message */}
          <div className="relative max-w-3xl mx-auto mb-4 z-0">
            <div className="backdrop-blur-xl bg-white/30 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#70A18E]/20 via-[#8ECAB2]/20 to-[#B7F2DA]/20 animate-pulse"></div>

              <div className="relative py-3 px-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#8ECAB2] blur-xl opacity-40"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-[#70A18E] to-[#8ECAB2] rounded-xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-6 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>

                  <div className="text-center">
                    <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3A554B] to-[#70A18E] tracking-tight text-scalable">
                      DEMOSTRACIÓN DE ACCESIBILIDAD
                    </h1>
                    <p className="text-xs md:text-sm text-gray-700 font-medium text-scalable">
                      Vista de Selección de Cliente • ITZEL
                    </p>
                  </div>

                  <div className="hidden md:flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#70A18E] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#8ECAB2] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#B7F2DA] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Selection Cards */}
          <div id="client-selection" role="region" aria-label="Selección de tipo de cliente" className="relative">
            <div className="backdrop-blur-xl bg-white/40 rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#B7F2DA]/20 via-[#8ECAB2]/10 to-[#70A18E]/20 animate-pulse"></div>

              <div className="relative p-4 md:p-6 lg:p-8">
                <div className="text-center mb-6">
                  <div className="inline-block mb-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] blur-xl opacity-50 animate-pulse"></div>
                      <h2 className="relative text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3A554B] via-[#5D7166] to-[#70A18E] tracking-tight text-scalable">
                        TIPO DE CLIENTE
                      </h2>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base font-medium max-w-2xl mx-auto text-scalable">
                    Seleccione su perfil para acceder a nuestros servicios personalizados
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 max-w-5xl mx-auto">
                  {/* Card No Cliente */}
                  <button
                    onClick={() => handleClientTypeSelection(false)}
                    className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#8ECAB2]/50 text-scalable"
                    style={{
                      background: 'linear-gradient(135deg, #B7F2DA 0%, #8ECAB2 100%)',
                      boxShadow: '0 20px 60px -15px rgba(142, 202, 178, 0.5)'
                    }}
                    aria-label="Seleccionar como No Cliente - Acceso a servicios públicos y atención general"
                    role="button"
                    tabIndex={0}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <div className="relative p-6 md:p-8">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-[#70A18E] blur-xl opacity-50 scale-75 group-hover:scale-100 transition-transform duration-500"></div>
                        <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#8ECAB2] to-[#70A18E] rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-[#70A18E] to-[#547A6B] rounded-2xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500"></div>
                          <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                            <svg className="w-16 h-16 md:w-18 md:h-18 text-[#70A18E] group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-black text-[#0A1310] group-hover:text-[#3A554B] transition-colors text-scalable">
                          NO SOY CLIENTE
                        </h3>
                        <p className="text-xs md:text-sm text-[#3A554B]/80 font-medium text-scalable">
                          Acceso a servicios públicos y atención general
                        </p>

                        <div className="pt-2 flex items-center justify-center gap-2 text-[#3A554B] group-hover:gap-4 transition-all">
                          <span className="text-xs md:text-sm font-bold text-scalable">SELECCIONAR</span>
                          <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-bl-full -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#70A18E]/20 rounded-tr-full -ml-10 -mb-10"></div>
                  </button>

                  {/* Card Cliente CFE */}
                  <button
                    onClick={() => handleClientTypeSelection(true)}
                    className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#70A18E]/50 text-scalable"
                    style={{
                      background: 'linear-gradient(135deg, #70A18E 0%, #547A6B 100%)',
                      boxShadow: '0 20px 60px -15px rgba(112, 161, 142, 0.6)'
                    }}
                    aria-label="Seleccionar como Cliente CFE - Atención preferencial y servicios exclusivos"
                    role="button"
                    tabIndex={0}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <div className="absolute top-4 right-4 px-2 py-0.5 bg-[#B7F2DA] rounded-full text-[10px] md:text-xs font-bold text-[#3A554B] shadow-lg animate-pulse">
                      <div className="flex items-center gap-2 px-2 py-0.5 bg-[#B7F2DA] rounded-full text-xs font-bold text-[#3A554B] shadow-lg">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <polygon points="12,2 22,9 12,22 2,9" stroke="#3A554B" strokeWidth="2" fill="#B7F2DA" />
                        </svg>
                        GRANDES USUARIOS
                      </div>
                    </div>

                    <div className="relative p-6 md:p-8">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-[#B7F2DA] blur-xl opacity-50 scale-75 group-hover:scale-100 transition-transform duration-500"></div>
                        <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#B7F2DA] to-[#8ECAB2] rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-[#8ECAB2] to-[#CFF4DE] rounded-2xl -rotate-6 group-hover:-rotate-12 transition-transform duration-500"></div>
                          <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow duration-500">
                            <svg className="w-16 h-16 md:w-18 md:h-18 text-[#70A18E] group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-[#CFF4DE] transition-colors text-scalable">
                          SOY CLIENTE CFE
                        </h3>
                        <p className="text-xs md:text-sm text-[#B7F2DA] font-medium text-scalable">
                          Atención preferencial y servicios exclusivos
                        </p>

                        <div className="pt-2 flex items-center justify-center gap-2 text-white group-hover:gap-4 transition-all">
                          <span className="text-xs md:text-sm font-bold text-scalable">SELECCIONAR</span>
                          <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-[#B7F2DA]/20 rounded-tr-full -ml-10 -mb-10"></div>
                  </button>
                </div>

                {/* Instrucciones de Accesibilidad */}
                <div className="mt-8 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                  <h3 className="text-lg font-bold text-[#3A554B] mb-4 text-scalable">Funcionalidades de Accesibilidad Implementadas:</h3>
                  <ul className="space-y-2 text-sm text-gray-700 text-scalable">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <strong>Navegación por teclado:</strong> Usa Tab para navegar entre elementos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <strong>Skip Links:</strong> Presiona Tab al inicio para saltar a secciones principales
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <strong>Escalado de texto:</strong> Ajusta el tamaño en el panel de accesibilidad
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <strong>Anuncios de lector de pantalla:</strong> Retroalimentación audible para acciones
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <strong>Indicadores de foco:</strong> Resaltado visual mejorado para navegación
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <strong>Etiquetas ARIA:</strong> Contexto completo para lectores de pantalla
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#8ECAB2] rounded-full opacity-60 animate-ping"></div>
              <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#B7F2DA] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[#70A18E] rounded-full opacity-50 animate-ping" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Accesibilidad */}
      <AccessibilityModal 
        isOpen={isAccessibilityModalOpen} 
        onClose={() => setIsAccessibilityModalOpen(false)} 
      />
    </div>
  );
};

export default ClientSelectionDemo;
