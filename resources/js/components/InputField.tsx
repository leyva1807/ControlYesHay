// resources/js/Components/InputField.tsx
import React from 'react';

type InputFieldProps = {
  type?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  label,
  autoFocus = false,
  className = "w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-150 ease-in-out",
  disabled = false,
}) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type={type}
        name={name}
        id={name}
        className={`${className} ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        disabled={disabled}
      />
      {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
    </div>
  );
};

export default InputField;
