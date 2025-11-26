import React from "react";

// 🇪🇸 Bandera de España (colores originales)
export const SpanishIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 24"
    className={className}
  >
    {/* Rojo superior */}
    <rect width="32" height="6" fill="#AA151B"/>
    {/* Amarillo central */}
    <rect y="6" width="32" height="12" fill="#F1BF00"/>
    {/* Rojo inferior */}
    <rect y="18" width="32" height="6" fill="#AA151B"/>
  </svg>
);

// 🇬🇧 Bandera del Reino Unido (colores originales)
export const EnglishIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 24"
    className={className}
  >
    {/* Fondo azul */}
    <rect width="32" height="24" fill="#012169"/>
    {/* Cruces diagonales blancas */}
    <path d="M0 0L32 24M32 0L0 24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Cruces diagonales rojas */}
    <path d="M0 0L32 24M32 0L0 24" stroke="#C8102E" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Cruz central blanca */}
    <path d="M16 0V24M0 12H32" stroke="white" strokeWidth="3.5"/>
    {/* Cruz central roja */}
    <path d="M16 0V24M0 12H32" stroke="#C8102E" strokeWidth="2"/>
  </svg>
);
