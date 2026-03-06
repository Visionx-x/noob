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
    mobileDebugger.info('Mobile API Helper initialized', {
      baseURL: this.baseURL,
      platform: 'Android Mobile App',
      hasToken: !!this.token
    })
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
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('access_token', token)
      this.token = token
      mobileDebugger.logAuthEvent('Token Saved', { tokenLength: token.length })
    }
  }

  // Clear token
  clearToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      this.token = null
      mobileDebugger.logAuthEvent('Token Cleared')
    }
  }

  async request(endpoint, options = {}) {
    const startTime = Date.now()
    const url = `${this.baseURL}${endpoint}`
    
    console.log('Mobile API Request:', {
      method: options.method || 'GET',
      url,
      hasToken: !!this.token
    })
    
    // Mobile app request configuration
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      ...options,
    }

    // Add authorization header if token exists
    if (this.token) {
      config.headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      mobileDebugger.debug('Mobile API Request Starting', {
        method: config.method || 'GET',
        url,
        hasAuth: !!this.token
      })
      
      // Add timeout for mobile
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15s timeout for mobile
      config.signal = controller.signal
      
      const response = await fetch(url, config)
      clearTimeout(timeoutId)
      
      console.log('Mobile API Response:', {
        status: response.status,
        ok: response.ok,
        url
      })
      
      mobileDebugger.debug('API Response Received', {
        status: response.status,
        ok: response.ok,
        duration: Date.now() - startTime
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Mobile API Data:', data)
      
      return data
    } catch (error) {
      const duration = Date.now() - startTime
      
      mobileDebugger.logNetworkError(error, {
        url,
        method: config.method || 'GET',
        duration: `${duration}ms`,
        hasAuth: !!this.token
      })
      
      // Enhanced error logging for mobile debugging
      if (typeof window !== 'undefined') {
        const errMsg = (error && error.message) || ''
        // Show user-friendly error message
        if (error.name === 'AbortError') {
          mobileDebugger.warn('Request timed out', { url, duration: `${duration}ms` })
          console.error('Request timed out. Please check your connection.')
        } else if (errMsg.includes('Failed to fetch')) {
          mobileDebugger.warn('Network error', { url, duration: `${duration}ms` })
          console.error('Network error. Please check your internet connection.')
        }
      }
      
      throw error
    }
  }

  // Health check (uses /api/health to match baseURL)
  async healthCheck() {
    try {
      const result = await this.request('/health')
      mobileDebugger.info('Health check successful', result)
      return result
    } catch (error) {
      mobileDebugger.error('Health check failed', error)
      throw error
    }
  }

  // Users
  async getUsers() {
    return this.request('/auth/users')
  }

  async createUser(userData) {
    mobileDebugger.logAuthEvent('User Creation Started', { email: userData.email })
    try {
      const result = await this.request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      })
      mobileDebugger.logAuthEvent('User Creation Success', { success: result.success })
      return result
    } catch (error) {
      mobileDebugger.logAuthEvent('User Creation Failed', { error: error.message })
      throw error
    }
  }

  // Auth endpoints
  async login(credentials) {
    mobileDebugger.logAuthEvent('Login Started', { email: credentials.email })
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      
      // Save tokens on successful login
      if (response.success && response.data) {
        this.saveToken(response.data.access_token)
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token)
        }
        mobileDebugger.logAuthEvent('Login Success', { email: credentials.email })
      }
      
      return response
    } catch (error) {
      mobileDebugger.logAuthEvent('Login Failed', { 
        email: credentials.email, 
        error: error.message 
      })
      throw error
    }
  }

  async signup(userData) {
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
      
      return response
    } catch (error) {
      mobileDebugger.logAuthEvent('Signup Failed', { 
        email: userData?.email,
        error: error.message 
      })
      throw error
    }
  }

  async getCurrentUser() {
    try {
      const result = await this.request('/auth/me')
      mobileDebugger.debug('Current user retrieved', { hasData: !!result.data })
      return result
    } catch (error) {
      mobileDebugger.error('Failed to get current user', error)
      throw error
    }
  }

  // Logout method
  async logout() {
    mobileDebugger.logAuthEvent('Logout Started')
    this.clearToken()
    mobileDebugger.logAuthEvent('Logout Success')
    return { success: true, message: 'Logged out successfully' }
  }
}

export default new ApiHelper()
