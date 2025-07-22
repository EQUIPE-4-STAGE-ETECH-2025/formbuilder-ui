import { clsx } from 'clsx';
import { forwardRef } from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children }, ref) => {
    return (
      <div 
        ref={ref}
        className={clsx('rounded-lg border border-gray-200 bg-white shadow-sm', className)}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={clsx('border-b border-gray-200 px-6 py-4', className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return (
    <div className={clsx('px-6 py-4', className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={clsx('border-t border-gray-200 px-6 py-4', className)}>
      {children}
    </div>
  );
}