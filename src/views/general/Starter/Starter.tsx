import React from 'react';
import PageMeta from '../../../components/common/PageMeta';

export default function Starter() {
  return (
    
     <>
      <PageMeta
        title="Starter Users - ITZEL"
        description="Sistema de gestión de turnos ITZEL - Página inicial de selección de tipo de cliente"
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
            
            {/* Client Type Section */}
            <div className="p-6 lg:p-8">
              {/* Encabezado con título centrado y selector a la izquierda */}
              <div className="flex flex-col mb-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-[#0A1310]">
                    TIPO DE CLIENTE
                  </h2>
                </div>
              </div>
              
              {/* Client Type Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                
                {/* No Cliente Button */}
                <button className="bg-[#B7F2DA] hover:bg-[#8ECAB2] rounded-lg p-4 sm:p-6 border-2 border-[#8ECAB2] transition-all duration-200 hover:shadow-lg group">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#8ECAB2] rounded-full flex items-center justify-center border-3 border-[#70A18E] p-2">
                      <div className="w-full h-full bg-[#70A18E] rounded-full flex items-center justify-center p-3">
                        <img 
                          src="/images/icons/NoCliente.png" 
                          alt="No cliente" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <span className="text-[#0A1310] font-bold text-center text-xs sm:text-sm md:text-base mt-2">
                      NO SOY CLIENTE
                    </span>
                  </div>
                </button>
                
                {/* Cliente Button */}
                <button className="bg-[#70A18E] hover:bg-[#547A6B] rounded-lg p-4 sm:p-6 border-2 border-[#547A6B] transition-all duration-200 hover:shadow-lg group">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#8ECAB2] rounded-full flex items-center justify-center border-3 border-[#B7F2DA] p-2">
                      <div className="w-full h-full bg-[#B7F2DA] rounded-full flex items-center justify-center p-3">
                        <img 
                          src="/images/icons/Cliente.png" 
                          alt="Cliente" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                    <span className="text-white font-bold text-center text-xs sm:text-sm md:text-base mt-2">
                      SOY CLIENTE
                    </span>
                  </div>
                </button>
                
              </div>
              
              {/* Branch Selection */}
              <div className="mb-4 max-w-2xl mx-auto">
                <label className="block text-[#0A1310] font-semibold mb-2">
                  Seleccione sucursal:
                </label>
                <select className="w-full py-3 px-4 border-2 border-[#8ECAB2] rounded-lg text-[#0A1310] bg-white focus:outline-none focus:ring-2 focus:ring-[#70A18E] focus:border-[#70A18E] text-base">
                  <option value="">-- Seleccione una sucursal --</option>
                  <option value="sucursal1">Manzanillo</option>
                  <option value="sucursal2">Tecoman</option>
                  <option value="sucursal3">Colima</option>
                  <option value="sucursal4">Villa de Alvarez</option>
                  <option value="sucursal5">Comala</option>
                </select>
              </div>
              
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
}