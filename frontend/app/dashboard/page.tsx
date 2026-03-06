'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, CheckCircle, TrendingUp, Users, LogOut, Activity, Target, Calendar, Trophy, Star, Award, Crown, Settings, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { BackButton } from '@/components/BackButton'

export default function DashboardPage() {
  const [healthStatus, setHealthStatus] = useState<'connected' | 'disconnected'>('disconnected')
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState({
    name: 'User',
    email: 'final@test.com',
    bio: 'Building better habits one day at a time'
  })

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadDashboardData()
    }
  }, [mounted])

  async function loadDashboardData() {
    setIsLoading(true)
    try {
      // Check backend health
      await api.healthCheck()
      setHealthStatus('connected')
      
      // Get current user - this will fail if not authenticated
      const userResponse = await api.getCurrentUser()
      if (userResponse.success && userResponse.data) {
        setUser({
          name: userResponse.data.username || 'User',
          email: userResponse.data.email || 'final@test.com',
          bio: 'Building better habits one day at a time'
        })
      } else {
        // User not authenticated, redirect to login
        router.push('/auth/login')
        return
      }
    } catch (error) {
      console.error('Dashboard data load error:', error)
      setHealthStatus('disconnected')
      // If authentication error, redirect to login
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        router.push('/auth/login')
        return
      }
    }
    
    setIsLoading(false)
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    router.push('/')
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-fintech flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-fintech pb-20">
      {/* Health Status Badge */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`glass-card px-4 py-2 flex items-center space-x-2 ${
          healthStatus === 'connected' ? 'status-success' : 'status-error'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            healthStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="text-caption text-white">
            {healthStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="container-mobile py-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <BackButton fallback="/" />
          <div className="text-center flex-1">
            <h1 className="text-title text-white">Dashboard</h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* User Profile Section */}
        <div className="glass-card glass-card-hover mb-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-button-500 to-accent-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-title text-white">{user.name}</h2>
                <p className="text-body text-white/70">{user.email}</p>
                <p className="text-caption text-white/50 mt-1">{user.bio}</p>
              </div>
            </div>
            <button onClick={logout} className="text-white/70 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">12</div>
            <div className="text-caption text-white/70">Day Streak</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">85%</div>
            <div className="text-caption text-white/70">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
        <div className="container-mobile py-4">
          <div className="grid grid-cols-5 gap-2">
            <Link href="/tasks" className="text-center">
              <div className="nav-link text-white/60">
                <Target className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Tasks</span>
              </div>
            </Link>
            
            <Link href="/dashboard" className="text-center">
              <div className="nav-link text-white">
                <Activity className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Home</span>
              </div>
            </Link>
            
            <Link href="/analytics" className="text-center">
              <div className="nav-link text-white/60">
                <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Progress</span>
              </div>
            </Link>
            
            <Link href="/achievements" className="text-center">
              <div className="nav-link text-white/60">
                <Trophy className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Rewards</span>
              </div>
            </Link>
            
            <Link href="/community" className="text-center">
              <div className="nav-link text-white/60">
                <Users className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Community</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
