'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value || ''

    // Keep React state in sync with real input values (handles autofill)
    setFormData({ email, password })

    // Validate form using actual DOM values
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      console.log('🔍 Attempting login with:', { email, password: '***' })
      
      // First test connection
      console.log('📡 Testing API connection before login...')
      const isConnected = await api.testConnection()
      console.log('📡 Connection test result:', isConnected)
      
      if (!isConnected) {
        setError('Cannot connect to server. Please check your internet connection.')
        setIsLoading(false)
        return
      }
      
      console.log('🚀 Calling API login...')
      const response = await api.login({ email, password })
      
      console.log('✅ Login response received:', response)
      
      if (response.success) {
        console.log('🎉 Login successful, redirecting to dashboard')
        router.push('/dashboard')
      } else {
        console.error('❌ Login failed:', response)
        setError(response.error || response.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('❌ Login error caught:', err)
      const msg = (err instanceof Error ? err.message : String(err)) || ''
      console.log('🔍 Error message:', msg)
      
      // Enhanced error handling
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('ERR_NETWORK')) {
        setError('Network error. Please check your internet connection and try again.')
      } else if (msg.includes('401')) {
        setError('Invalid email or password. Please try again.')
      } else if (msg.includes('400') || msg.includes('Invalid')) {
        setError('Invalid request. Please check your input.')
      } else if (msg.includes('500') || msg.includes('Server')) {
        setError('Server error. Please try again later.')
      } else if (msg.includes('CORS')) {
        setError('Connection blocked by browser. Please try again or contact support.')
      } else {
        setError(msg || 'An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-fintech flex items-center justify-center px-4 py-8">
      <div className="container-mobile-sm">
        <div className="text-center mb-8">
          <h1 className="text-headline text-white mb-3">Welcome Back</h1>
          <p className="text-body text-white/70">Sign in to continue your habit journey</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="form-error mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input pl-12"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input pl-12 pr-12"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="glass-button-primary w-full btn-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-body text-white/70">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-gradient font-semibold hover:opacity-80 transition-opacity">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
