// resources/js/Components/InputField.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type InputFieldProps = {
  type?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  helpText?: string;
  autoFocus?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  readOnly?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  label,
  helpText,
  autoFocus = false,
  className,
  containerClassName,
  labelClassName,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  readOnly = false,
  maxLength,
  min,
  max,
  step,
  pattern,
  onBlur,
  onFocus,
}, ref) => {
  const defaultInputClasses = "w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-150 ease-in-out";

  const inputClasses = cn(
    defaultInputClasses,
    error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '',
    disabled ? 'bg-gray-100 cursor-not-allowed' : '',
    readOnly ? 'bg-gray-50 cursor-default' : '',
    icon && iconPosition === 'left' ? 'pl-10' : '',
    icon && iconPosition === 'right' ? 'pr-10' : '',
    className
  );

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={name}
          className={cn("block text-sm font-medium text-gray-700 mb-1", required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : "", labelClassName)}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          name={name}
          id={name}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          maxLength={maxLength}
          min={min}
          max={max}
          step={step}
          pattern={pattern}
          onBlur={onBlur}
          onFocus={onFocus}
        />

        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
      </div>

      {helpText && !error && (
        <div className="text-gray-500 text-xs mt-1">{helpText}</div>
      )}

      {error && (
        <div className="text-red-600 text-xs mt-1">{error}</div>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
