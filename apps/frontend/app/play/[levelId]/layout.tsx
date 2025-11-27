import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Playing Quest - IlmQuest",
  description: "Match crypto concepts and earn cUSD rewards.",
}

export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
