import type React from "react";
import type { FC } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  // Accesibilidad
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaRequired?: boolean;
  ariaInvalid?: boolean;
  required?: boolean;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  // Accesibilidad
  ariaLabel,
  ariaDescribedBy,
  ariaRequired,
  ariaInvalid,
  required = false,
  autoComplete,
  onKeyDown,
  onFocus,
  onBlur,
}) => {
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 text-scalable ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error || ariaInvalid) {
    inputClasses += ` border-error-500 focus:border-error-500 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-500`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-success-500 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-500`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-500 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-500`;
  }

  // Generar ID único si no se proporciona
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const describedBy = [ariaDescribedBy, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="relative">
      <input
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-required={ariaRequired || required}
        aria-invalid={ariaInvalid || error}
        className={inputClasses}
      />

      {hint && (
        <p
          id={hintId}
          className={`mt-1.5 text-xs text-scalable ${
            error || ariaInvalid
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
          role={error || ariaInvalid ? "alert" : undefined}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
