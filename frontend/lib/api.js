// API helper for connecting to the backend
import mobileDebugger from './mobile-debugger.js'

// API base URL: set NEXT_PUBLIC_API_URL when building (dev: your PC IP, prod: VPS URL e.g. https://api.yourdomain.com/api)
function getApiBaseUrl() {
  const url =
    (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) ||
    'http://77.90.6.237:8000/api'  // Updated to your VPS IP and correct backend port
  const base = url.replace(/\/+$/, '') // no trailing slash
  if (typeof window !== 'undefined') {
    console.log('Mobile App API Configuration:', { baseURL: base })
  }
  return base
}

const API_BASE_URL = getApiBaseUrl()

class ApiHelper {
  constructor() {
    this.baseURL = getApiBaseUrl()
    this.token = null
    this.loadToken()
    
    // Log initialization for mobile app
    console.log('🚀 MOBILE APP INITIALIZING')
    console.log('📡 API Base URL:', this.baseURL)
    console.log('🔐 Has Token:', !!this.token)
    console.log('📱 Platform:', 'Android Mobile App')
    console.log('🌐 User Agent:', navigator.userAgent)
    
    mobileDebugger.info('Mobile API Helper initialized', {
      baseURL: this.baseURL,
      platform: 'Android Mobile App',
      hasToken: !!this.token,
      userAgent: navigator.userAgent
    })
    
    // Test connection immediately
    this.testConnection()
  }
  
