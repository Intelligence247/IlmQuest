"use client"

import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react"
import { X, Check, AlertCircle, Info } from "lucide-react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface IlmToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const IlmToastContext = createContext<IlmToastContextType | undefined>(undefined)

export function IlmToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <IlmToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <IlmToastItem key={toast.id} toast={toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </div>
    </IlmToastContext.Provider>
  )
}

function IlmToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const bgColors = {
    success: "bg-brand-secondary",
    error: "bg-destructive",
    info: "bg-ui-text",
  }

  const icons = {
    success: <Check className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
    info: <Info className="w-4 h-4" />,
  }

  return (
    <div className={`${bgColors[toast.type]} text-white rounded-xl shadow-lg p-3 flex items-center gap-3 animate-pop`}>
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="p-1 hover:bg-white/20 rounded-full transition-colors touch-manipulation"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function useIlmToast() {
  const context = useContext(IlmToastContext)
  if (context === undefined) {
    throw new Error("useIlmToast must be used within an IlmToastProvider")
  }
  return context
}
