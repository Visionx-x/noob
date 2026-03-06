'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle, Circle, Clock, Target, Activity, TrendingUp, Users } from 'lucide-react'
import api from '@/lib/api'

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Morning Meditation', description: 'Meditate for 10 minutes', completed: false, streak: 5, xp: 10 },
    { id: 2, title: 'Evening Walk', description: 'Walk for 30 minutes', completed: true, streak: 3, xp: 15 },
    { id: 3, title: 'Read for 30 minutes', description: 'Read any book', completed: false, streak: 7, xp: 20 },
    { id: 4, title: 'Drink 8 glasses of water', description: 'Stay hydrated', completed: true, streak: 12, xp: 5 },
    { id: 5, title: 'No social media before noon', description: 'Digital detox', completed: false, streak: 2, xp: 25 }
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({ title: '', description: '', xp: 10 })
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

  const toggleTask = (taskId) => {
    console.log('Toggling task:', taskId)
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ))
  }

  const addTask = () => {
    if (newTask.title.trim()) {
      console.log('Adding task:', newTask)
      const task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        streak: 0,
        xp: newTask.xp
      }
      setTasks([...tasks, task])
      setNewTask({ title: '', description: '', xp: 10 })
      setShowAddForm(false)
    } else {
      console.log('Cannot add task: title is empty')
    }
  }

  const updateTask = () => {
    if (editingTask && newTask.title.trim()) {
      console.log('Updating task:', editingTask.id, newTask)
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, title: newTask.title, description: newTask.description, xp: newTask.xp }
          : task
      ))
      setEditingTask(null)
      setNewTask({ title: '', description: '', xp: 10 })
    } else {
      console.log('Cannot update task: missing data')
    }
  }

  const deleteTask = (taskId) => {
    console.log('Deleting task:', taskId)
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const startEdit = (task) => {
    setEditingTask(task)
    setNewTask({ title: task.title, description: task.description, xp: task.xp })
  }

  const completedCount = tasks.filter(task => task.completed).length
  const totalXP = tasks.reduce((sum, task) => sum + (task.completed ? task.xp : 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-fintech flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-fintech pb-20">
      <div className="container-mobile py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-headline text-white mb-4">Task Management</h1>
          <p className="text-body text-white/70">Manage your daily habits and tasks</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="glass-card glass-card-hover p-4 text-center">
            <CheckCircle className="w-6 h-6 text-accent-400 mx-auto mb-2" />
            <span className="text-2xl font-bold text-white">{completedCount}/{tasks.length}</span>
            <p className="text-caption text-white/70">Completed Today</p>
          </div>
          
          <div className="glass-card glass-card-hover p-4 text-center">
            <Target className="w-6 h-6 text-button-500 mx-auto mb-2" />
            <span className="text-2xl font-bold text-white">{totalXP}</span>
            <p className="text-caption text-white/70">XP Earned</p>
          </div>
        </div>

        {/* Add Task Button */}
        <button 
          onClick={() => setShowAddForm(true)}
          className="glass-button-primary w-full mb-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Task
        </button>

        {/* Add/Edit Task Form */}
        {(showAddForm || editingTask) && (
          <div className="glass-card p-6 mb-6">
            <h3 className="text-title text-white mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="glass-input"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="glass-input min-h-[80px]"
                  placeholder="Enter task description"
                />
              </div>
              <div>
                <label className="form-label">XP Reward</label>
                <input
                  type="number"
                  value={newTask.xp}
                  onChange={(e) => setNewTask({ ...newTask, xp: parseInt(e.target.value) || 10 })}
                  className="glass-input"
                  min="1"
                  max="100"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={editingTask ? updateTask : addTask}
                  className="glass-button-primary flex-1"
                >
                  {editingTask ? 'Update' : 'Add'} Task
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingTask(null)
                    setNewTask({ title: '', description: '', xp: 10 })
                  }}
                  className="glass-button-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="glass-card glass-card-hover p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-1"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-accent-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/40" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h4 className={`text-body font-semibold mb-1 ${
                      task.completed ? 'text-white/60 line-through' : 'text-white'
                    }`}>
                      {task.title}
                    </h4>
                    <p className={`text-caption mb-2 ${
                      task.completed ? 'text-white/40' : 'text-white/70'
                    }`}>
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-4 text-caption">
                      <span className="text-white/50">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {task.streak} day streak
                      </span>
                      <span className="text-accent-400">
                        +{task.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => startEdit(task)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-white/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Target className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-title text-white mb-2">No Tasks Yet</h3>
            <p className="text-body text-white/70 mb-4">
              Start building your habits by adding your first task
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="glass-button-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Task
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
        <div className="container-mobile py-4">
          <div className="grid grid-cols-5 gap-2">
            {/* Task Management Button - Active */}
            <div className="text-center">
              <div className="nav-link text-white">
                <Target className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">Tasks</span>
              </div>
            </div>
            
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
