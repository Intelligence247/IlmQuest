"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  href?: string
  className?: string
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
}

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
}

export function Logo({ size = "md", showText = true, href, className }: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon className={cn(sizeClasses[size])} />
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-heading font-bold text-brand-primary leading-tight", textSizeClasses[size])}>
            IlmQuest
          </span>
          {size === "lg" || size === "xl" ? (
            <span className="text-xs text-ui-muted font-medium">Learn Crypto. Earn Crypto.</span>
          ) : null}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    )
  }

  return content
}

// Professional IlmQuest Logo - Book with knowledge light and golden star
export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-10 h-10", className)}>
      <defs>
        {/* Main emerald gradient */}
        <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#065F46" />
        </linearGradient>

        {/* Gold gradient for accents */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Light glow gradient */}
        <radialGradient id="glowGrad" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
        </radialGradient>

        {/* Shadow */}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#065F46" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="url(#emeraldGrad)" />

      {/* Inner ring */}
      <circle cx="60" cy="60" r="50" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.3" />

      {/* Knowledge glow from book */}
      <ellipse cx="60" cy="45" rx="20" ry="15" fill="url(#glowGrad)" />

      {/* Open Book - Left Page */}
      <path
        d="M60 38 L60 88 C60 88 45 85 28 88 L28 42 C45 39 60 38 60 38Z"
        fill="white"
        opacity="0.95"
        filter="url(#shadow)"
      />

      {/* Open Book - Right Page */}
      <path
        d="M60 38 L60 88 C60 88 75 85 92 88 L92 42 C75 39 60 38 60 38Z"
        fill="white"
        opacity="0.9"
        filter="url(#shadow)"
      />

      {/* Book spine shadow */}
      <path d="M58 40 L58 86" stroke="#E2E8F0" strokeWidth="2" opacity="0.5" />
      <path d="M62 40 L62 86" stroke="#E2E8F0" strokeWidth="1" opacity="0.3" />

      {/* Text lines on left page */}
      <line x1="34" y1="50" x2="54" y2="50" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="58" x2="50" y2="58" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="66" x2="52" y2="66" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="34" y1="74" x2="48" y2="74" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

      {/* Text lines on right page */}
      <line x1="66" y1="50" x2="86" y2="50" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="58" x2="82" y2="58" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="66" x2="84" y2="66" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="74" x2="80" y2="74" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />

      {/* Golden Star - Quest reward symbol */}
      <path
        d="M60 18 L63 27 L73 27 L65 33 L68 43 L60 37 L52 43 L55 33 L47 27 L57 27 Z"
        fill="url(#goldGrad)"
        filter="url(#shadow)"
      />

      {/* Small decorative stars */}
      <circle cx="30" cy="28" r="2.5" fill="url(#goldGrad)" opacity="0.7" />
      <circle cx="90" cy="28" r="2" fill="url(#goldGrad)" opacity="0.5" />
      <circle cx="22" cy="50" r="1.5" fill="url(#goldGrad)" opacity="0.4" />
      <circle cx="98" cy="50" r="1.5" fill="url(#goldGrad)" opacity="0.4" />
    </svg>
  )
}

// Simplified favicon version
export function LogoFavicon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-8 h-8", className)}>
      <defs>
        <linearGradient id="favEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="favGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#favEmerald)" />

      {/* Simplified book */}
      <path d="M16 10 L16 24 C16 24 12 23 8 24 L8 11 C12 10 16 10 16 10Z" fill="white" opacity="0.95" />
      <path d="M16 10 L16 24 C16 24 20 23 24 24 L24 11 C20 10 16 10 16 10Z" fill="white" opacity="0.9" />

      {/* Star */}
      <path d="M16 5 L17 8 L20 8 L17.5 10 L18.5 13 L16 11 L13.5 13 L14.5 10 L12 8 L15 8 Z" fill="url(#favGold)" />
    </svg>
  )
}
