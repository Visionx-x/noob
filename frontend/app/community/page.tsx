'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, Trophy, TrendingUp, Award, Crown, Activity, CheckCircle, Settings } from 'lucide-react'
import api from '@/lib/api'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('leaderboard')
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
  
  const leaderboard = [
    { rank: 1, name: 'Alex Chen', xp: 15420, habits: 15, streak: 45, avatar: '👤' },
    { rank: 2, name: 'Sarah Johnson', xp: 14280, habits: 12, streak: 38, avatar: '👩' },
    { rank: 3, name: 'Mike Wilson', xp: 13500, habits: 14, streak: 32, avatar: '👨' },
    { rank: 4, name: 'Emma Davis', xp: 12890, habits: 11, streak: 28, avatar: '👩' },
    { rank: 5, name: 'James Brown', xp: 11950, habits: 13, streak: 25, avatar: '👨' },
    { rank: 6, name: 'Lisa Garcia', xp: 11200, habits: 10, streak: 22, avatar: '👩' },
    { rank: 7, name: 'David Lee', xp: 10500, habits: 12, streak: 20, avatar: '👨' },
    { rank: 8, name: 'Maria Martinez', xp: 9800, habits: 9, streak: 18, avatar: '👩' },
  ]

  const challenges = [
    {
      id: 1,
      title: "30-Day Meditation Challenge",
      description: "Meditate for 10 minutes every day for 30 days",
      participants: 234,
      xp: 500,
      difficulty: "Medium",
      daysLeft: 12
    },
    {
      id: 2,
      title: "Fitness Warrior",
      description: "Complete any fitness activity for 21 days straight",
      participants: 189,
      xp: 750,
      difficulty: "Hard",
      daysLeft: 5
    },
    {
      id: 3,
      title: "Reading Marathon",
      description: "Read for 30 minutes daily for 14 days",
      participants: 156,
      xp: 300,
      difficulty: "Easy",
      daysLeft: 8
    }
  ]

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
            Community
          </h1>
          <p className="text-xl text-white/80">
            Connect with fellow habit builders and compete on the leaderboard
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glass-card glass-card-hover p-1 flex space-x-1">
            {['leaderboard', 'challenges', 'teams'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-button-500 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div>
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {leaderboard.slice(0, 3).map((user, index) => (
                <div
                  key={user.rank}
                  className={`glass-card glass-card-hover p-6 text-center ${
                    index === 0 ? 'border-2 border-accent-400' : index === 1 ? 'border-2 border-button-500' : 'border-2 border-primary-600'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="text-2xl mb-1">{user.avatar}</div>
                  <h3 className="text-title text-white mb-1">{user.name}</h3>
                  <p className="text-2xl font-bold text-white mb-1">{user.xp.toLocaleString()}</p>
                  <p className="text-caption text-white/70">XP</p>
                  <div className="mt-4 space-y-1 text-caption">
                    <p className="text-white/70">{user.habits} habits</p>
                    <p className="text-white/70">{user.streak} day streak</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rest of Leaderboard */}
            <div className="glass-card p-6">
              <h3 className="text-title text-white mb-4">Top Performers</h3>
              <div className="space-y-3">
                {leaderboard.slice(3).map((user, index) => (
                  <div key={user.rank} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-white/70 w-8">#{user.rank}</span>
                      <span className="text-2xl">{user.avatar}</span>
                      <div>
                        <p className="text-body text-white font-medium">{user.name}</p>
                        <p className="text-caption text-white/70">{user.habits} habits • {user.streak} day streak</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-title text-accent-400 font-semibold">{user.xp.toLocaleString()}</p>
                      <p className="text-caption text-white/70">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge, index) => (
              <div key={challenge.id} className="glass-card glass-card-hover p-6">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-6 h-6 text-accent-400" />
                  <span className={`px-3 py-1 rounded-lg text-caption font-medium ${
                    challenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-400/50' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50' :
                    'bg-red-500/20 text-red-400 border border-red-400/50'
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <h3 className="text-title text-white mb-2">{challenge.title}</h3>
                <p className="text-body text-white/70 mb-4">{challenge.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-caption">
                    <span className="text-white/70">Participants</span>
                    <span className="text-white">{challenge.participants}</span>
                  </div>
                  <div className="flex justify-between text-caption">
                    <span className="text-white/70">Reward</span>
                    <span className="text-accent-400 font-medium">+{challenge.xp} XP</span>
                  </div>
                  <div className="flex justify-between text-caption">
                    <span className="text-white/70">Days Left</span>
                    <span className="text-orange-400">{challenge.daysLeft}</span>
                  </div>
                </div>
                
                <button className="glass-button-primary w-full">
                  Join Challenge
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="glass-card p-8 text-center">
            <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-headline text-white mb-4">Teams Coming Soon!</h3>
            <p className="text-body text-white/70 mb-6">
              Form teams with friends, compete together, and unlock exclusive team challenges and rewards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div>
                <Crown className="w-8 h-8 text-accent-400 mx-auto mb-2" />
                <p className="text-body text-white font-medium">Team Leaderboards</p>
              </div>
              <div>
                <Award className="w-8 h-8 text-button-500 mx-auto mb-2" />
                <p className="text-body text-white font-medium">Team Challenges</p>
              </div>
              <div>
                <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-body text-white font-medium">Group Goals</p>
              </div>
            </div>
            <button className="glass-button-primary mt-6">
              Get Notified
            </button>
          </div>
        )}

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
                <div className="nav-link text-white/60">
                  <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Rewards</span>
                </div>
              </Link>
              <Link href="/community" className="text-center">
                <div className="nav-link text-white">
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
