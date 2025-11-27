import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quest Dashboard - IlmQuest",
  description: "Select a quest deck and start earning cUSD by learning crypto concepts.",
}

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
