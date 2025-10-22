# Guía de Sistema de Traducciones

## Descripción
El sistema de traducciones permite cambiar el idioma de la aplicación entre español e inglés. El idioma se guarda en localStorage y persiste entre sesiones.

## Componentes Implementados

### 1. LanguageContext (`src/context/LanguageContext.tsx`)
- **Propósito**: Maneja el estado global del idioma
- **Funciones**:
  - `language`: Idioma actual ("es" | "en")
  - `toggleLanguage()`: Cambia entre español e inglés
  - `setLanguage(lang)`: Establece un idioma específico
  - `t(key)`: Función de traducción

### 2. LanguageToggleButton (`src/components/common/LanguageToggleButton.tsx`)
- **Propósito**: Botón para cambiar idioma en el header
- **Características**: Icono de globo, tooltip con idioma actual

### 3. Integración en App.tsx
- Se envuelve toda la aplicación con `LanguageProvider`

## Cómo Usar las Traducciones

### En Componentes React
```tsx
import { useLanguage } from "../context/LanguageContext";

const MiComponente = () => {
  const { t, language, toggleLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t("common.title")}</h1>
      <p>Idioma actual: {language}</p>
      <button onClick={toggleLanguage}>
        {t("language.change")}
      </button>
    </div>
  );
};
```

### Claves de Traducción Disponibles

#### Header
- `header.search`: "Buscar" / "Search"
- `header.selectBranch`: "Seleccionar sucursal" / "Select branch"
- `header.loadingBranches`: "Cargando sucursales..." / "Loading branches..."
- `header.selectBranchTitle`: "Seleccionar sucursal" / "Select branch"
- `header.branchesAvailable`: "sucursales disponibles" / "branches available"
- `header.noBranches`: "No hay sucursales disponibles" / "No branches available"
- `header.code`: "Código:" / "Code:"
- `header.noResults`: "No se encontraron resultados." / "No results found."

#### Navegación
- `nav.dashboard`: "Dashboard"
- `nav.catalogues`: "Catálogos" / "Catalogues"
- `nav.areas`: "Áreas" / "Areas"
- `nav.services`: "Servicios" / "Services"
- `nav.clients`: "Clientes" / "Clients"
- `nav.branches`: "Sucursales" / "Branches"
- `nav.users`: "Usuarios" / "Users"
- `nav.operations`: "Operaciones" / "Operations"
- `nav.appointments`: "Citas" / "Appointments"
- `nav.reports`: "Reportes" / "Reports"
- `nav.shifts`: "Turnos" / "Shifts"
- `nav.notifications`: "Notificaciones" / "Notifications"
- `nav.configuration`: "Configuración" / "Configuration"
- `nav.calendar`: "Calendario" / "Calendar"
- `nav.forms`: "Formularios" / "Forms"
- `nav.tables`: "Tablas" / "Tables"
- `nav.uiElements`: "Elementos UI" / "UI Elements"
- `nav.charts`: "Gráficos" / "Charts"

#### Comunes
- `common.save`: "Guardar" / "Save"
- `common.cancel`: "Cancelar" / "Cancel"
- `common.edit`: "Editar" / "Edit"
- `common.delete`: "Eliminar" / "Delete"
- `common.create`: "Crear" / "Create"
- `common.view`: "Ver" / "View"
- `common.search`: "Buscar" / "Search"
- `common.filter`: "Filtrar" / "Filter"
- `common.export`: "Exportar" / "Export"
- `common.import`: "Importar" / "Import"
- `common.download`: "Descargar" / "Download"
- `common.upload`: "Subir" / "Upload"
- `common.close`: "Cerrar" / "Close"
- `common.open`: "Abrir" / "Open"
- `common.yes`: "Sí" / "Yes"
- `common.no`: "No" / "No"
- `common.ok`: "Aceptar" / "OK"
- `common.back`: "Atrás" / "Back"
- `common.next`: "Siguiente" / "Next"
- `common.previous`: "Anterior" / "Previous"
- `common.loading`: "Cargando..." / "Loading..."
- `common.error`: "Error"
- `common.success`: "Éxito" / "Success"
- `common.warning`: "Advertencia" / "Warning"
- `common.info`: "Información" / "Information"

#### Autenticación
- `auth.signIn`: "Iniciar Sesión" / "Sign In"
- `auth.signUp`: "Registrarse" / "Sign Up"
- `auth.signOut`: "Cerrar Sesión" / "Sign Out"
- `auth.email`: "Correo Electrónico" / "Email"
- `auth.password`: "Contraseña" / "Password"
- `auth.confirmPassword`: "Confirmar Contraseña" / "Confirm Password"
- `auth.forgotPassword`: "¿Olvidaste tu contraseña?" / "Forgot your password?"
- `auth.resetPassword`: "Restablecer Contraseña" / "Reset Password"
- `auth.rememberMe`: "Recordarme" / "Remember me"

#### Tipos de Usuario
- `userType.administrator`: "Administrador" / "Administrator"
- `userType.executive`: "Ejecutivo" / "Executive"
- `userType.client`: "Cliente" / "Client"
- `userType.advisor`: "Asesor" / "Advisor"

#### Idioma
- `language.spanish`: "Español"
- `language.english`: "English"
- `language.change`: "Cambiar idioma" / "Change language"

## Agregar Nuevas Traducciones

Para agregar nuevas traducciones:

1. **Editar `LanguageContext.tsx`**:
```tsx
const translations = {
  es: {
    // ... traducciones existentes
    "miNuevaClave": "Mi texto en español",
  },
  en: {
    // ... traducciones existentes
    "miNuevaClave": "My text in English",
  }
};
```

2. **Usar en componentes**:
```tsx
const { t } = useLanguage();
return <span>{t("miNuevaClave")}</span>;
```

## Características Técnicas

- **Persistencia**: El idioma se guarda en `localStorage`
- **Reactividad**: Los cambios se reflejan inmediatamente en toda la aplicación
- **TypeScript**: Completamente tipado
- **Fallback**: Si una clave no existe, se devuelve la clave misma
- **Performance**: Las traducciones se cargan una sola vez

## Ubicación del Botón

El botón de cambio de idioma se encuentra en el header, junto al botón de tema y las notificaciones.

## Ejemplo Completo

```tsx
import React from "react";
import { useLanguage } from "../context/LanguageContext";

const EjemploComponente = () => {
  const { t, language, toggleLanguage } = useLanguage();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {t("common.title")}
      </h1>
      
      <p className="mb-4">
        {t("common.currentLanguage")}: {language === "es" ? "Español" : "English"}
      </p>
      
      <button 
        onClick={toggleLanguage}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {t("language.change")}
      </button>
    </div>
  );
};

export default EjemploComponente;
```

## Notas Importantes

1. **Siempre usar la función `t()`** para textos que necesiten traducción
2. **Usar claves descriptivas** como `"header.search"` en lugar de `"search"`
3. **Mantener consistencia** en las claves entre idiomas
4. **Probar ambos idiomas** al implementar nuevas funcionalidades
5. **El idioma por defecto es español** si no hay preferencia guardada
