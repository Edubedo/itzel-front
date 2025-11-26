import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PageMeta from '../../../components/common/PageMeta';

const ImClient: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleOptionClick = (option: string) => {
    if (option === 'aviso_privacidad') {
      setShowPrivacyModal(true);
    } else {
      console.log('Opción seleccionada:', option);
    }
  };

  // Cerrar modal con la tecla ESC y bloquear scroll
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setShowPrivacyModal(false);
      }
    };

    if (showPrivacyModal) {
      // Bloquear scroll del body
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Agregar listener para ESC
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        // Restaurar scroll
        document.body.style.overflow = originalOverflow;
        document.body.style.position = '';
        document.body.style.width = '';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showPrivacyModal]);

  return (
    <>
      <PageMeta
        title="Cliente - ITZEL"
        description="Sistema de gestión de turnos ITZEL - Página de cliente"
      />

      <div className="h-screen flex flex-col overflow-hidden" 
           style={{ 
             background: 'linear-gradient(135deg, #F4F4F4 0%, #DFDFDF 50%, #CAC9C9 100%)'
           }}>
        
        {/* Header Navigation */}
        <div className="bg-[#3A554B] px-6 py-3 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/images/Logo2/Logo%20Itzel%20CFE%20Redondo.png" 
                alt="ITZEL Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white font-semibold">ITZEL</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="/signin" className="text-white hover:text-[#B7F2DA] transition-colors text-lg font-semibold py-2 px-4 bg-[#5D7166] rounded-lg hover:bg-[#4A5B52]">
              Acceso
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div className="w-full max-w-4xl">
            
            {/* Welcome Message */}
            <div className="bg-[#CFF4DE] rounded-lg p-4 mb-4 text-center border-2 border-[#5D7166] max-w-2xl mx-auto">
              <h1 className="text-[#0A1310] font-bold text-xl md:text-2xl">
                EL SISTEMA ITZEL LES DA LA BIENVENIDA
              </h1>
            </div>
            
            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-[#5D7166]">
              
              {/* Client Options Section */}
              <div className="p-6 lg:p-8">
                {/* Encabezado con título centrado */}
                <div className="flex flex-col mb-6">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-[#0A1310]">
                      Seleccione la opción que desea realizar
                    </h2>
                  </div>
                </div>
                
                {/* Client Options Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-5xl mx-auto">
                  
                  {/* Pago Button */}
                  <button 
                    className="bg-[#B7F2DA] hover:bg-[#8ECAB2] rounded-lg p-4 border-2 border-[#8ECAB2] transition-all duration-200 hover:shadow-lg group"
                    onClick={() => handleOptionClick('pago')}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-[#70A18E] p-2 overflow-hidden">
                        
                        <img 
                          src="public/images/icons/Pago.png" 
                          alt="Icono de pago" 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-[#0A1310] font-bold text-center text-sm md:text-base">
                        PAGO
                      </span>
                    </div>
                  </button>
                  
                  {/* Facturar Button */}
                  <button 
                    className="bg-[#B7F2DA] hover:bg-[#8ECAB2] rounded-lg p-4 border-2 border-[#8ECAB2] transition-all duration-200 hover:shadow-lg group"
                    onClick={() => handleOptionClick('facturar')}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-[#70A18E] p-2 overflow-hidden">
                       
                        <img 
                          src="public/images/icons/Facturacion.png" 
                          alt="Icono de facturación" 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-[#0A1310] font-bold text-center text-sm md:text-base">
                        FACTURAR
                      </span>
                    </div>
                  </button>
                  
                  {/* Reporte Button */}
                  <button 
                    className="bg-[#B7F2DA] hover:bg-[#8ECAB2] rounded-lg p-4 border-2 border-[#8ECAB2] transition-all duration-200 hover:shadow-lg group"
                    onClick={() => handleOptionClick('reporte')}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-[#70A18E] p-2 overflow-hidden">
            
                        <img 
                          src="public/images/icons/Reporte.png" 
                          alt="Icono de reporte" 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-[#0A1310] font-bold text-center text-sm md:text-base">
                        REPORTE
                      </span>
                    </div>
                  </button>
                  
                  {/* Aviso de Privacidad Button */}
                  <button 
                    className="bg-[#B7F2DA] hover:bg-[#8ECAB2] rounded-lg p-4 border-2 border-[#8ECAB2] transition-all duration-200 hover:shadow-lg group"
                    onClick={() => handleOptionClick('aviso_privacidad')}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-[#70A18E] p-2 overflow-hidden">
                        <img 
                          src="public/images/icons/AvisoDePrivacidad.png" 
                          alt="Icono de privacidad" 
                          className="w-10 h-10 object-contain"
                        />
                      </div>
                      <span className="text-[#0A1310] font-bold text-center text-sm md:text-base">
                        AVISO DE<br />PRIVACIDAD
                      </span>
                    </div>
                  </button>
                  
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-8">
                  <a 
                    href="/" 
                    className="bg-[#5D7166] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#4A5B52] transition-colors flex items-center"
                  >
                    <span className="mr-2">←</span> Regresar
                  </a>
                  <button 
                    className="bg-[#70A18E] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#547A6B] transition-colors flex items-center"
                    onClick={() => alert('Continuando con la acción seleccionada')}
                  >
                    Continuar <span className="ml-2">→</span>
                  </button>
                </div>
                
              </div>
              
            </div>
            
            {/* Footer */}
            <div className="text-center mt-4 text-[#5D7166] text-sm">
              © ITZEL
            </div>
            
          </div>
        </div>
      </div>

      {/* Modal de Aviso de Privacidad - Renderizado con Portal */}
      {showPrivacyModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
          onClick={() => setShowPrivacyModal(false)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 99999
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-auto border border-gray-200 max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh' }}
          >
            {/* Header con botón de cerrar */}
            <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-6 rounded-t-2xl text-center relative flex-shrink-0">
              {/* Botón de cerrar (X) - Más grande y visible */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPrivacyModal(false);
                }}
                className="absolute right-4 top-4 text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/30 bg-white/20 z-50 cursor-pointer"
                aria-label="Cerrar"
                type="button"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.163l-8 3.92V11.2c0 5.4 3.4 10.3 8 11.6 4.6-1.3 8-6.2 8-11.6V6.083l-8-3.92z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Aviso de Privacidad</h3>
              <p className="text-white/90 text-sm">
                Su información es importante para nosotros.
              </p>
            </div>

            {/* Contenido con scroll - Área scrolleable */}
            <div 
              className="flex-1 overflow-y-auto overflow-x-hidden"
              style={{ 
                maxHeight: 'calc(90vh - 220px)',
                scrollbarWidth: 'thin'
              }}
            >
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Responsable de los datos</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Comisión Federal de Electricidad (CFE), es responsable del tratamiento de sus datos personales.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Finalidad</h4>
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      Los datos personales que recabamos de usted, los utilizaremos para las siguientes finalidades que son necesarias para el servicio que solicita:
                    </p>
                    <ul className="list-disc list-inside ml-4 text-sm text-gray-600 space-y-2">
                      <li>Gestionar y registrar su turno de atención.</li>
                      <li>Validar su identidad como cliente (si aplica).</li>
                      <li>Brindarle el servicio o trámite solicitado.</li>
                      <li>Generar estadísticas internas para la mejora del servicio.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Derechos ARCO</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que eliminemos del registro o base de datos sus datos personales cuando considere que no están siendo utilizados adecuadamente (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición).
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Transferencias</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Le informamos que sus datos personales pueden ser compartidos con autoridades competentes cuando así lo requiera una disposición legal.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Revocación del consentimiento</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Usted puede revocar su consentimiento para el tratamiento de sus datos personales. Sin embargo, es importante que tenga en cuenta que no siempre podremos atender su solicitud o concluir el uso de forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir tratando sus datos personales.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-300">
                    <p className="text-sm text-gray-700 font-medium">
                      Al continuar, usted acepta el tratamiento de sus datos personales conforme a nuestro aviso de privacidad integral.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con botón - Siempre visible */}
            <div className="p-6 border-t border-gray-200 flex-shrink-0 bg-white rounded-b-2xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPrivacyModal(false);
                }}
                className="relative w-full bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] hover:from-[#547A6B] hover:to-[#70A18E] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 group overflow-hidden shadow-lg cursor-pointer"
                type="button"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B7F2DA]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10 text-lg">Entendido y Aceptar</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default ImClient;