  async testConnection() {
    console.log('🔍 TESTING API CONNECTION...')
    try {
      // Use direct health endpoint without /api prefix since baseURL already includes it
      const healthUrl = this.baseURL.replace('/api', '') + '/health'
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('📡 CONNECTION TEST RESULT:', {
        status: response.status,
        ok: response.ok,
        url: healthUrl
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API CONNECTION SUCCESSFUL:', data)
        mobileDebugger.info('API Connection Test Successful', data)
        return true
      } else {
        console.log('❌ API CONNECTION FAILED:', response.status, response.statusText)
        mobileDebugger.error('API Connection Test Failed', {
          status: response.status,
          statusText: response.statusText
        })
        return false
      }
    } catch (error) {
      console.log('❌ API CONNECTION ERROR:', error)
      mobileDebugger.error('API Connection Test Error', { error: error.message })
      return false
    }
  }

  // Load token from localStorage (mobile compatible)
  loadToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('access_token')
      mobileDebugger.debug('Token loaded from storage', { hasToken: !!this.token })
    }
  }

  // Save token to localStorage (mobile compatible)
  saveToken(token) {
    this.token = token
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('access_token', token)
      mobileDebugger.debug('Token saved to storage', { hasToken: !!token })
    }
  }

  // Clear token from storage
  clearToken() {
    this.token = null
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
    mobileDebugger.logAuthEvent('Token Cleared')
  }

  async request(endpoint, config = {}) {
    const startTime = Date.now()
    const url = `${this.baseURL}${endpoint}`
    
    console.log('🌐 API REQUEST STARTING')
    console.log('📡 URL:', url)
    console.log('🔧 Method:', config.method || 'GET')
    console.log('📋 Config:', config)
    console.log('🔐 Has Token:', !!this.token)
    
    // Set default headers
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    }

    // Add authorization header if token exists
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`
      console.log('🔑 Authorization header added')
    }

    try {
      console.log('📤 SENDING REQUEST...')
      mobileDebugger.debug('Mobile API Request Starting', {
        method: config.method || 'GET',
        url,
        hasAuth: !!this.token,
        headers: config.headers
      })
      
      // Add timeout for mobile
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout for mobile
      config.signal = controller.signal
      
      const response = await fetch(url, config)
      clearTimeout(timeoutId)
      
      console.log('📥 API RESPONSE RECEIVED:')
      console.log('📊 Status:', response.status)
      console.log('✅ OK:', response.ok)
      console.log('🌐 URL:', url)
      console.log('📋 Headers:', Object.fromEntries(response.headers.entries()))
      
      mobileDebugger.debug('API Response Received', {
        status: response.status,
        ok: response.ok,
        duration: Date.now() - startTime,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      if (!response.ok) {
        console.log('❌ RESPONSE NOT OK - THROWING ERROR')
        const errorText = await response.text()
        console.log('📄 Error Response Body:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('📦 API RESPONSE DATA:', data)
      console.log('✅ REQUEST COMPLETED SUCCESSFULLY')
      
      return data
    } catch (error) {
      const duration = Date.now() - startTime
      
      console.log('💥 API REQUEST FAILED:')
      console.log('❌ Error:', error.message)
      console.log('⏱️ Duration:', `${duration}ms`)
      console.log('📡 URL:', url)
      console.log('🔧 Method:', config.method || 'GET')
      
      mobileDebugger.logNetworkError(error, {
        url,
        method: config.method || 'GET',
        duration: `${duration}ms`,
        hasAuth: !!this.token,
        error: error.message
      })
      
      throw error
    }
  }

  // Health check
  async healthCheck() {
    console.log('🔍 HEALTH CHECK STARTING...')
    try {
      // Use /api/health endpoint since this is called through the request method
      const result = await this.request('/health')
      console.log('✅ HEALTH CHECK SUCCESS:', result)
      return result
    } catch (error) {
      console.log('❌ HEALTH CHECK FAILED:', error)
      throw error
    }
  }

  // Authentication methods
  async signup(userData) {
    console.log('🔍 SIGNUP STARTING...', { email: userData.email })
    mobileDebugger.logAuthEvent('Signup Started', { email: userData.email })
    try {
      const response = await this.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      })
      
      // Save tokens on successful signup
      if (response.success && response.data) {
        this.saveToken(response.data.access_token)
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token)
        }
        mobileDebugger.logAuthEvent('Signup Success', { email: userData.email })
      }
      
      console.log('✅ SIGNUP SUCCESS:', response)
      return response
    } catch (error) {
      console.log('❌ SIGNUP FAILED:', error)
      mobileDebugger.logAuthEvent('Signup Failed', { 
        email: userData?.email,
        error: error.message 
      })
      throw error
    }
  }

  async login(userData) {
    console.log('🔍 LOGIN STARTING...', { email: userData.email })
    mobileDebugger.logAuthEvent('Login Started', { email: userData.email })
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(userData),
      })
      
      // Save tokens on successful login
      if (response.success && response.data) {
        this.saveToken(response.data.access_token)
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token)
        }
        mobileDebugger.logAuthEvent('Login Success', { email: userData.email })
      }
      
      console.log('✅ LOGIN SUCCESS:', response)
      return response
    } catch (error) {
      console.log('❌ LOGIN FAILED:', error)
      mobileDebugger.logAuthEvent('Login Failed', { 
        email: userData?.email,
        error: error.message 
      })
      throw error
    }
  }

  async getCurrentUser() {
    console.log('🔍 GET CURRENT USER STARTING...')
    try {
      const result = await this.request('/auth/me')
      console.log('✅ GET CURRENT USER SUCCESS:', result)
      return result
    } catch (error) {
      console.log('❌ GET CURRENT USER FAILED:', error)
      throw error
    }
  }

  async logout() {
    console.log('🔍 LOGOUT STARTING...')
    try {
      await this.request('/auth/logout', { method: 'POST' })
      this.clearToken()
      console.log('✅ LOGOUT SUCCESS')
      mobileDebugger.logAuthEvent('Logout Success')
    } catch (error) {
      console.log('❌ LOGOUT FAILED:', error)
      // Still clear token even if API call fails
      this.clearToken()
      mobileDebugger.logAuthEvent('Logout Failed', { error: error.message })
    }
  }
}

// Create and export singleton instance
const api = new ApiHelper()

// Export the testConnection method for external use
export const testConnection = api.testConnection.bind(api)

export default api
