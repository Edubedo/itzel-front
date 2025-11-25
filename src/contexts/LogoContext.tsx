import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type LogoContextType = {
    logoLight: string;
    logoDark: string;
    setLogoLight: (logo: string) => void;
    setLogoDark: (logo: string) => void;
};

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const useLogo = () => {
    const context = useContext(LogoContext);
    if (!context) throw new Error("useLogo debe usarse dentro de LogoProvider");
    return context;
};

export const LogoProvider = ({ children }: { children: ReactNode }) => {
    // Logos por defecto (rutas relativas que funcionan en producción)
    const DEFAULT_LOGO_LIGHT = "/images/logo/itzelLogoR.png";
    const DEFAULT_LOGO_DARK = "/images/logo/itzelLogoR_dark.png";

    const [logoLight, setLogoLight] = useState<string>(DEFAULT_LOGO_LIGHT);
    const [logoDark, setLogoDark] = useState<string>(DEFAULT_LOGO_DARK);

    // Cargar logos al inicializar
    useEffect(() => {
        loadLogos();
    }, []);

    const loadLogos = async () => {
        try {
            const response = await fetch('/api/configuracion_sistema/configuracion');
            if (response.ok) {
                const config = await response.json();
                
                // Si hay logo light en base64, usarlo; si no, usar el por defecto
                if (config.s_logo_light && config.s_logo_light.startsWith('data:image')) {
                    setLogoLight(config.s_logo_light);
                } else {
                    setLogoLight(DEFAULT_LOGO_LIGHT);
                }
                
                // Si hay logo dark en base64, usarlo; si no, usar el por defecto
                if (config.s_logo_dark && config.s_logo_dark.startsWith('data:image')) {
                    setLogoDark(config.s_logo_dark);
                } else {
                    setLogoDark(DEFAULT_LOGO_DARK);
                }
            }
        } catch (error) {
            console.error("Error cargando logos:", error);
            // Usar logos por defecto si hay error
            setLogoLight(DEFAULT_LOGO_LIGHT);
            setLogoDark(DEFAULT_LOGO_DARK);
        }
    };

    useEffect(() => {
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon && logoLight) {
            // Solo actualizar favicon si es base64 o una ruta válida
            if (logoLight.startsWith('data:image') || logoLight.startsWith('/') || logoLight.startsWith('http')) {
                favicon.setAttribute("href", logoLight);
            }
        }
    }, [logoLight]);

    return (
        <LogoContext.Provider value={{ logoLight, logoDark, setLogoLight, setLogoDark }}>
            {children}
        </LogoContext.Provider>
    );
};