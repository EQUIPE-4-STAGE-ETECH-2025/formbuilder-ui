import { clsx } from "clsx";
import { forwardRef } from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "bg-surface-900/50 backdrop-blur-sm border border-surface-700/50 rounded-2xl",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={clsx("border-b border-surface-800 px-6 py-6", className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return <div className={clsx("px-6 py-6", className)}>{children}</div>;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={clsx("border-t border-surface-800 px-6 py-6", className)}>
      {children}
    </div>
  );
}
