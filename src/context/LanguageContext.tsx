"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";

type Language = "es" | "en";

type LanguageContextType = {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traducciones
const translations = {
  es: {
    // Header
    "header.search": "Buscar",
    "header.selectBranch": "Seleccionar sucursal",
    "header.loadingBranches": "Cargando sucursales...",
    "header.selectBranchTitle": "Seleccionar sucursal",
    "header.branchesAvailable": "sucursales disponibles",
    "header.noBranches": "No hay sucursales disponibles",
    "header.code": "Código:",
    "header.noResults": "No se encontraron resultados.",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.catalogues": "Catálogos",
    "nav.areas": "Áreas",
    "nav.services": "Servicios",
    "nav.clients": "Clientes",
    "nav.branches": "Sucursales",
    "nav.users": "Usuarios",
    "nav.operations": "Operaciones",
    "nav.appointments": "Citas",
    "nav.reports": "Reportes",
    "nav.shifts": "Turnos",
    "nav.notifications": "Notificaciones",
    "nav.configuration": "Configuración",
    "nav.calendar": "Calendario",
    "nav.forms": "Formularios",
    "nav.tables": "Tablas",
    "nav.uiElements": "Elementos UI",
    "nav.charts": "Gráficos",
    
    // Common
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.edit": "Editar",
    "common.delete": "Eliminar",
    "common.create": "Crear",
    "common.view": "Ver",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.export": "Exportar",
    "common.import": "Importar",
    "common.download": "Descargar",
    "common.upload": "Subir",
    "common.close": "Cerrar",
    "common.open": "Abrir",
    "common.yes": "Sí",
    "common.no": "No",
    "common.ok": "Aceptar",
    "common.back": "Atrás",
    "common.next": "Siguiente",
    "common.previous": "Anterior",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.warning": "Advertencia",
    "common.info": "Información",
    
    // Auth
    "auth.signIn": "Iniciar Sesión",
    "auth.signUp": "Registrarse",
    "auth.signOut": "Cerrar Sesión",
    "auth.email": "Correo Electrónico",
    "auth.password": "Contraseña",
    "auth.confirmPassword": "Confirmar Contraseña",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",
    "auth.resetPassword": "Restablecer Contraseña",
    "auth.rememberMe": "Recordarme",
    
    // User types
    "userType.administrator": "Administrador",
    "userType.executive": "Ejecutivo",
    "userType.client": "Cliente",
    "userType.advisor": "Asesor",
    
    // Language
    "language.spanish": "Español",
    "language.english": "English",
    "language.change": "Cambiar idioma",
  },
  en: {
    // Header
    "header.search": "Search",
    "header.selectBranch": "Select branch",
    "header.loadingBranches": "Loading branches...",
    "header.selectBranchTitle": "Select branch",
    "header.branchesAvailable": "branches available",
    "header.noBranches": "No branches available",
    "header.code": "Code:",
    "header.noResults": "No results found.",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.catalogues": "Catalogues",
    "nav.areas": "Areas",
    "nav.services": "Services",
    "nav.clients": "Clients",
    "nav.branches": "Branches",
    "nav.users": "Users",
    "nav.operations": "Operations",
    "nav.appointments": "Appointments",
    "nav.reports": "Reports",
    "nav.shifts": "Shifts",
    "nav.notifications": "Notifications",
    "nav.configuration": "Configuration",
    "nav.calendar": "Calendar",
    "nav.forms": "Forms",
    "nav.tables": "Tables",
    "nav.uiElements": "UI Elements",
    "nav.charts": "Charts",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.create": "Create",
    "common.view": "View",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.export": "Export",
    "common.import": "Import",
    "common.download": "Download",
    "common.upload": "Upload",
    "common.close": "Close",
    "common.open": "Open",
    "common.yes": "Yes",
    "common.no": "No",
    "common.ok": "OK",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.warning": "Warning",
    "common.info": "Information",
    
    // Auth
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.signOut": "Sign Out",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.forgotPassword": "Forgot your password?",
    "auth.resetPassword": "Reset Password",
    "auth.rememberMe": "Remember me",
    
    // User types
    "userType.administrator": "Administrator",
    "userType.executive": "Executive",
    "userType.client": "Client",
    "userType.advisor": "Advisor",
    
    // Language
    "language.spanish": "Español",
    "language.english": "English",
    "language.change": "Change language",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("es");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This code will only run on the client side
    const savedLanguage = localStorage.getItem("language") as Language | null;
    const initialLanguage = savedLanguage || "es"; // Default to Spanish

    setLanguageState(initialLanguage);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("language", language);
    }
  }, [language, isInitialized]);

  const toggleLanguage = () => {
    setLanguageState((prevLanguage) => (prevLanguage === "es" ? "en" : "es"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
