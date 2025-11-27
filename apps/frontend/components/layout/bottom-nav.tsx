"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Target, User, BookOpen } from "lucide-react"

const navItems = [
  { href: "/play", label: "Quests", icon: Target },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/about", label: "About", icon: BookOpen },
]

export function BottomNav() {
  const pathname = usePathname()

  // Don't show bottom nav on game pages
  if (pathname.includes("/play/") && pathname !== "/play") {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-ui-border safe-area-pb">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors touch-manipulation ${
                isActive ? "text-brand-primary" : "text-ui-muted hover:text-ui-text active:bg-ui-border/50"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-brand-primary" : ""}`} />
              <span className={`text-xs font-medium ${isActive ? "text-brand-primary" : ""}`}>{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
