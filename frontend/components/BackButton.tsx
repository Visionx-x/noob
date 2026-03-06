'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

interface BackButtonProps {
  fallback?: string
  className?: string
  showOnDesktop?: boolean
}

export function BackButton({ 
  fallback = '/', 
  className = '', 
  showOnDesktop = false 
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = async () => {
    // Only handle app exit on native platforms
    if (Capacitor.isNativePlatform()) {
      const currentPath = window.location.pathname
      
      // If we're on the home page, show exit confirmation
      if (currentPath === '/') {
        const shouldExit = window.confirm('Are you sure you want to exit GrowthForge?')
        if (shouldExit) {
          await App.exitApp()
        }
        return
      }
    }

    // For web or other pages, navigate back or to fallback
    if (window.history.length > 1) {
      window.history.back()
    } else {
      router.push(fallback)
    }
  }

  // Don't show on desktop unless explicitly requested
  if (!Capacitor.isNativePlatform() && !showOnDesktop) {
    return null
  }

  return (
    <button
      onClick={handleBack}
      className={`p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5 text-white" />
    </button>
  )
}

// Hook for pages to add custom back button behavior
export function useCustomBackButton(
  customHandler: () => void | Promise<void>,
  deps: any[] = []
) {
  const router = useRouter()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return
    }

    const handleBackButton = async () => {
      await customHandler()
    }

    const setupListener = async () => {
      const listener = await App.addListener('backButton', handleBackButton)
      return listener
    }

    let listener: any = null

    setupListener().then((l) => {
      listener = l
    })

    return () => {
      if (listener) {
        listener.remove()
      }
    }
  }, deps)
}
