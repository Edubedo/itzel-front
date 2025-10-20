import { BrowserRouter, Routes, Route } from "react-router-dom"; // Corregido a react-router-dom
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/Configuration";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Areas from "./views/catalogos/areas/consulta/ConsultaAreas";
import ConsultaAreas from "./views/catalogos/areas/consulta/ConsultaAreas";
import FormularioAreas from "./views/catalogos/areas/formulario/FormularioAreas";
import ConsultaServicios from "./views/catalogos/servicios/consulta/ConsultaServicios";
import FormularioServicios from "./views/catalogos/servicios/formulario/FormularioServicios";
import ConsultaClientes from "./views/catalogos/clientes/consulta/ConsultaClientes";
import FormularioClientes from "./views/catalogos/clientes/formulario/FormularioClientes";
import Sucursales from "./views/catalogos/sucursales/Sucursales";
import ConsultaUsuarios from "./views/catalogos/usuarios/consulta/ConsultaUsuarios";
import FormularioUsuarios from "./views/catalogos/usuarios/formulario/FormularioUsuarios";
import Dashboard from "./views/general/Dashboard/Dashboard";
import Starter from "./views/general/Starter/Starter";
import ConsultaCitas from "./views/operaciones/citas/consulta/ConsultaCitas";
import FormularioCitas from "./views/operaciones/citas/formulario/FormularioCitas";
import ConsultaReportes from "./views/operaciones/reportes/consulta/ConsultaReportes";
import FormularioReportes from "./views/operaciones/reportes/formulario/FormularioReportes";
import ConsultaTurnos from "./views/operaciones/turnos/consulta/ConsultaTurnos";
import FormularioTurnos from "./views/operaciones/turnos/formulario/FormularioTurnos";
import RecoverPassword from "./pages/AuthPages/RecoverPassword";
import { LogoProvider } from "./contexts/LogoContext";
import AccessibilityDemo from "./pages/AccessibilityDemo";
import ClientSelectionDemo from "./pages/ClientSelectionDemo";


// Importar componentes de autenticación
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// ▼▼▼ 1. IMPORTA EL NUEVO COMPONENTE DE PÁGINA ▼▼▼
import PaginaServicio from "./views/catalogos/servicios/PaginaServicio";
import Configuration from "./pages/Configuration";

// Definir constantes para tipos de usuario (basado en el backend)
const USER_TYPES = {
  ADMINISTRADOR: 1,
  EJECUTIVO: 2,
  CLIENTE: 3,
  ASESOR: 4
};



export default function App() {
  return (
    <LogoProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Starter />} />
            <Route path="/client-selection-demo" element={<ClientSelectionDemo />} />
            <Route path="/reset-password" element={<RecoverPassword />} />


            {/* Rutas protegidas con layout */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              {/* Dashboard principal */}
              <Route index path="/home" element={<Home />} />

              {/* CATÁLOGOS - Solo Administradores y Ejecutivos */}

              {/* ÁREAS */}
              <Route path="/catalogos/areas/consulta/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR]}>
                  <ConsultaAreas />
                </ProtectedRoute>
              } />
              <Route path="/catalogos/areas/formulario/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR]}>
                  <FormularioAreas />
                </ProtectedRoute>
              } />

              {/* SERVICIOS */}
              <Route path="/catalogos/servicios/consulta/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR]}>
                  <ConsultaServicios />
                </ProtectedRoute>
              } />
              <Route path="/catalogos/servicios/formulario/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR]}>
                  <FormularioServicios />
                </ProtectedRoute>
              } />

              {/* ▼▼▼ 2. AQUÍ ESTÁ LA NUEVA RUTA DINÁMICA ▼▼▼ */}
              <Route path="/servicio/:slug" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR]}>
                  <PaginaServicio />
                </ProtectedRoute>
              } />

              {/* CLIENTES - Solo Administradores y Ejecutivos pueden ver todos los clientes */}
              <Route path="/catalogos/clientes/consulta/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR, USER_TYPES.EJECUTIVO]}>
                  <ConsultaClientes />
                </ProtectedRoute>
              } />
              <Route path="/catalogos/clientes/formulario/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR, USER_TYPES.EJECUTIVO]}>
                  <FormularioClientes />
                </ProtectedRoute>
              } />

              {/* SUCURSALES */}
              <Route path="/catalogos/sucursales" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR]}>
                  <Sucursales />
                </ProtectedRoute>
              } />

              {/* USUARIOS - Solo Administradores */}
              <Route path="/catalogos/usuarios/consulta/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR]}>
                  <ConsultaUsuarios />
                </ProtectedRoute>
              } />
              <Route path="/catalogos/usuarios/formulario/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR]}>
                  <FormularioUsuarios />
                </ProtectedRoute>
              } />

              {/* OPERACIONES - Accesibles por todos los usuarios autenticados */}

              {/* CITAS */}
              <Route path="/operaciones/citas/consulta/" element={<ConsultaCitas />} />
              <Route path="/operaciones/citas/formulario/" element={<FormularioCitas />} />

              {/* REPORTES - Solo Administradores y Ejecutivos */}
              <Route path="/operaciones/reportes/consulta/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR, USER_TYPES.EJECUTIVO]}>
                  <ConsultaReportes />
                </ProtectedRoute>
              } />
              <Route path="/operaciones/reportes/formulario/" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR, USER_TYPES.EJECUTIVO]}>
                  <FormularioReportes />
                </ProtectedRoute>
              } />

              {/* TURNOS - Accesibles por todos los usuarios autenticados */}
              <Route path="/operaciones/turnos/consulta/" element={<ConsultaTurnos />} />
              <Route path="/operaciones/turnos/formulario/" element={<FormularioTurnos />} />

              {/* Páginas generales */}
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/blank" element={<Blank />} />
              <Route path="/accessibility-demo" element={<AccessibilityDemo />} />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>

            {/* PANTALLA GENERAL - Protegida */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {/* Rutas adicionales con layout protegido */}
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              {/* Catalogos duplicados - limpiar duplicados */}
              <Route path="/catalogos/areas" element={
                <ProtectedRoute requiredRoles={[USER_TYPES.ADMINISTRADOR, USER_TYPES.EJECUTIVO]}>
                  <Areas />
                </ProtectedRoute>
              } />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LogoProvider>
  );
}