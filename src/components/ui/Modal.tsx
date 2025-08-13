import { X } from "lucide-react";
import React from "react";

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<IModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`relative w-full ${sizeClasses[size]} bg-surface-900 rounded-2xl shadow-large border border-surface-800/50`}
        >
          {/* Header - affiché seulement si un titre est fourni */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-surface-700/50">
              <h3 className="text-xl font-semibold text-text-100">{title}</h3>
              <button
                onClick={onClose}
                className="text-surface-400 hover:text-surface-300 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Content */}
          <div className={`${title ? "p-6" : "p-6 pt-6"}`}>
            {/* Bouton de fermeture si pas de titre */}
            {!title && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={onClose}
                  className="text-surface-400 hover:text-surface-300 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
