// Mobile debugging utilities for GrowthForge
class MobileDebugger {
  constructor() {
    this.isAndroid = typeof window !== 'undefined' && /android/i.test(navigator.userAgent)
    this.isCapacitor = typeof window !== 'undefined' && !!window.Capacitor
  }

  // Enhanced logging with mobile support
  log(level, message, data = null) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      platform: this.getPlatform(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : 'server'
    }

    // Console logging (only if window exists)
    if (typeof window !== 'undefined') {
      console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || '')
    }

    // Android logcat logging
    if (this.isAndroid && window.AndroidInterface) {
      try {
        window.AndroidInterface.log(`${level.toUpperCase()}: ${message}`)
        if (data) {
          window.AndroidInterface.log(`Data: ${JSON.stringify(data)}`)
        }
      } catch (e) {
        if (typeof window !== 'undefined') {
          console.error('Failed to log to Android:', e)
        }
      }
    }

    // Capacitor plugin logging
    if (this.isCapacitor && window.Capacitor.Plugins) {
      // Store logs locally for debugging
      this.storeLog(logEntry)
    }

    // Send to backend for debugging (in development and only on client)
    if (
      typeof window !== 'undefined' &&
      typeof process !== 'undefined' &&
      process.env &&
      process.env.NODE_ENV === 'development'
    ) {
      this.sendLogToBackend(logEntry)
    }
  }

  getPlatform() {
    if (typeof window === 'undefined') {
      return 'server'
    } else if (this.isCapacitor) {
      return 'capacitor'
    } else if (this.isAndroid) {
      return 'android-webview'
    } else {
      return 'web'
    }
  }

  // Store logs in localStorage for debugging (only on client)
  storeLog(logEntry) {
    if (typeof window === 'undefined') return
    
    try {
      const logs = JSON.parse(localStorage.getItem('growthforge_logs') || '[]')
      logs.push(logEntry)
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.shift()
      }
      localStorage.setItem('growthforge_logs', JSON.stringify(logs))
    } catch (e) {
      if (typeof window !== 'undefined') {
        console.error('Failed to store log:', e)
      }
    }
  }

  // Send logs to backend for debugging (only on client)
  async sendLogToBackend(logEntry) {
    if (typeof window === 'undefined') return
    
    try {
      await fetch('/api/debug/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      })
    } catch (e) {
      // Don't log errors about failed logging to avoid infinite loops
    }
  }

  // Convenience methods
  info(message, data) { this.log('info', message, data) }
  warn(message, data) { this.log('warn', message, data) }
  error(message, data) { this.log('error', message, data) }
  debug(message, data) { this.log('debug', message, data) }

  // Get stored logs (only on client)
  getStoredLogs() {
    if (typeof window === 'undefined') return []
    
    try {
      return JSON.parse(localStorage.getItem('growthforge_logs') || '[]')
    } catch (e) {
      return []
    }
  }

  // Clear stored logs (only on client)
  clearLogs() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('growthforge_logs')
    }
  }

  // Network error logging
  logNetworkError(error, context = {}) {
    this.error('Network Error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
  }

  // API request logging
  logApiRequest(method, url, status, duration, error = null) {
    const logData = {
      method,
      url,
      status,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    }

    if (error) {
      logData.error = error.message
      this.error('API Request Failed', logData)
    } else {
      this.info('API Request Success', logData)
    }
  }

  // Authentication logging
  logAuthEvent(event, details = {}) {
    this.info(`Auth Event: ${event}`, {
      event,
      ...details,
      timestamp: new Date().toISOString()
    })
  }

  // Performance logging
  logPerformance(metric, value, details = {}) {
    this.info(`Performance: ${metric}`, {
      metric,
      value,
      ...details,
      timestamp: new Date().toISOString()
    })
  }
}

// Create global instance only on client side
let mobileDebugger

if (typeof window !== 'undefined') {
  mobileDebugger = new MobileDebugger()
  window.mobileDebugger = mobileDebugger
} else {
  // Server-side fallback
  mobileDebugger = {
    info: () => {},
    warn: () => {},
    error: () => {},
    debug: () => {},
    logAuthEvent: () => {},
    logApiRequest: () => {},
    logNetworkError: () => {},
    logPerformance: () => {},
    getStoredLogs: () => [],
    clearLogs: () => {},
    getPlatform: () => 'server'
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = mobileDebugger
}

export default mobileDebugger
