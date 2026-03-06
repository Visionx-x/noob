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
      const result = await api.healthCheck()
      setStatus({
        isConnected: true,
        isChecking: false,
        lastChecked: new Date(),
        error: null
      })
      console.log('✅ APP CONNECTION STATUS: CONNECTED')
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

  // Only show in development or when there's an issue
  if (status.isConnected && !status.isChecking && !status.error) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white p-2 text-center">
      <div className="container-mobile">
        {status.isChecking ? (
          <span>🔄 Checking connection...</span>
        ) : status.error ? (
          <div>
            <span>❌ Connection Error: {status.error}</span>
            <button 
              onClick={checkConnection}
              className="ml-2 underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <span>✅ Connected</span>
        )}
      </div>
    </div>
  )
}
