import { clsx } from "clsx";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { ToastContext } from "../../contexts/ToastContext";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: "bg-green-900/20 backdrop-blur-sm border-green-700/50 text-green-200",
    error: "bg-red-900/20 backdrop-blur-sm border-red-700/50 text-red-200",
    warning: "bg-yellow-900/20 backdrop-blur-sm border-yellow-700/50 text-yellow-200",
    info: "bg-blue-900/20 backdrop-blur-sm border-blue-700/50 text-blue-200",
  };

  const iconColors = {
    success: "text-green-400",
    error: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400",
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={clsx(
        "flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 max-w-md backdrop-blur-md",
        colors[toast.type],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
    >
      <Icon className={clsx("h-5 w-5 mt-0.5", iconColors[toast.type])} />
      <div className="flex-1">
        <h4 className="font-medium">{toast.title}</h4>
        {toast.message && (
          <p className="mt-1 text-sm opacity-80">{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="ml-2 rounded-full p-1 hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
