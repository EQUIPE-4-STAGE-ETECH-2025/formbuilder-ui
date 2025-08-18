import React, { forwardRef } from "react";

interface IProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export const Toggle = forwardRef<HTMLDivElement, IProps>(
  (
    { checked, onChange, disabled = false, label, description, className = "" },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div className={`flex items-center justify-between ${className}`}>
        {(label || description) && (
          <div>
            {label && <p className="font-medium text-text-100">{label}</p>}
            {description && (
              <p className="text-sm text-surface-400">{description}</p>
            )}
          </div>
        )}
        <div
          ref={ref}
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-accent-500/20 ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          } ${checked ? "bg-accent-500" : "bg-surface-700"}`}
        >
          <div
            className={`absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-transform duration-200 ease-in-out ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    );
  }
);

Toggle.displayName = "Toggle";
