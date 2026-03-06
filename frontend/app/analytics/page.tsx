'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Calendar, Target, Activity, CheckCircle, Users, Settings } from 'lucide-react'

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  
  const stats = {
    week: {
      totalHabits: 12,
      completed: 8,
      streak: 5,
      xp: 240,
      completionRate: 67
    },
    month: {
      totalHabits: 48,
      completed: 35,
      streak: 12,
      xp: 890,
      completionRate: 73
    },
    year: {
      totalHabits: 576,
      completed: 420,
      streak: 45,
      xp: 10800,
      completionRate: 73
    }
  }

  const currentStats = stats[selectedPeriod]

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
            Analytics
          </h1>
          <p className="text-xl text-white/80">
            Track your progress and analyze your habit patterns
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-8">
          <div className="glass-card glass-card-hover p-1 flex space-x-1">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-button-500 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-card glass-card-hover p-4 text-center">
            <Target className="w-6 h-6 text-white/60 mx-auto mb-2" />
            <span className="text-2xl font-bold text-white">{currentStats.totalHabits}</span>
            <p className="text-caption text-white/70">Total Habits</p>
          </div>

          <div className="glass-card glass-card-hover p-4 text-center">
            <Activity className="w-6 h-6 text-white/60 mx-auto mb-2" />
            <span className="text-2xl font-bold text-white">{currentStats.completed}</span>
            <p className="text-caption text-white/70">Completed</p>
          </div>

          <div className="glass-card glass-card-hover p-4 text-center">
            <TrendingUp className="w-6 h-6 text-white/60 mx-auto mb-2" />
            <span className="text-2xl font-bold text-white">{currentStats.streak}</span>
            <p className="text-caption text-white/70">Day Streak</p>
          </div>

          <div className="glass-card glass-card-hover p-4 text-center">
            <Calendar className="w-6 h-6 text-white/60 mx-auto mb-2" />
            <span className="text-2xl font-bold text-white">{currentStats.xp}</span>
            <p className="text-caption text-white/70">XP Earned</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Completion Rate */}
          <div className="glass-card p-6">
            <h3 className="text-title text-white mb-4">Completion Rate</h3>
            <div className="relative h-48 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-accent-400 mb-2">
                  {currentStats.completionRate}%
                </div>
                <p className="text-body text-white/70">of habits completed</p>
              </div>
            </div>
            <div className="mt-4 w-full bg-white/10 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-accent-400 to-button-500 transition-all duration-1000"
                style={{ width: `${currentStats.completionRate}%` }}
              />
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="glass-card p-6">
            <h3 className="text-title text-white mb-4">Weekly Progress</h3>
            <div className="space-y-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-caption text-white/70 w-12">{day}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-accent-400 transition-all duration-500"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-caption text-white/70 w-12 text-right">
                    {Math.floor(Math.random() * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="glass-card p-6">
          <h3 className="text-title text-white mb-4">Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-accent-400 font-semibold mb-2">🔥 Hot Streak</h4>
              <p className="text-body text-white/70">
                You're on a {currentStats.streak}-day streak! Keep it up to unlock bonus XP.
              </p>
            </div>
            <div>
              <h4 className="text-accent-400 font-semibold mb-2">📈 Improving</h4>
              <p className="text-body text-white/70">
                Your completion rate is {currentStats.completionRate}% - that's {currentStats.completionRate > 70 ? 'excellent!' : 'good, keep improving!'}
              </p>
            </div>
            <div>
              <h4 className="text-accent-400 font-semibold mb-2">💡 Tip</h4>
              <p className="text-body text-white/70">
                Try completing habits in the morning for better consistency.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="container-mobile py-4">
            <div className="grid grid-cols-5 gap-2">
              <Link href="/tasks" className="text-center">
                <div className="nav-link text-white/60">
                  <Settings className="w-5 h-5 mx-auto mb-1" />
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
                <div className="nav-link text-white">
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
    </div>
  )
}
