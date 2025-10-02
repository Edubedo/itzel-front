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
    const [logoLight, setLogoLight] = useState<string>("");
    const [logoDark, setLogoDark] = useState<string>("");

    // Cargar logos al inicializar
    useEffect(() => {
        loadLogos();
    }, []);

    const loadLogos = async () => {
        try {
            const response = await fetch('/api/configuracion_sistema/configuracion');
            if (response.ok) {
                const config = await response.json();
                if (config.s_logo_light) setLogoLight(config.s_logo_light);
                if (config.s_logo_dark) setLogoDark(config.s_logo_dark);
            }
        } catch (error) {
            console.error("Error cargando logos:", error);
            // Usar logos por defecto si hay error
            setLogoLight("/images/logo/itzelLogoR.png");
            setLogoDark("/images/logo/itzelLogoR_dark.png");
        }
    };

    useEffect(() => {
        const favicon = document.querySelector("link[rel='icon']");
        if (favicon && logoLight) {
            favicon.setAttribute("href", logoLight);
        }
    }, [logoLight]);

    return (
        <LogoContext.Provider value={{ logoLight, logoDark, setLogoLight, setLogoDark }}>
            {children}
        </LogoContext.Provider>
    );
};