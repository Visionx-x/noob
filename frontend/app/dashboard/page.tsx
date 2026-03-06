'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, CheckCircle, TrendingUp, Users, LogOut, Activity, Target, Calendar, Trophy, Star, Award, Crown, Settings, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { BackButton } from '@/components/BackButton'

export default function DashboardPage() {
  const [healthStatus, setHealthStatus] = useState<'connected' | 'disconnected'>('disconnected')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [completedToday] = useState(8)
  const [totalHabits] = useState(24)
  const [currentStreak] = useState(12)
  const [mounted, setMounted] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'User',
    email: 'final@test.com',
    bio: 'Building better habits one day at a time'
  })

  // Updated weekly progress data
  const weeklyData = [
    { day: 'Mon', percentage: 12 },
    { day: 'Tue', percentage: 93 },
    { day: 'Wed', percentage: 91 },
    { day: 'Thu', percentage: 42 },
    { day: 'Fri', percentage: 77 },
    { day: 'Sat', percentage: 97 },
    { day: 'Sun', percentage: 78 }
  ]

  // User achievements data
  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first habit", icon: Target, progress: 100, total: 1, xp: 50, unlocked: true },
    { id: 2, title: "Week Warrior", description: "Complete habits for 7 days straight", icon: Trophy, progress: 5, total: 7, xp: 200, unlocked: false },
    { id: 3, title: "Habit Master", description: "Maintain a 30-day streak", icon: Star, progress: 12, total: 30, xp: 500, unlocked: false },
    { id: 4, title: "Consistency King", description: "Complete all habits for a week", icon: Award, progress: 3, total: 7, xp: 300, unlocked: false }
  ]

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
    } catch (error) {
      setHealthStatus('disconnected')
    }

    // Fetch users
    try {
      const usersData = await api.getUsers()
      if (usersData.success) {
        setUsers(usersData.data.users || [])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
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

  const saveProfile = () => {
    setIsEditingProfile(false)
    // Here you would typically save to backend
    console.log('Profile saved:', profileData)
  }

  if (!mounted) {
    return null
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
              <div className="w-16 h-16 bg-gradient-to-br from-button-500 to-accent-400 rounded-full flex items-center justify-center relative">
                <span className="text-white font-bold text-xl">U</span>
                <button 
                  className="absolute bottom-0 right-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit className="w-3 h-3 text-white" />
                </button>
              </div>
              <div>
                {isEditingProfile ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="glass-input text-sm"
                      placeholder="Your name"
                    />
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="glass-input text-sm min-h-[60px]"
                      placeholder="Your bio"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={saveProfile}
                        className="glass-button-primary text-xs px-3 py-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="glass-button-secondary text-xs px-3 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-title text-white">{profileData.name}</h2>
                    <p className="text-body text-white/70">{profileData.email}</p>
                    <p className="text-caption text-white/50 mt-1">{profileData.bio}</p>
                  </>
                )}
              </div>
            </div>
            <button onClick={logout} className="text-white/70 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="glass-card p-6 mb-8">
          <h3 className="text-title text-white mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 2).map((achievement, index) => {
              const Icon = achievement.icon
              const isUnlocked = achievement.unlocked
              
              return (
                <div
                  key={achievement.id}
                  className={`glass-card glass-card-hover p-4 ${
                    isUnlocked ? '' : 'opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      isUnlocked ? 'bg-accent-500/20' : 'bg-white/10'
                    }`}>
                      <Icon className={`w-5 h-5 ${isUnlocked ? 'text-accent-400' : 'text-white/40'}`} />
                    </div>
                    <div className="text-right">
                      <p className={`text-caption font-semibold ${
                        isUnlocked ? 'text-accent-400' : 'text-white/50'
                      }`}>
                        +{achievement.xp} XP
                      </p>
                    </div>
                  </div>
                  
                  <h4 className={`text-body font-semibold mb-1 ${
                    isUnlocked ? 'text-white' : 'text-white/70'
                  }`}>
                    {achievement.title}
                  </h4>
                  
                  <p className={`text-caption mb-2 ${
                    isUnlocked ? 'text-white/70' : 'text-white/50'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-1 rounded-full transition-all duration-1000 ${
                        isUnlocked ? 'bg-accent-400' : 'bg-white/30'
                      }`}
                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation with 5 buttons */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
        <div className="container-mobile py-4">
          <div className="grid grid-cols-5 gap-2">
            {/* Task Management Button */}
            <Link href="/tasks" className="text-center">
              <div className="nav-link text-white/60">
                <Settings className="w-5 h-5 mx-auto mb-1" />
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
                <CheckCircle className="w-5 h-5 mx-auto mb-1" />
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
