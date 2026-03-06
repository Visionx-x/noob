'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Target, TrendingUp, Users, ArrowRight } from 'lucide-react'
import api from '@/lib/api'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in, redirect to dashboard
    const checkAuth = async () => {
      try {
        const response = await api.getCurrentUser()
        if (response.success) {
          router.push('/dashboard')
        }
      } catch (error) {
        // User not logged in, stay on home page
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-fintech">
      <div className="container-mobile py-10">
        {/* Mobile Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
            <div className="text-4xl font-bold text-gradient">GF</div>
          </div>
          <h1 className="text-display text-white mb-4">
            GrowthForge
          </h1>
          <p className="text-body-lg text-white/80 mb-8 max-w-sm mx-auto">
            Transform your life through consistent habits and intelligent progress tracking
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-4 mb-16">
          <button 
            onClick={() => router.push('/auth/signup')}
            className="glass-button-primary w-full btn-lg group text-center"
          >
            <span className="flex items-center justify-center space-x-3">
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={() => router.push('/auth/login')}
            className="glass-button-secondary w-full btn-lg text-center"
          >
            Welcome Back
          </button>
        </div>

        {/* Three Main Features */}
        <div className="grid grid-cols-1 gap-4 mb-10">
          <div className="glass-card glass-card-hover p-4 text-center group cursor-pointer" onClick={() => router.push('/tasks')}>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent-500/20 to-button-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="text-title text-white mb-2">Daily Habits</h3>
            <p className="text-body text-white/70 text-sm leading-relaxed">
              Build consistency with smart tracking and personalized reminders
            </p>
          </div>
          
          <div className="glass-card glass-card-hover p-4 text-center group cursor-pointer" onClick={() => router.push('/analytics')}>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-button-500/20 to-accent-400/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-8 h-8 text-button-400" />
            </div>
            <h3 className="text-title text-white mb-2">Progress Analytics</h3>
            <p className="text-body text-white/70 text-sm leading-relaxed">
              Visual insights, growth charts, and predictive analytics
            </p>
          </div>
          
          <div className="glass-card glass-card-hover p-4 text-center group cursor-pointer" onClick={() => router.push('/community')}>
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-title text-white mb-2">Community</h3>
            <p className="text-body text-white/70 text-sm leading-relaxed">
              Connect with like-minded individuals and achieve together
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Private</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Free Forever</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
