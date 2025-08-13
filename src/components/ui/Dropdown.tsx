import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface IDropdownOption {
  value: string;
  label: string;
}

interface IDropdownProps {
  value?: string;
  options?: IDropdownOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  // Nouvelles props pour les dropdowns d'actions
  variant?: "select" | "actions";
  actions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "danger";
  }>;
  trigger?: React.ReactNode;
}

export function Dropdown({
  value,
  options = [],
  onChange,
  placeholder = "Sélectionner une option",
  className = "",
  disabled = false,
  size = "md",
  icon,
  variant = "select",
  actions = [],
  trigger,
}: IDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-4 py-3 text-sm",
  };

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const updatePosition = useCallback(() => {
    if (variant === "select" && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 12, // 12px de marge
        left: rect.left,
        width: rect.width,
      });
    } else if (variant === "actions" && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8, // 8px de marge
        left: rect.right - 192, // 192px = largeur du dropdown
        width: 192,
      });
    }
  }, [variant]);

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        updatePosition();
      }
      setIsOpen(!isOpen);
    }
  };

  // Mise à jour de la position lors du scroll ou du redimensionnement
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen, updatePosition]);

  // Fermeture du dropdown lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (variant === "select" &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)) ||
        (variant === "actions" &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node))
      ) {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [variant]);

  const handleActionClick = (action: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "danger";
  }) => {
    action.onClick();
    setIsOpen(false);
  };

  // Rendu du bouton trigger pour les dropdowns de sélection
  if (variant === "select") {
    return (
      <>
        <div className={`relative ${className}`}>
          <button
            ref={buttonRef}
            type="button"
            onClick={handleToggle}
            disabled={disabled}
            className={`flex items-center justify-between w-full border border-surface-800 rounded-2xl bg-surface-900 text-text-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200 ${
              sizeClasses[size]
            } ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-surface-700 hover:bg-surface-800 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-2">
              {icon && <span className="text-surface-500">{icon}</span>}
              <span
                className={
                  selectedOption ? "text-text-100" : "text-surface-500"
                }
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-surface-500 transition-transform duration-200 ml-2 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Dropdown via portail */}
        {isOpen &&
          !disabled &&
          createPortal(
            <div
              ref={dropdownRef}
              className="fixed bg-surface-900 border border-surface-700/50 rounded-2xl shadow-large z-[9999] overflow-hidden animate-scale-in"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                minWidth: "160px",
              }}
            >
              <div className="py-2 px-1.5">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors duration-200 rounded-xl ${
                      value === option.value
                        ? "bg-accent-500/10 text-accent-400"
                        : "text-surface-300 hover:bg-surface-800"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )}
      </>
    );
  }

  // Rendu pour les dropdowns d'actions
  return (
    <>
      <div className={`relative ${className}`} ref={triggerRef}>
        <div onClick={handleToggle}>{trigger}</div>
      </div>

      {/* Dropdown via portail */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-surface-900 border border-surface-700/50 rounded-2xl shadow-large z-[9999] overflow-hidden animate-scale-in"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
          >
            <div className="py-2 px-1.5">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  className={`flex items-center w-full px-4 py-3 text-sm transition-colors duration-200 rounded-xl ${
                    action.variant === "danger"
                      ? "text-yellow-400 hover:bg-yellow-900/20"
                      : "text-surface-300 hover:bg-surface-800"
                  }`}
                >
                  <span className="mr-3">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
