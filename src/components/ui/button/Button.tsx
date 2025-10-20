import { ReactNode, forwardRef } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional CSS classes
  // Accesibilidad
  ariaLabel?: string; // Etiqueta ARIA para lectores de pantalla
  ariaDescribedBy?: string; // ID del elemento que describe el botón
  ariaExpanded?: boolean; // Para botones que controlan contenido expandible
  ariaPressed?: boolean; // Para botones toggle
  role?: string; // Rol ARIA personalizado
  tabIndex?: number; // Orden de tabulación
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void; // Manejo de teclas
  type?: "button" | "submit" | "reset"; // Tipo de botón
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  ariaExpanded,
  ariaPressed,
  role,
  tabIndex,
  onKeyDown,
  type = "button",
  ...props
}, ref) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
  };

  // Manejo de teclas para accesibilidad
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // Permitir activación con Enter y Espacio
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onClick && !disabled) {
        onClick();
      }
    }
    
    // Llamar al handler personalizado si existe
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition focus:outline-none ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      role={role}
      tabIndex={tabIndex}
      {...props}
    >
      {startIcon && <span className="flex items-center" aria-hidden="true">{startIcon}</span>}
      <span className="text-scalable">{children}</span>
      {endIcon && <span className="flex items-center" aria-hidden="true">{endIcon}</span>}
    </button>
  );
});

Button.displayName = "Button";

export default Button;