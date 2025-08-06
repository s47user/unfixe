import React, { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

// Extend InputProps to include textarea-specific attributes
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  textarea?: boolean; // New prop to render as textarea
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
  label,
  error,
  helper,
  className = '',
  textarea = false, // Default to false
  ...props
}, ref) => {
  const baseClasses = 'form-input';
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : '';
  const combinedClasses = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>} // Cast ref for textarea
          className={`${combinedClasses} resize-y`} // Add resize-y for vertical resizing
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)} // Cast props for textarea
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>} // Cast ref for input
          className={combinedClasses}
          {...props}
        />
      )}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      {helper && !error && (
        <p className="text-sm text-gray-500 mt-1">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';