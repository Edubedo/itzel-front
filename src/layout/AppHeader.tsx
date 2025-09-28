import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import { ChevronDown, MapPin, CheckCircle } from "lucide-react";
import Search from "./search";

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

const AppHeader: React.FC<HeaderProps> = ({ title }) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalActiva, setSucursalActiva] = useState<Sucursal | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { showBranchSelector = true } = { showBranchSelector: true };
  const [searchTerm, setSearchTerm] = useState("");


  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const seleccionarSucursal = (sucursal: Sucursal) => {
    setSucursalActiva(sucursal);
    localStorage.setItem('sucursal_seleccionada', JSON.stringify(sucursal));
    setIsDropdownOpen(false);
    window.dispatchEvent(new CustomEvent('sucursalCambiada', { detail: sucursal }));
  };

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

        const sucursalGuardada = localStorage.getItem('sucursal_seleccionada');
        if (sucursalGuardada) {
          try {
            const sucursalParsed = JSON.parse(sucursalGuardada);
            const sucursalValida = data.sucursales.find(
              (s: Sucursal) => s.ck_sucursal === sucursalParsed.ck_sucursal
            );

            if (sucursalValida) {
              setSucursalActiva(sucursalValida);
            } else if (data.sucursales.length > 0) {
              const primeraSucursal = data.sucursales[0];
              setSucursalActiva(primeraSucursal);
              localStorage.setItem('sucursal_seleccionada', JSON.stringify(primeraSucursal));
            }
          } catch (error) {
            console.error('Error al parsear sucursal guardada:', error);
            if (data.sucursales.length > 0) {
              const primeraSucursal = data.sucursales[0];
              setSucursalActiva(primeraSucursal);
              localStorage.setItem('sucursal_seleccionada', JSON.stringify(primeraSucursal));
            }
          }
        } else if (data.sucursales.length > 0) {
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

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z" fill="currentColor" />
              </svg>
            )}
          </button>

          {/* Selector de sucursal mejorado */}
          <div className="flex items-center gap-4" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md min-w-[200px]"
                disabled={loading}
              >
                <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="flex-1 text-left font-medium truncate">
                  {loading ? 'Cargando sucursales...' :
                    sucursalActiva ? sucursalActiva.s_nombre_sucursal : 'Seleccionar sucursal'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown de sucursales */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Seleccionar sucursal</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {sucursales.length} sucursales disponibles
                    </p>
                  </div>

                  {sucursales.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p>No hay sucursales disponibles</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {sucursales.map((sucursal) => (
                        <button
                          key={sucursal.ck_sucursal}
                          onClick={() => seleccionarSucursal(sucursal)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 mb-1 last:mb-0 ${sucursalActiva?.ck_sucursal === sucursal.ck_sucursal
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 dark:text-white truncate">
                                  {sucursal.s_nombre_sucursal}
                                </span>
                                {sucursalActiva?.ck_sucursal === sucursal.ck_sucursal && (
                                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                )}
                              </div>

                              {sucursal.s_domicilio && (
                                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                  {sucursal.s_domicilio}
                                </div>
                              )}

                              {(sucursal.s_municipio || sucursal.s_estado) && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {sucursal.s_municipio && sucursal.s_estado
                                    ? `${sucursal.s_municipio}, ${sucursal.s_estado}`
                                    : sucursal.s_municipio || sucursal.s_estado
                                  }
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <Link to="/home" className="lg:hidden">
            <img
              className="dark:hidden h-8 w-auto max-h-10"
              src="public/images/Logo2/logoSinFondo.png"
              alt="Logo"
            />
            <img
              className="hidden dark:block h-8 w-auto max-h-10"
              src="public/images/Logo2/ItzelFOndoMejoradoDarkMode.png"
              alt="Logo"

            />
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M5.99902 10.4951C6.82745 10.4951 7.49902 11.1667 7.49902 11.9951V12.0051C7.49902 12.8335 6.82745 13.5051 5.99902 13.5051C5.1706 13.5051 4.49902 12.8335 4.49902 12.0051V11.9951C4.49902 11.1667 5.1706 10.4951 5.99902 10.4951ZM17.999 10.4951C18.8275 10.4951 19.499 11.1667 19.499 11.9951V12.0051C19.499 12.8335 18.8275 13.5051 17.999 13.5051C17.1706 13.5051 16.499 12.8335 16.499 12.0051V11.9951C16.499 11.1667 17.1706 10.4951 17.999 10.4951ZM13.499 11.9951C13.499 11.1667 12.8275 10.4951 11.999 10.4951C11.1706 10.4951 10.499 11.1667 10.499 11.9951V12.0051C10.499 12.8335 11.1706 13.5051 11.999 13.5051C12.8275 13.5051 13.499 12.8335 13.499 12.0051V11.9951Z" fill="currentColor" />
            </svg>
          </button>

          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none transition-all border-[#8ECAB2] bg-white text-gray-700 placeholder-gray-500 font-medium focus:border-[#70A18E] shadow-sm text-base dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-400 dark:border-gray-700 dark:focus:border-[#70A18E]"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {/* ScanSearch icon, cambia color según modo */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#8ECAB2] dark:text-[#70A18E]"
                    />
                    <rect x="14" y="3" width="7" height="7" rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#8ECAB2] dark:text-[#70A18E]"
                    />
                    <rect x="14" y="14" width="7" height="7" rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#8ECAB2] dark:text-[#70A18E]"
                    />
                    <rect x="3" y="14" width="7" height="7" rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#8ECAB2] dark:text-[#70A18E]"
                    />
                    <circle cx="12" cy="12" r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[#3A554B] dark:text-[#B7F2DA]"
                    />
                  </svg>
                </span>
              </div>
            </form>
          </div>
        </div>

        <div className={`${isApplicationMenuOpen ? "flex" : "hidden"} items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}>
          <div className="flex items-center gap-2 2xsm:gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;