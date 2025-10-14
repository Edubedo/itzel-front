import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { useLogo } from "../../contexts/LogoContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logoLight, logoDark } = useLogo(); // <-- Usa el contexto

  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div
          className="items-center hidden w-full h-full lg:w-1/2 lg:grid relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#8ECAB2] rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-[#B7F2DA] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-[#70A18E] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-[#547A6B] rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
          </div>

          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-6">
                {/* Logo dinámico con efecto moderno */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#70A18E] to-[#8ECAB2] blur-xl opacity-30 dark:opacity-20 animate-pulse"></div>
                  <img
                    width={231}
                    height={48}
                    src={logoLight}
                    alt="Logo"
                    className="dark:hidden relative z-10"
                  />
                  <img
                    width={231}
                    height={48}
                    src={logoDark}
                    alt="Logo"
                    className="hidden dark:block relative z-10"
                  />
                </div>
              </Link>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#0A1310] dark:text-white mb-2">
                  Bienvenido a ITZEL
                </h2>
                <p className="text-[#547A6B] dark:text-gray-300 text-sm font-medium">
                  Sistema Inteligente de Turnos • CFE
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
