'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'

export function useBackButtonHandler() {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    // Only add back button listener on mobile devices
    if (!Capacitor.isNativePlatform()) {
      return
    }

    const handleBackButton = async () => {
      console.log('Back button pressed')
      
      // Get current path
      const currentPath = window.location.pathname
      
      // Define routes that should exit the app when back is pressed
      const exitRoutes = ['/']
      
      // Define routes that should go to home when back is pressed
      const homeRoutes = ['/dashboard', '/tasks', '/analytics', '/achievements', '/community']
      
      if (exitRoutes.includes(currentPath)) {
        // Show confirmation dialog before exiting
        const shouldExit = await showExitConfirmation()
        if (shouldExit) {
          await App.exitApp()
        }
      } else if (homeRoutes.includes(currentPath)) {
        // Go to home page
        router.push('/')
      } else if (currentPath.startsWith('/auth/')) {
        // From auth pages, go to home
        router.push('/')
      } else {
        // Try to go back in history
        if (window.history.length > 1) {
          window.history.back()
        } else {
          // If no history, go to home
          router.push('/')
        }
      }
    }

    const showExitConfirmation = async (): Promise<boolean> => {
      return new Promise((resolve) => {
        // Create a simple confirmation dialog
        const confirmed = window.confirm('Are you sure you want to exit GrowthForge?')
        resolve(confirmed)
      })
    }

    // Check if we can go back
    const checkCanGoBack = () => {
      const currentPath = window.location.pathname
      setCanGoBack(window.history.length > 1 && !['/'].includes(currentPath))
    }

    // Add back button listener
    const setupListener = async () => {
      const listener = await App.addListener('backButton', handleBackButton)
      return listener
    }

    let listener: any = null

    setupListener().then((l) => {
      listener = l
    })

    // Listen for route changes
    checkCanGoBack()
    window.addEventListener('popstate', checkCanGoBack)

    // Cleanup
    return () => {
      if (listener) {
        listener.remove()
      }
      window.removeEventListener('popstate', checkCanGoBack)
    }
  }, [router])

  return { canGoBack }
}

// Hook for handling app minimize/background
export function useAppState() {
  const [isInBackground, setIsInBackground] = useState(false)

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return
    }

    const handleAppStateChange = (state: { isActive: boolean }) => {
      setIsInBackground(!state.isActive)
      console.log('App state changed:', state.isActive ? 'active' : 'background')
      
      // You can add logic here for when app goes to background/foreground
      if (!state.isActive) {
        // App went to background
        // Save any unsaved data, pause timers, etc.
        console.log('App went to background')
      } else {
        // App came to foreground
        // Refresh data, resume timers, etc.
        console.log('App came to foreground')
      }
    }

    const setupListener = async () => {
      const listener = await App.addListener('appStateChange', handleAppStateChange)
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
  }, [])

  return { isInBackground }
}

// Component to handle back button globally
export function BackButtonHandler({ children }: { children: React.ReactNode }) {
  useBackButtonHandler()
  useAppState()
  
  return <>{children}</>
}
