import React from 'react';
import PageMeta from '../../../components/common/PageMeta';

const ImClient: React.FC = () => {
  const handleOptionClick = (option: string) => {
    console.log('Opción seleccionada:', option);
  };

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
    </>
  );
};

export default ImClient;