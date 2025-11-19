import React from "react";

// 🇪🇸 Bandera de España (outline con escudo simple)
export const SpanishIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-current" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Marco */}
    <rect x="0.75" y="0.75" width="22.5" height="14.5" rx="2" />
    {/* Franjas superior e inferior */}
    <line x1="1" y1="4" x2="23" y2="4" />
    <line x1="1" y1="12" x2="23" y2="12" />
    {/* Escudo simplificado */}
    <path d="M10 6h4v4h-4z" />
  </svg>
);

// 🇬🇧 Bandera del Reino Unido (outline simplificada tipo Union Jack)
export const EnglishIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-current" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Marco */}
    <rect x="0.75" y="0.75" width="22.5" height="14.5" rx="2" />
    {/* Cruz central */}
    <line x1="12" y1="1" x2="12" y2="15" />
    <line x1="1" y1="8" x2="23" y2="8" />
    {/* Cruces diagonales */}
    <line x1="1" y1="1" x2="23" y2="15" />
    <line x1="23" y1="1" x2="1" y2="15" />
  </svg>
);
