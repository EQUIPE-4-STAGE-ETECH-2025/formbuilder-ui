import { clsx } from "clsx";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-100"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={clsx(
            "w-full px-3 py-2 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200",
            error &&
              "border-yellow-500 bg-yellow-900/20 focus:border-yellow-400 focus:ring-yellow-400",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-yellow-400" role="alert">
            {error}
          </p>
        )}
        {helper && !error && (
          <p className="text-sm text-surface-500">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
