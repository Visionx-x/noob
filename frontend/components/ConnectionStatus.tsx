'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'

interface ConnectionStatus {
  isConnected: boolean
  isChecking: boolean
  lastChecked: Date | null
  error: string | null
}

export function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isChecking: true,
    lastChecked: null,
    error: null
  })

  useEffect(() => {
    checkConnection()
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkConnection = async () => {
    console.log('🔍 CHECKING APP CONNECTION STATUS...')
    setStatus(prev => ({ ...prev, isChecking: true, error: null }))
    
    try {
      // Use the API helper's testConnection method for direct health check
      const isConnected = await api.testConnection()
      setStatus({
        isConnected: isConnected,
        isChecking: false,
        lastChecked: new Date(),
        error: null
      })
      console.log('✅ APP CONNECTION STATUS:', isConnected ? 'CONNECTED' : 'DISCONNECTED')
    } catch (error) {
      setStatus({
        isConnected: false,
        isChecking: false,
        lastChecked: new Date(),
        error: error.message
      })
      console.log('❌ APP CONNECTION STATUS: DISCONNECTED', error)
    }
  }

  // Don't show UI - only log to console for debugging
  return null
}
