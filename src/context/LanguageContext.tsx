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
    "common.refresh": "Actualizar",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.warning": "Advertencia",
    "common.info": "Información",
    "common.viewMore": "Ver más",
    "common.clear": "Limpiar",
    
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
    
    // Dashboard
    "dashboard.clientsToday": "Clientes del Día",
    "dashboard.shiftsIssuedToday": "Turnos Emitidos Hoy",
    "dashboard.mostRequestedServices": "Servicios más solicitados",
    "dashboard.mostFrequentedAreas": "Áreas Más Frecuentadas",
    "dashboard.basedOnRecentClientVisits": "Basado en visitas recientes de clientes",
    "dashboard.noDataToShow": "No hay datos para mostrar",
    "dashboard.loadingChart": "Cargando gráfico...",
    "dashboard.currentShift": "Turno Actual",
    "dashboard.shiftsToday": "Turnos Hoy",
    "dashboard.averageTime": "Tiempo Promedio",
    "dashboard.attendedClients": "Clientes Atendidos",
    "dashboard.activeBranches": "Sucursales Activas",
    
    // Service names (for chart labels)
    "services.collection": "Cobranza",
    "services.reports": "Reportes",
    "services.commercial": "Comercial",
    "services.contractService": "Contratar servicio",
    "services.paymentPlans": "Planes de pago",
    "services.serviceContract": "contrato de servicio",
    "services.largeUsers": "Grandes usuarios",
    "services.energyEfficiency": "Eficiencia Energética",
    "services.industrial": "Industrial",
    
    // Months
    "months.january": "Enero",
    "months.february": "Febrero",
    "months.march": "Marzo",
    "months.april": "Abril",
    "months.may": "Mayo",
    "months.june": "Junio",
    "months.july": "Julio",
    "months.august": "Agosto",
    "months.september": "Septiembre",
    "months.october": "Octubre",
    "months.november": "Noviembre",
    "months.december": "Diciembre",
    
    // Areas
    "areas.manageAndConsultAreas": "Gestiona y consulta las áreas del sistema",
    "areas.newArea": "Nueva Área",
    "areas.totalAreas": "Total Áreas",
    "areas.active": "Activas",
    "areas.inactive": "Inactivas",
    "areas.searchArea": "Buscar Área",
    "areas.searchByCodeOrName": "Buscar por código o nombre...",
    "areas.status": "Estado",
    "areas.allStatuses": "Todos los estados",
    "areas.branch": "Sucursal",
    "areas.allBranches": "Todas las sucursales",
    "areas.areaQuery": "Consulta de Áreas",
    "areas.code": "Código",
    "areas.areaName": "Nombre del Área",
    "areas.description": "Descripción",
    "areas.actions": "Acciones",
    "areas.noAreasFound": "No se encontraron áreas",
    "areas.tryAdjustingFilters": "Intente ajustar los filtros de búsqueda",
    "areas.noAreasRegistered": "No hay áreas registradas en el sistema",
    "areas.editArea": "Editar área",
    "areas.deactivateArea": "Inactivar área",
    "areas.activateArea": "Activar área",
    "areas.showing": "Mostrando",
    "areas.of": "de",
    "areas.areas": "áreas",
    "areas.areaList": "Lista de Áreas",
    
    // Services
    "services.manageAndConsultServices": "Gestiona y consulta los servicios del sistema",
    "services.newService": "Nuevo Servicio",
    "services.totalServices": "Total Servicios",
    "services.active": "Activos",
    "services.forClients": "Para Clientes",
    "services.forNonClients": "Para No Clientes",
    "services.searchService": "Buscar Servicio",
    "services.searchByCodeOrName": "Buscar por código o nombre...",
    "services.area": "Área",
    "services.allAreas": "Todas las áreas",
    "services.clientType": "Tipo de Cliente",
    "services.allTypes": "Todos los tipos",
    "services.clients": "Clientes",
    "services.nonClients": "No clientes",
    "services.serviceQuery": "Consulta de Servicios",
    
    // Clients
    "clients.manageAndConsultClients": "Gestiona y consulta los clientes del sistema",
    "clients.newClient": "Nuevo Cliente",
    "clients.clientList": "Lista de Clientes",
    "clients.clientCode": "Código Cliente",
    "clients.name": "Nombre",
    "clients.lastName": "Apellido Paterno",
    "clients.motherLastName": "Apellido Materno",
    "clients.contractType": "Tipo Contrato",
    "clients.address": "Domicilio",
    "clients.premiumClient": "Cliente Premium",
    "clients.status": "Estado",
    "clients.actions": "Acciones",
    "clients.standard": "ESTÁNDAR",
    "clients.editClient": "Editar cliente",
    "clients.deactivateClient": "Inactivar cliente",
    "clients.activateClient": "Activar cliente",
    "clients.noClientsFound": "No se encontraron clientes",
    "clients.tryAdjustingFilters": "Intente ajustar los filtros de búsqueda",
    "clients.noClientsRegistered": "No hay clientes registrados en el sistema",
    "clients.showing": "Mostrando",
    "clients.of": "de",
    "clients.clients": "clientes",
    "clients.previous": "Anterior",
    "clients.next": "Siguiente",
    "clients.totalClients": "Total Clientes",
    "clients.active": "Activos",
    "clients.inactive": "Inactivos",
    "clients.premium": "Premium",
    "clients.searchClient": "Buscar Cliente",
    "clients.searchByCodeNameSurname": "Buscar por código, nombre, apellido...",
    "clients.clientQuery": "Consulta de Clientes",
    
    // Users
    "users.manageAndConsultUsers": "Gestiona y consulta los usuarios del sistema",
    "users.newUser": "Nuevo Usuario",
    "users.totalUsers": "Total Usuarios",
    "users.active": "Activos",
    "users.inactive": "Inactivos",
    "users.byType": "Por Tipo",
    "users.admin": "Admin",
    "users.executives": "Ejecutivos",
    "users.advisors": "Asesores",
    "users.searchUser": "Buscar Usuario",
    "users.searchByNameSurnameEmail": "Buscar por nombre, apellido o correo...",
    "users.userType": "Tipo de Usuario",
    "users.allTypes": "Todos los tipos",
    "users.administrator": "Administrador",
    "users.executive": "Ejecutivo",
    "users.advisor": "Asesor",
    "users.status": "Estado",
    "users.allStatuses": "Todos los estados",
    "users.userList": "Lista de Usuarios",
    
    // Configuration
    "configuration.title": "Configuración",
    "configuration.successTitle": "¡Operación exitosa!",
    "configuration.active": "ACTIVO",
    "configuration.unsavedChanges": "CAMBIOS SIN GUARDAR",
    "configuration.generalInfo": "Información General",
    "configuration.systemStatus": "Estatus del Sistema",
    "configuration.systemActiveMessage": "El sistema está actualmente activo y funcionando",
    "configuration.companyName": "Nombre de la Empresa *",
    "configuration.systemName": "Nombre del Sistema *",
    "configuration.logoAndAppearance": "Logo y Apariencia",
    "configuration.uploadLightLogo": "Subir Logo Light",
    "configuration.uploadDarkLogo": "Subir Logo Dark",
    "configuration.fileFormats": "Formatos: JPG, PNG, SVG. Máx. 2MB.",
    "configuration.lastUpdate": "Última actualización:",
    "configuration.cancel": "Cancelar",
    "configuration.resetAll": "Restablecer Todo",
    "configuration.saveConfiguration": "Guardar Configuración",
    "configuration.saving": "Guardando...",
    "configuration.resetConfirm": "¿Restablecer toda la configuración a valores por defecto? Los cambios no guardados se perderán.",
    "configuration.cancelConfirm": "Tienes cambios sin guardar. ¿Seguro que quieres cancelar?",
    "configuration.fileTooLarge": "El archivo es demasiado grande. Máximo 2MB.",
    "configuration.invalidFormat": "Formato de archivo no válido. Use JPG, PNG o SVG.",
    "configuration.imageError": "Error al procesar la imagen. Intente con otra.",
    "configuration.fileReadError": "Error al leer el archivo",
    "configuration.saveError": "Error al guardar configuración:",
    "configuration.updateSuccess": "¡Configuración actualizada correctamente!",
    
    // User dropdown translations
    "userDropdown.configuration": "Configuración",
    "userDropdown.myTurns": "Mis Turnos",
    "userDropdown.logout": "Cerrar Sesión",
    "userDropdown.administrator": "Administrador",
    "userDropdown.executive": "Ejecutivo",
    "userDropdown.advisor": "Asesor",
    "userDropdown.user": "Usuario",
    
    // Branches
    "branches.branchQuery": "Consulta de Sucursales",
    "branches.branchCatalog": "Catálogo de Sucursales",
    "branches.manageAndConsultBranches": "Gestiona y consulta las sucursales del sistema",
    "branches.newBranch": "Nueva Sucursal",
    "branches.totalBranches": "Total Sucursales",
    "branches.active": "Activas",
    "branches.searchByNameOrAddress": "Buscar por Nombre o Domicilio",
    "branches.searchByNameOrAddressPlaceholder": "Buscar por nombre o domicilio...",
    "branches.state": "Estado",
    "branches.allStates": "Todos los estados",
    "branches.municipality": "Municipio",
    "branches.allMunicipalities": "Todos los municipios",
    "branches.selectState": "Seleccione un estado",
    "branches.branchList": "Lista de Sucursales",
    
    // Shifts
    "shifts.noBranchSelected": "No hay sucursal seleccionada",
    "shifts.selectBranchMessage": "Por favor seleccione una sucursal en el menú superior.",
    "shifts.shiftManagement": "Gestión de Turnos",
    "shifts.branch": "Sucursal",
    "shifts.totalToday": "Total Hoy",
    "shifts.waiting": "En Espera",
    "shifts.inProgress": "En Proceso",
    "shifts.attended": "Atendidos",
    "shifts.attendNextShift": "Atender Próximo Turno",
    "shifts.finishAttention": "Finalizar Atención",
    "shifts.update": "Actualizar",
    "shifts.shiftInAttention": "Turno en Atención",
    "shifts.area": "Área",
    "shifts.service": "Servicio",
    "shifts.client": "Cliente",
    "shifts.attendedBy": "Atendido por",
    "shifts.start": "Inicio",
    "shifts.noShiftInAttention": "No hay turno en atención",
    "shifts.selectNextShiftMessage": "Seleccione \"Atender Próximo Turno\" para comenzar",
    "shifts.nextShifts": "Próximos Turnos",
    
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
    
    // Configuration page translations
    "configuration.title": "Configuration",
    "configuration.successTitle": "Success",
    "configuration.active": "Active",
    "configuration.unsavedChanges": "Unsaved Changes",
    "configuration.generalInfo": "General Information",
    "configuration.systemStatus": "System Status",
    "configuration.systemActiveMessage": "System is running normally",
    "configuration.companyName": "Company Name",
    "configuration.systemName": "System Name",
    "configuration.logoAndAppearance": "Logo and Appearance",
    "configuration.uploadLightLogo": "Upload Light Logo",
    "configuration.uploadDarkLogo": "Upload Dark Logo",
    "configuration.fileFormats": "Formats: JPG, PNG, SVG. Max. 2MB.",
    "configuration.lastUpdate": "Last update:",
    "configuration.cancel": "Cancel",
    "configuration.resetAll": "Reset All",
    "configuration.saveConfiguration": "Save Configuration",
    "configuration.saving": "Saving...",
    "configuration.resetConfirm": "Reset all configuration to default values? Unsaved changes will be lost.",
    "configuration.cancelConfirm": "You have unsaved changes. Are you sure you want to cancel?",
    "configuration.fileTooLarge": "File is too large. Maximum 2MB.",
    "configuration.invalidFormat": "Invalid file format. Use JPG, PNG or SVG.",
    "configuration.imageError": "Error processing image. Try with another one.",
    "configuration.fileReadError": "Error reading file",
    "configuration.saveError": "Error saving configuration:",
    "configuration.updateSuccess": "Configuration updated successfully!",
    
    // User dropdown translations
    "userDropdown.configuration": "Configuration",
    "userDropdown.myTurns": "My Turns",
    "userDropdown.logout": "Log Out",
    "userDropdown.administrator": "Administrator",
    "userDropdown.executive": "Executive",
    "userDropdown.advisor": "Advisor",
    "userDropdown.user": "User",
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
    "common.refresh": "Refresh",
    "common.error": "Error",
    "common.success": "Success",
    "common.warning": "Warning",
    "common.info": "Information",
    "common.viewMore": "View more",
    "common.clear": "Clear",
    
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
    
    // Dashboard
    "dashboard.clientsToday": "Today's Clients",
    "dashboard.shiftsIssuedToday": "Shifts Issued Today",
    "dashboard.mostRequestedServices": "Most Requested Services",
    "dashboard.mostFrequentedAreas": "Most Frequented Areas",
    "dashboard.basedOnRecentClientVisits": "Based on recent client visits",
    "dashboard.noDataToShow": "No data to show",
    "dashboard.loadingChart": "Loading chart...",
    "dashboard.currentShift": "Current Shift",
    "dashboard.shiftsToday": "Shifts Today",
    "dashboard.averageTime": "Average Time",
    "dashboard.attendedClients": "Attended Clients",
    "dashboard.activeBranches": "Active Branches",
    
    // Service names (for chart labels)
    "services.collection": "Collection",
    "services.reports": "Reports",
    "services.commercial": "Commercial",
    "services.contractService": "Contract service",
    "services.paymentPlans": "Payment plans",
    "services.serviceContract": "service contract",
    "services.largeUsers": "Large users",
    "services.energyEfficiency": "Energy Efficiency",
    "services.industrial": "Industrial",
    
    // Months
    "months.january": "January",
    "months.february": "February",
    "months.march": "March",
    "months.april": "April",
    "months.may": "May",
    "months.june": "June",
    "months.july": "July",
    "months.august": "August",
    "months.september": "September",
    "months.october": "October",
    "months.november": "November",
    "months.december": "December",
    
    // Areas
    "areas.manageAndConsultAreas": "Manage and consult system areas",
    "areas.newArea": "New Area",
    "areas.totalAreas": "Total Areas",
    "areas.active": "Active",
    "areas.inactive": "Inactive",
    "areas.searchArea": "Search Area",
    "areas.searchByCodeOrName": "Search by code or name...",
    "areas.status": "Status",
    "areas.allStatuses": "All statuses",
    "areas.branch": "Branch",
    "areas.allBranches": "All branches",
    "areas.areaQuery": "Area Query",
    "areas.code": "Code",
    "areas.areaName": "Area Name",
    "areas.description": "Description",
    "areas.actions": "Actions",
    "areas.noAreasFound": "No areas found",
    "areas.tryAdjustingFilters": "Try adjusting search filters",
    "areas.noAreasRegistered": "No areas registered in the system",
    "areas.editArea": "Edit area",
    "areas.deactivateArea": "Deactivate area",
    "areas.activateArea": "Activate area",
    "areas.showing": "Showing",
    "areas.of": "of",
    "areas.areas": "areas",
    "areas.areaList": "Area List",
    
    // Services
    "services.manageAndConsultServices": "Manage and consult system services",
    "services.newService": "New Service",
    "services.totalServices": "Total Services",
    "services.active": "Active",
    "services.forClients": "For Clients",
    "services.forNonClients": "For Non-Clients",
    "services.searchService": "Search Service",
    "services.searchByCodeOrName": "Search by code or name...",
    "services.area": "Area",
    "services.allAreas": "All areas",
    "services.clientType": "Client Type",
    "services.allTypes": "All types",
    "services.clients": "Clients",
    "services.nonClients": "Non-clients",
    "services.serviceQuery": "Service Query",
    
    // Clients
    "clients.manageAndConsultClients": "Manage and consult system clients",
    "clients.newClient": "New Client",
    "clients.clientList": "Client List",
    "clients.clientCode": "Client Code",
    "clients.name": "Name",
    "clients.lastName": "Last Name",
    "clients.motherLastName": "Mother's Last Name",
    "clients.contractType": "Contract Type",
    "clients.address": "Address",
    "clients.premiumClient": "Premium Client",
    "clients.status": "Status",
    "clients.actions": "Actions",
    "clients.standard": "STANDARD",
    "clients.editClient": "Edit client",
    "clients.deactivateClient": "Deactivate client",
    "clients.activateClient": "Activate client",
    "clients.noClientsFound": "No clients found",
    "clients.tryAdjustingFilters": "Try adjusting search filters",
    "clients.noClientsRegistered": "No clients registered in the system",
    "clients.showing": "Showing",
    "clients.of": "of",
    "clients.clients": "clients",
    "clients.previous": "Previous",
    "clients.next": "Next",
    "clients.totalClients": "Total Clients",
    "clients.active": "Active",
    "clients.inactive": "Inactive",
    "clients.premium": "Premium",
    "clients.searchClient": "Search Client",
    "clients.searchByCodeNameSurname": "Search by code, name, surname...",
    "clients.clientQuery": "Client Query",
    
    // Users
    "users.manageAndConsultUsers": "Manage and consult system users",
    "users.newUser": "New User",
    "users.totalUsers": "Total Users",
    "users.active": "Active",
    "users.inactive": "Inactive",
    "users.byType": "By Type",
    "users.admin": "Admin",
    "users.executives": "Executives",
    "users.advisors": "Advisors",
    "users.searchUser": "Search User",
    "users.searchByNameSurnameEmail": "Search by name, surname or email...",
    "users.userType": "User Type",
    "users.allTypes": "All types",
    "users.administrator": "Administrator",
    "users.executive": "Executive",
    "users.advisor": "Advisor",
    "users.status": "Status",
    "users.allStatuses": "All statuses",
    "users.userList": "User List",
    
    
    // Branches
    "branches.branchQuery": "Branch Query",
    "branches.branchCatalog": "Branch Catalog",
    "branches.manageAndConsultBranches": "Manage and consult system branches",
    "branches.newBranch": "New Branch",
    "branches.totalBranches": "Total Branches",
    "branches.active": "Active",
    "branches.searchByNameOrAddress": "Search by Name or Address",
    "branches.searchByNameOrAddressPlaceholder": "Search by name or address...",
    "branches.state": "State",
    "branches.allStates": "All states",
    "branches.municipality": "Municipality",
    "branches.allMunicipalities": "All municipalities",
    "branches.selectState": "Select a state",
    "branches.branchList": "Branch List",
    
    // Shifts
    "shifts.noBranchSelected": "No branch selected",
    "shifts.selectBranchMessage": "Please select a branch from the top menu.",
    "shifts.shiftManagement": "Shift Management",
    "shifts.branch": "Branch",
    "shifts.totalToday": "Total Today",
    "shifts.waiting": "Waiting",
    "shifts.inProgress": "In Progress",
    "shifts.attended": "Attended",
    "shifts.attendNextShift": "Attend Next Shift",
    "shifts.finishAttention": "Finish Attention",
    "shifts.update": "Update",
    "shifts.shiftInAttention": "Shift in Attention",
    "shifts.area": "Area",
    "shifts.service": "Service",
    "shifts.client": "Client",
    "shifts.attendedBy": "Attended by",
    "shifts.start": "Start",
    "shifts.noShiftInAttention": "No shift in attention",
    "shifts.selectNextShiftMessage": "Select \"Attend Next Shift\" to begin",
    "shifts.nextShifts": "Next Shifts",
    
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
