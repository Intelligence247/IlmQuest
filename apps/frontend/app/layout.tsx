import type React from "react"
import type { Metadata, Viewport } from "next"
import { Outfit, Inter } from "next/font/google"
import { WalletProvider } from "@/lib/wallet-context"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "IlmQuest - Learn Crypto. Earn Crypto.",
  description:
    "A mobile-first Learn-to-Earn dApp. Play memory games about financial literacy and earn cUSD rewards on the Celo network.",
  generator: "IlmQuest",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/icon-dark-32x32.jpg",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#047857",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable} font-sans antialiased`}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}
