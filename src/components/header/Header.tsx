import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

interface Sucursal {
  ck_sucursal: string;
  s_nombre_sucursal: string;
  s_domicilio: string;
  s_municipio?: string;
  s_estado?: string;
}

interface HeaderProps {
  showBranchSelector?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ showBranchSelector = true, title }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalActiva, setSucursalActiva] = useState<Sucursal | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar sucursales al montar el componente
  useEffect(() => {
    if (showBranchSelector) {
      cargarSucursales();
    }
  }, [showBranchSelector]);

  // Cargar sucursal guardada en localStorage
  useEffect(() => {
    const sucursalGuardada = localStorage.getItem('sucursal_seleccionada');
    if (sucursalGuardada) {
      try {
        const sucursal = JSON.parse(sucursalGuardada);
        setSucursalActiva(sucursal);
      } catch (error) {
        console.error('Error al cargar sucursal guardada:', error);
      }
    }
  }, []);

  const cargarSucursales = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/operaciones/turnos/sucursales');
      const data = await response.json();
      
      if (data.success) {
        setSucursales(data.sucursales);
        
        // Si no hay sucursal activa, seleccionar la primera
        if (!sucursalActiva && data.sucursales.length > 0) {
          const primeraSucursal = data.sucursales[0];
          setSucursalActiva(primeraSucursal);
          localStorage.setItem('sucursal_seleccionada', JSON.stringify(primeraSucursal));
        }
      }
    } catch (error) {
      console.error('Error al cargar sucursales:', error);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarSucursal = (sucursal: Sucursal) => {
    setSucursalActiva(sucursal);
    localStorage.setItem('sucursal_seleccionada', JSON.stringify(sucursal));
    setIsDropdownOpen(false);
    
    // Emitir evento personalizado para notificar el cambio
    window.dispatchEvent(new CustomEvent('sucursalCambiada', { detail: sucursal }));
  };

  return (
    <div className="bg-[#3A554B] px-6 py-3 flex justify-between items-center flex-shrink-0 shadow-md">
      {/* Logo y título */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/images/Logo2/Logo%20Itzel%20CFE%20Redondo.png" 
              alt="ITZEL Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-semibold text-lg">ITZEL</span>
        </div>
        
        {title && (
          <div className="border-l border-[#5D7166] pl-4">
            <h1 className="text-white font-medium text-lg">{title}</h1>
          </div>
        )}
      </div>

      {/* Selector de sucursal */}
      {showBranchSelector && (
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-[#5D7166] hover:bg-[#4A5B52] text-white px-4 py-2 rounded-lg transition-colors"
              disabled={loading}
            >
              <MapPin className="w-4 h-4" />
              <span className="font-medium">
                {loading ? 'Cargando...' : 
                 sucursalActiva ? sucursalActiva.s_nombre_sucursal : 'Seleccionar sucursal'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown de sucursales */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto">
                {sucursales.length === 0 ? (
                  <div className="p-4 text-gray-500 text-center">
                    No hay sucursales disponibles
                  </div>
                ) : (
                  sucursales.map((sucursal) => (
                    <button
                      key={sucursal.ck_sucursal}
                      onClick={() => seleccionarSucursal(sucursal)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        sucursalActiva?.ck_sucursal === sucursal.ck_sucursal ? 'bg-[#CFF4DE]' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {sucursal.s_nombre_sucursal}
                      </div>
                      {sucursal.s_domicilio && (
                        <div className="text-sm text-gray-600">
                          {sucursal.s_domicilio}
                        </div>
                      )}
                      {(sucursal.s_municipio || sucursal.s_estado) && (
                        <div className="text-xs text-gray-500">
                          {sucursal.s_municipio && sucursal.s_estado 
                            ? `${sucursal.s_municipio}, ${sucursal.s_estado}`
                            : sucursal.s_municipio || sucursal.s_estado
                          }
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Información adicional */}
          {sucursalActiva && (
            <div className="text-white text-sm">
              <div className="font-medium">Sucursal Activa</div>
              <div className="text-[#B7F2DA]">{sucursalActiva.s_nombre_sucursal}</div>
            </div>
          )}
        </div>
      )}

      {/* Enlaces de navegación */}
      <div className="flex items-center space-x-4">
        <a 
          href="/signin" 
          className="text-white hover:text-[#B7F2DA] transition-colors text-sm font-medium py-2 px-4 bg-[#5D7166] rounded-lg hover:bg-[#4A5B52]"
        >
          Acceso
        </a>
      </div>
    </div>
  );
};

// Hook personalizado para obtener la sucursal activa
export const useSucursalActiva = () => {
  const [sucursalActiva, setSucursalActiva] = useState<Sucursal | null>(null);

  useEffect(() => {
    // Cargar sucursal inicial
    const sucursalGuardada = localStorage.getItem('sucursal_seleccionada');
    if (sucursalGuardada) {
      try {
        setSucursalActiva(JSON.parse(sucursalGuardada));
      } catch (error) {
        console.error('Error al cargar sucursal:', error);
      }
    }

    // Escuchar cambios de sucursal
    const handleSucursalCambiada = (event: CustomEvent) => {
      setSucursalActiva(event.detail);
    };

    window.addEventListener('sucursalCambiada', handleSucursalCambiada as EventListener);

    return () => {
      window.removeEventListener('sucursalCambiada', handleSucursalCambiada as EventListener);
    };
  }, []);

  return sucursalActiva;
};

export default Header;
