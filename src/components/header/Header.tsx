import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { ChevronDown, MapPin } from 'lucide-react';
import { useLogo } from "../../contexts/LogoContext";

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
  onAccessibilityClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBranchSelector = true, title, onAccessibilityClick }) => {
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

      {/* Botón de Accesibilidad */}
      <div className="relative flex items-center space-x-2 md:space-x-4 z-[110]">
        <button
          onClick={onAccessibilityClick}
          className="group relative overflow-hidden text-white font-bold text-sm py-2 px-3 md:px-5 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#B7F2DA]/50"
          style={{
            background: 'linear-gradient(135deg, #70A18E 0%, #8ECAB2 100%)',
            boxShadow: '0 4px 15px rgba(112, 161, 142, 0.4)'
          }}
          aria-label="Abrir configuración de accesibilidad"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Accesibilidad</span>
          </span>
        </button>
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
