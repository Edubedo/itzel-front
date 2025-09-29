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
    const [logoLight, setLogoLight] = useState<string>("/images/logo/itzelLogoR.png");
    const [logoDark, setLogoDark] = useState<string>("/images/logo/itzelLogoR_dark.png");

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