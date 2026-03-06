import '../styles/globals.css'
import Head from 'next/head'
import { BackButtonHandler } from '@/hooks/useBackButton'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <title>GrowthForge - Habit Tracking & Achievement System</title>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
        <BackButtonHandler>
          {children}
        </BackButtonHandler>
      </body>
    </html>
  )
}
