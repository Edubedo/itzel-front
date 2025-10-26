import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { ChevronDown, MapPin } from 'lucide-react';
import { useLogo } from "../../contexts/LogoContext";
import LanguageToggleButton from '../common/LanguageToggleButton';

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
  showLanguageToggle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showBranchSelector = true, title, showLanguageToggle = false }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalActiva, setSucursalActiva] = useState<Sucursal | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logoLight, logoDark } = useLogo();
  const navigate = useNavigate();

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

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
      const token = Cookies.get('authToken');
      // Si hay token usamos endpoint filtrado; si no, usamos público
      const url = token
        ? 'http://localhost:3001/api/operaciones/turnos/sucursales-usuario'
        : 'http://localhost:3001/api/operaciones/turnos/sucursales';
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await response.json();

      if (data.success) {
        setSucursales(data.sucursales);

        // Verificar si hay una sucursal guardada en localStorage
        const sucursalGuardada = localStorage.getItem('sucursal_seleccionada');

        if (!sucursalGuardada && data.sucursales.length > 0) {
          // Solo seleccionar la primera si no hay ninguna guardada
          const primeraSucursal = data.sucursales[0];
          setSucursalActiva(primeraSucursal);
          localStorage.setItem('sucursal_seleccionada', JSON.stringify(primeraSucursal));
        } else if (sucursalGuardada) {
          // Verificar que la sucursal guardada exista en las sucursales disponibles
          try {
            const sucursal = JSON.parse(sucursalGuardada);
            const sucursalExiste = data.sucursales.some(s => s.ck_sucursal === sucursal.ck_sucursal);
            if (!sucursalExiste && data.sucursales.length > 0) {
              // Si la sucursal guardada no existe en la lista, seleccionar la primera disponible
              const primeraSucursal = data.sucursales[0];
              setSucursalActiva(primeraSucursal);
              localStorage.setItem('sucursal_seleccionada', JSON.stringify(primeraSucursal));
            }
          } catch (error) {
            console.error('Error al procesar sucursal guardada:', error);
          }
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
    <div className="relative backdrop-blur-md bg-[#3A554B]/95 px-4 md:px-6 py-2.5 flex justify-between items-center flex-shrink-0 border-b border-white/10 z-[100]"
      style={{ boxShadow: '0 4px 20px rgba(58, 85, 75, 0.3)' }}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3A554B] via-[#5D7166] to-[#3A554B] opacity-50 pointer-events-none"></div>

      {/* Logo y título */}
      <div className="relative flex items-center space-x-3 md:space-x-4 z-[110]">
        <div className="flex items-center space-x-2">
          {/* Logo con efecto glassmorphism */}
          <div className="relative group">
            <div className="absolute inset-0 bg-[#8ECAB2] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-[#B7F2DA]/30 group-hover:border-[#B7F2DA]/60 transition-all duration-300 group-hover:scale-110">
              <img
                src={logoLight}
                alt="ITZEL Logo"
                className="w-full h-full object-cover dark:hidden"
              />
              <img
                src={logoDark}
                alt="ITZEL Logo"
                className="w-full h-full object-cover hidden dark:block"
              />
            </div>
          </div>
          <span className="text-white font-black text-lg tracking-wide drop-shadow-lg">ITZEL</span>
        </div>

        {title && (
          <div className="hidden md:flex border-l border-[#B7F2DA]/20 pl-3 md:pl-4">
            <h1 className="text-white/90 font-semibold text-base md:text-lg tracking-wide">{title}</h1>
          </div>
        )}
      </div>

      {/* Selector de sucursal */}
      {showBranchSelector && (
        <div className="relative flex items-center space-x-2 md:space-x-4 z-[110]">
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-3 md:px-4 py-2 rounded-xl transition-all duration-300 border border-white/20 hover:border-[#B7F2DA]/40 shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              <div className="p-1 bg-[#8ECAB2]/20 rounded-lg group-hover:bg-[#8ECAB2]/30 transition-colors">
                <MapPin className="w-4 h-4 text-[#B7F2DA]" />
              </div>
              <span className="font-semibold text-sm md:text-base hidden sm:inline">
                {loading ? 'Cargando...' :
                  sucursalActiva ? sucursalActiva.s_nombre_sucursal : 'Seleccionar'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown de sucursales - Mejorado */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 backdrop-blur-xl bg-white/95 rounded-2xl overflow-hidden border border-white/20 z-[9999] max-h-80 shadow-2xl">
                {/* Header del dropdown */}
                <div className="bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] p-3 border-b border-white/20">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Sucursales Disponibles
                  </h3>
                </div>

                {/* Lista de sucursales */}
                <div className="max-h-64 overflow-y-auto">
                  {sucursales.length === 0 ? (
                    <div className="p-6 text-gray-500 text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No hay sucursales disponibles</p>
                    </div>
                  ) : (
                    sucursales.map((sucursal) => (
                      <button
                        key={sucursal.ck_sucursal}
                        onClick={() => seleccionarSucursal(sucursal)}
                        className={`w-full text-left px-4 py-3 transition-all duration-200 border-b border-gray-100 last:border-b-0 group ${sucursalActiva?.ck_sucursal === sucursal.ck_sucursal
                          ? 'bg-gradient-to-r from-[#B7F2DA]/30 to-[#8ECAB2]/20 border-l-4 border-l-[#70A18E]'
                          : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-white'
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 flex items-center gap-2">
                              {sucursal.s_nombre_sucursal}
                              {sucursalActiva?.ck_sucursal === sucursal.ck_sucursal && (
                                <span className="px-2 py-0.5 bg-[#70A18E] text-white text-[10px] rounded-full font-bold">
                                  ACTIVA
                                </span>
                              )}
                            </div>
                            {sucursal.s_domicilio && (
                              <div className="text-xs text-gray-600 mt-1">
                                📍 {sucursal.s_domicilio}
                              </div>
                            )}
                            {(sucursal.s_municipio || sucursal.s_estado) && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {sucursal.s_municipio && sucursal.s_estado
                                  ? `${sucursal.s_municipio}, ${sucursal.s_estado}`
                                  : sucursal.s_municipio || sucursal.s_estado
                                }
                              </div>
                            )}
                          </div>
                          {sucursalActiva?.ck_sucursal === sucursal.ck_sucursal && (
                            <div className="flex-shrink-0 text-[#70A18E]">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Información adicional - Oculta en móvil */}
          {sucursalActiva && (
            <div className="hidden lg:block text-white text-xs backdrop-blur-sm bg-white/5 px-3 py-2 rounded-lg border border-white/10">
              <div className="font-semibold text-[#B7F2DA] text-[10px] uppercase tracking-wide">Sucursal Activa</div>
              <div className="font-bold truncate max-w-32">{sucursalActiva.s_nombre_sucursal}</div>
            </div>
          )}
        </div>
      )}

      {/* Enlaces de navegación */}
      <div className="relative flex items-center space-x-2 md:space-x-4 z-[110]">
        {/* Botón de cambio de idioma */}
        {showLanguageToggle && (
          <div className="flex items-center">
            <div className="relative group">
              {/* Efecto de resplandor */}
              <div className="absolute inset-0 bg-[#B7F2DA] rounded-lg blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></div>
              {/* Botón con estilo mejorado */}
              <div className="relative bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-[#B7F2DA]/40 hover:border-[#B7F2DA]/60 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <LanguageToggleButton />
              </div>
            </div>
          </div>
        )}
        
        <a
          href="/signin"
          className="group relative overflow-hidden text-white font-bold text-sm py-2 px-3 md:px-5 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#B7F2DA]/50"
          style={{
            background: 'linear-gradient(135deg, #70A18E 0%, #8ECAB2 100%)',
            boxShadow: '0 4px 15px rgba(112, 161, 142, 0.4)'
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Acceso</span>
          </span>
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
