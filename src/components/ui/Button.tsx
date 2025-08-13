import { clsx } from "clsx";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "outline",
      size = "md",
      loading,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-[0.98]";

    const variants = {
      primary:
        "border border-surface-700/50 bg-surface-900 text-surface-300 hover:bg-surface-800 focus:ring-surface-800",
      secondary:
        "border border-surface-600/50 bg-surface-800 text-surface-200 hover:bg-surface-700 hover:backdrop-blur-sm focus:ring-surface-600",
      accent:
        "border border-[#FACC15] bg-[#FACC15] text-black hover:bg-[#eab308] focus:ring-[#FACC15]",
      outline:
        "border border-surface-700/50 bg-surface-800 text-surface-300 hover:bg-surface-700 hover:backdrop-blur-sm focus:ring-surface-700",
      ghost:
        "text-surface-400 hover:bg-surface-800/30 hover:backdrop-blur-sm focus:ring-surface-800",
      danger:
        "border border-yellow-600 bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-600",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
