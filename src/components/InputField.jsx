import React from 'react';
import { AlertCircle } from 'lucide-react';

const InputField = ({
    id,
    name,
    type = "text",
    placeholder,
    label,
    errorMessage,
    ariaInvalid,
    value,
    required,
    handleChange
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
            {label}
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
            <input
                value={value}
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                aria-invalid={ariaInvalid}
                onChange={handleChange}
                aria-describedby={`${id}-error`}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required={required}
            />
            {ariaInvalid && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <AlertCircle aria-hidden="true" className="h-5 w-5 text-red-500" />
                </div>
            )}
        </div>
        {ariaInvalid && (
            <p id={`${id}-error`} className="error-text text-sm text-red-600 mt-1">
                {errorMessage}
            </p>
        )}
    </div>
);

export default InputField;
