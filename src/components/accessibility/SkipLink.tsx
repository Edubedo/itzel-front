import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className = "" 
}) => {
  return (
    <a
      href={href}
      className={`skip-link ${className}`}
      onFocus={(e) => {
        // Asegurar que el enlace sea visible cuando recibe foco
        e.currentTarget.style.top = '6px';
      }}
      onBlur={(e) => {
        // Ocultar el enlace cuando pierde el foco
        e.currentTarget.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
};

export default SkipLink;

