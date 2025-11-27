"use client"

import { AlertTriangle, XCircle, Clock } from "lucide-react"

type ErrorType = "not-minipay" | "transaction-failed" | "rate-limited"

interface ErrorModalProps {
  type: ErrorType
  onDismiss: () => void
  countdown?: number
}

export function ErrorModal({ type, onDismiss, countdown }: ErrorModalProps) {
  const configs = {
    "not-minipay": {
      icon: <AlertTriangle className="w-8 h-8 text-brand-accent" />,
      bgColor: "bg-brand-accent/20",
      heading: "Open in MiniPay",
      body: "IlmQuest works best inside the MiniPay app. Please open this link in MiniPay to continue.",
      buttonText: "Got it",
    },
    "transaction-failed": {
      icon: <XCircle className="w-8 h-8 text-destructive" />,
      bgColor: "bg-destructive/20",
      heading: "Transaction Failed",
      body: "Something went wrong. Please try again.",
      buttonText: "Retry",
    },
    "rate-limited": {
      icon: <Clock className="w-8 h-8 text-brand-accent" />,
      bgColor: "bg-brand-accent/20",
      heading: "Take a Break!",
      body: `You can play this quest again in ${countdown || 10} minutes.`,
      buttonText: "Explore Other Quests",
    },
  }

  const config = configs[type]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-xl animate-slide-up">
        <div className="p-6">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center`}>
              {config.icon}
            </div>
          </div>

          {/* Heading */}
          <h2 className="font-heading font-bold text-xl text-ui-text text-center mb-2">{config.heading}</h2>

          {/* Body */}
          <p className="text-base text-ui-muted leading-relaxed text-center mb-6">{config.body}</p>

          {/* Countdown display for rate-limited */}
          {type === "rate-limited" && countdown && (
            <div className="text-center mb-6">
              <span className="font-heading font-bold text-3xl text-brand-primary">
                {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onDismiss}
            className="w-full min-h-[44px] px-6 py-3 bg-brand-primary text-white font-heading font-semibold text-lg rounded-full shadow-md hover:bg-brand-primary/90 active:scale-[0.98] transition-all duration-200 touch-manipulation"
          >
            {config.buttonText}
          </button>
        </div>

        {/* Safe area padding for iOS */}
        <div className="h-safe-area-inset-bottom bg-white" />
      </div>
    </div>
  )
}
