// Styled input field with label and error state
import { forwardRef } from 'react';

const Input = forwardRef(({
  label, error, icon, className = '', type = 'text', ...props
}, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 text-lg">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={`input-field ${icon ? 'pl-11' : ''} ${error ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-900/30' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
