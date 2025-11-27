"use client"

import { Check } from "lucide-react"

interface KnowledgeModalProps {
  fact: string
  onDismiss: () => void
}

export function KnowledgeModal({ fact, onDismiss }: KnowledgeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={onDismiss} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-xl animate-slide-up">
        <div className="p-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-brand-secondary/20 flex items-center justify-center animate-pop">
              <div className="w-12 h-12 rounded-full bg-brand-secondary flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="font-heading font-bold text-2xl text-brand-primary text-center mb-4">Correct!</h2>

          {/* Knowledge Fact */}
          <p className="text-base text-ui-text leading-relaxed text-center mb-6">{fact}</p>

          {/* Dismiss Button */}
          <button
            onClick={onDismiss}
            className="w-full min-h-[44px] px-6 py-3 bg-brand-primary text-white font-heading font-semibold text-lg rounded-full shadow-md hover:bg-brand-primary/90 active:scale-[0.98] transition-all duration-200 touch-manipulation"
          >
            I Understand
          </button>
        </div>

        {/* Safe area padding for iOS */}
        <div className="h-safe-area-inset-bottom bg-white" />
      </div>
    </div>
  )
}
