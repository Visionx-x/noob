'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trophy, Star, Target, Award, Activity, TrendingUp, CheckCircle, Users, Settings } from 'lucide-react'
import api from '@/lib/api'

export default function AchievementsPage() {
  const [achievements] = useState([
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first habit",
      icon: Target,
      progress: 100,
      total: 1,
      xp: 50,
      unlocked: true
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Complete habits for 7 days straight",
      icon: Trophy,
      progress: 5,
      total: 7,
      xp: 200,
      unlocked: false
    },
    {
      id: 3,
      title: "Habit Master",
      description: "Complete 50 habits total",
      icon: Award,
      progress: 12,
      total: 50,
      xp: 500,
      unlocked: false
    },
    {
      id: 4,
      title: "Legendary Streak",
      description: "Maintain a 30-day streak",
      icon: Star,
      progress: 5,
      total: 30,
      xp: 1000,
      unlocked: false
    }
  ])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      await api.getCurrentUser()
    } catch (error) {
      console.error('Authentication check failed:', error)
      router.push('/auth/login')
      return
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-fintech flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-fintech">
      <div className="container-mobile py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Achievements
          </h1>
          <p className="text-xl text-white/80">
            Unlock badges and earn XP by building consistent habits
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card glass-card-hover p-6 text-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-white/70 mb-1">Total XP</p>
                <p className="text-3xl font-bold text-white">1,250</p>
              </div>
              <Trophy className="w-8 h-8 text-accent-400" />
            </div>
          </div>
          
          <div className="glass-card glass-card-hover p-6 text-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-white/70 mb-1">Unlocked</p>
                <p className="text-3xl font-bold text-white">1/4</p>
              </div>
              <Star className="w-8 h-8 text-button-500" />
            </div>
          </div>
          
          <div className="glass-card glass-card-hover p-6 text-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-caption text-white/70 mb-1">Current Streak</p>
                <p className="text-3xl font-bold text-white">5 days</p>
              </div>
              <Target className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon
            const isUnlocked = achievement.unlocked
            
            return (
              <div
                key={achievement.id}
                className={`glass-card glass-card-hover p-6 ${
                  isUnlocked ? '' : 'opacity-75'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    isUnlocked ? 'bg-accent-500/20' : 'bg-white/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${isUnlocked ? 'text-accent-400' : 'text-white/40'}`} />
                  </div>
                  <div className="text-right">
                    <p className={`text-caption font-semibold ${
                      isUnlocked ? 'text-accent-400' : 'text-white/50'
                    }`}>
                      +{achievement.xp} XP
                    </p>
                    {isUnlocked && (
                      <p className="text-caption text-green-400">✓ Unlocked</p>
                    )}
                  </div>
                </div>
                
                <h3 className={`text-title mb-2 ${
                  isUnlocked ? 'text-white' : 'text-white/70'
                }`}>
                  {achievement.title}
                </h3>
                
                <p className={`text-body mb-4 ${
                  isUnlocked ? 'text-white/70' : 'text-white/50'
                }`}>
                  {achievement.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-caption">
                    <span className={isUnlocked ? 'text-white/70' : 'text-white/50'}>
                      Progress
                    </span>
                    <span className={isUnlocked ? 'text-white' : 'text-white/60'}>
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-1 rounded-full transition-all duration-1000 ${
                        isUnlocked ? 'bg-accent-400' : 'bg-white/30'
                      }`}
                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
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
                <div className="nav-link text-white/60">
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
                <div className="nav-link text-white">
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
    </div>
  )
}
