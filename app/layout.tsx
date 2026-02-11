import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hive Valentine Proposal - Send Your Love',
  description: 'Create a beautiful, playful Valentine proposal with a custom link. Will they say yes?',
  generator: 'v0.app',
  keywords: ['valentine', 'proposal', 'love', 'romantic'],
  openGraph: {
    title: 'Hive Valentine Proposal',
    description: 'Someone sent you a Valentine they can\'t refuse',
    type: 'website',
    url: 'https://valentine-proposal.vercel.app',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&h=630',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hive Valentine Proposal',
    description: 'Someone sent you a Valentine proposal - will they say yes?',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* Persistent Branding */}
        <div className="fixed top-6 left-6 z-[100] flex items-center gap-3 pointer-events-none select-none mix-blend-plus-lighter">
          <img
            src="/img/logo.png"
            alt="Hive Logo"
            className="h-16 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
          />
          <span
            className="text-yellow-400 text-xl tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            style={{ fontFamily: 'Impact, sans-serif' }}
          >
            HIVE
          </span>
        </div>
        {children}
      </body>
    </html>
  )
}
