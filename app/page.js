'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThreeBackground from '@/components/ThreeBackground'
import { 
  Camera, 
  MapPin, 
  Trophy, 
  Star, 
  Upload, 
  Zap,
  Users,
  Award,
  TrendingUp,
  Globe,
  Shield,
  Sparkles,
  Brain,
  Navigation,
  BarChart3,
  CheckCircle,
  Timer,
  BookOpen,
  Chrome,
  ArrowRight,
  PlayCircle,
  Target,
  Lightbulb,
  Heart,
  Rocket
} from 'lucide-react'

export default function App() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [leaderboard, setLeaderboard] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  
  // Report form state
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    category: 'infrastructure',
    location: '',
    image: null
  })

  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in (simple demo implementation)
    const savedUser = localStorage.getItem('civicUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setShowIntro(false)
      fetchLeaderboard()
      fetchReports()
    }
  }, [])

  const handleGoogleLogin = async () => {
    // Demo implementation - in production use NextAuth
    const demoUser = {
      id: 'demo_' + Date.now(),
      name: 'Alex Chen',
      email: 'alex@example.com',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-af?w=100&h=100&fit=crop&crop=face',
      totalPoints: 0,
      level: 1,
      badges: [],
      quizScore: 0
    }
    
    setUser(demoUser)
    localStorage.setItem('civicUser', JSON.stringify(demoUser))
    setShowIntro(false)
    setActiveTab('dashboard')
    fetchLeaderboard()
  }

  const fetchLeaderboard = async () => {
    try {
      // Demo data for immediate "aha moment"
      const demoLeaderboard = [
        {
          rank: 1,
          name: 'Emma Rodriguez',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b6124-af?w=50&h=50&fit=crop&crop=face',
          totalPoints: 1250,
          level: 13,
          badges: ['Civic Champion', 'Eco Warrior', 'First Reporter']
        },
        {
          rank: 2,
          name: 'Marcus Johnson',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          totalPoints: 890,
          level: 9,
          badges: ['Community Helper', 'Safety Scout']
        },
        {
          rank: 3,
          name: 'Sophia Kim',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
          totalPoints: 675,
          level: 7,
          badges: ['First Reporter', 'Civic Champion']
        },
        {
          rank: 4,
          name: 'Alex Chen',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-af?w=50&h=50&fit=crop&crop=face',
          totalPoints: user?.totalPoints || 0,
          level: user?.level || 1,
          badges: user?.badges || []
        }
      ]
      
      setLeaderboard(demoLeaderboard)
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    }
  }

  const fetchReports = async () => {
    try {
      // Demo reports data
      const demoReports = [
        {
          id: 'report_1',
          title: 'Pothole on Main Street',
          description: 'Large pothole causing traffic issues',
          category: 'infrastructure',
          userName: 'Alex Chen',
          pointsAwarded: 25,
          status: 'verified',
          createdAt: new Date(Date.now() - 86400000)
        }
      ]
      
      setReports(demoReports)
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setReportForm({ ...reportForm, image: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setReportForm({ 
            ...reportForm, 
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          })
        },
        (error) => {
          console.error('Location error:', error)
          // Demo location for testing
          setReportForm({ 
            ...reportForm, 
            location: '40.7128, -74.0060' // NYC coordinates
          })
        }
      )
    } else {
      // Demo location
      setReportForm({ 
        ...reportForm, 
        location: '40.7128, -74.0060'
      })
    }
  }

  const handleSubmitReport = async () => {
    if (!reportForm.title || !reportForm.description) {
      alert('Please fill in title and description')
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call with instant gratification
      const pointsAwarded = 25
      const newBadges = reports.length === 0 ? ['First Reporter'] : []
      
      const newReport = {
        id: 'report_' + Date.now(),
        ...reportForm,
        userName: user.name,
        userEmail: user.email,
        pointsAwarded,
        status: 'pending',
        createdAt: new Date()
      }

      // Update user points
      const updatedUser = {
        ...user,
        totalPoints: user.totalPoints + pointsAwarded,
        level: Math.floor((user.totalPoints + pointsAwarded) / 100) + 1,
        badges: [...user.badges, ...newBadges]
      }

      setUser(updatedUser)
      localStorage.setItem('civicUser', JSON.stringify(updatedUser))
      
      setReports([newReport, ...reports])
      
      // Show success with animation effect
      alert(`🎉 Report submitted! You earned ${pointsAwarded} points!${newBadges.length > 0 ? ` New badge: ${newBadges[0]}` : ''}`)
      
      // Reset form
      setReportForm({
        title: '',
        description: '',
        category: 'infrastructure',
        location: '',
        image: null
      })
      
      // Update leaderboard
      fetchLeaderboard()
      
    } catch (error) {
      console.error('Submit error:', error)
      alert('Error submitting report. Please try again.')
    }
    
    setLoading(false)
  }

  // Intro/Landing Page
  if (showIntro) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ThreeBackground />
        
        {/* Hero Section */}
        <div className="relative z-10 min-h-screen flex flex-col">
          
          {/* Navigation */}
          <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">CivicEngage</h1>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#impact" className="text-gray-300 hover:text-white transition-colors">Impact</a>
                <a href="#community" className="text-gray-300 hover:text-white transition-colors">Community</a>
                <Button 
                  onClick={handleGoogleLogin}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </nav>

          {/* Main Hero */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="mb-8">
                  <Badge className="bg-blue-600/20 text-blue-300 mb-4">
                    🚀 Join 15,000+ Active Citizens
                  </Badge>
                  <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Empowering{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      Communities
                    </span>
                    <br />
                    One Tap at a Time
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Transform your city through gamified civic engagement. Report issues, 
                    learn civic knowledge, discover public facilities, and earn rewards 
                    while making a real difference.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    onClick={handleGoogleLogin}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Start with Google
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl"
                  >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-white">2,847</div>
                    <div className="text-gray-400 text-sm">Issues Resolved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">15,234</div>
                    <div className="text-gray-400 text-sm">Active Citizens</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">98%</div>
                    <div className="text-gray-400 text-sm">Response Rate</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Feature Preview */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Quick Report</h3>
                    <Badge className="bg-green-600 text-white">Live Demo</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-white">
                        <Camera className="w-4 h-4" />
                        <span className="text-sm">Snap & Report Issues</span>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-white">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Earn 25+ Points</span>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-white">
                        <Star className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">Unlock Badges</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">Powerful Features for Civic Change</h2>
              <p className="text-xl text-gray-300">Everything you need to engage with your community</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Report & Reward */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle>Report & Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">Snap photos, report issues, and earn instant points for verified submissions.</p>
                  <Badge className="bg-blue-500/20 text-blue-300">25+ points per report</Badge>
                </CardContent>
              </Card>

              {/* Civic Quiz */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6 text-green-400" />
                  </div>
                  <CardTitle>Civic Sense Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">Learn about democracy, environment, and civic rights through gamified quizzes.</p>
                  <Badge className="bg-green-500/20 text-green-300">100+ quizzes</Badge>
                </CardContent>
              </Card>

              {/* CleanMap */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle>CleanMap</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">Discover and review public facilities with community-powered ratings.</p>
                  <Badge className="bg-purple-500/20 text-purple-300">Real-time data</Badge>
                </CardContent>
              </Card>

              {/* Leaderboards */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all group">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <CardTitle>Leaderboards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">Compete with fellow citizens and climb the community rankings.</p>
                  <Badge className="bg-yellow-500/20 text-yellow-300">Real-time updates</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="relative z-10 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-white mb-6">Real Impact, Real Change</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Our community-driven platform has helped resolve thousands of civic issues 
                  and educated citizens across multiple cities.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">2,847 Issues Resolved</h3>
                      <p className="text-gray-400">From potholes to broken streetlights</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">15,234 Active Citizens</h3>
                      <p className="text-gray-400">Growing community of changemakers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">98% Response Rate</h3>
                      <p className="text-gray-400">Quick action on reported issues</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Community Impact</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">87%</div>
                      <div className="text-gray-300 text-sm">Faster Response</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">€2.4M</div>
                      <div className="text-gray-300 text-sm">Cost Savings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400">45%</div>
                      <div className="text-gray-300 text-sm">More Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400">4.8★</div>
                      <div className="text-gray-300 text-sm">User Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of citizens who are already transforming their communities
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGoogleLogin}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-xl"
              >
                <Heart className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
            
            <p className="text-gray-400 text-sm mt-6">
              Free forever • No credit card required • Join in 30 seconds
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10 py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CivicEngage</span>
              </div>
              
              <div className="flex items-center space-x-8 text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 CivicEngage. Empowering communities, one tap at a time.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Main App Dashboard (existing code continues...)
  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">CivicEngage</h1>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                Level {user.level}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-white">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">{user.totalPoints} pts</span>
              </div>
              
              <Avatar>
                <AvatarImage src={user.image} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex space-x-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                { id: 'report', label: 'Report Issue', icon: Camera },
                { id: 'quiz', label: 'Civic Quiz', icon: Brain, path: '/quiz' },
                { id: 'clean-map', label: 'CleanMap', icon: MapPin, path: '/clean-map' },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                ...(user.email === 'alex@example.com' ? [{ id: 'admin', label: 'Admin', icon: Shield, path: '/admin' }] : [])
              ].map(({ id, label, icon: Icon, path }) => (
                <button
                  key={id}
                  onClick={() => path ? router.push(path) : setActiveTab(id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === id 
                      ? 'border-blue-400 text-blue-400' 
                      : 'border-transparent text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-400" />
                      Your Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">{reports.length}</div>
                    <p className="text-gray-300">Issues Reported</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-blue-400" />
                      Points Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">{user.totalPoints}</div>
                    <p className="text-gray-300">Total Points</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-green-400" />
                      Community Rank
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">#{leaderboard.findIndex(u => u.name === user.name) + 1 || 4}</div>
                    <p className="text-gray-300">Current Position</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => setActiveTab('report')}
                  className="bg-blue-600 hover:bg-blue-700 h-16 flex flex-col items-center justify-center"
                >
                  <Camera className="w-6 h-6 mb-1" />
                  <span>Report Issue</span>
                </Button>
                
                <Button 
                  onClick={() => router.push('/quiz')}
                  className="bg-green-600 hover:bg-green-700 h-16 flex flex-col items-center justify-center"
                >
                  <Brain className="w-6 h-6 mb-1" />
                  <span>Take Quiz</span>
                </Button>
                
                <Button 
                  onClick={() => router.push('/clean-map')}
                  className="bg-purple-600 hover:bg-purple-700 h-16 flex flex-col items-center justify-center"
                >
                  <MapPin className="w-6 h-6 mb-1" />
                  <span>Find Facilities</span>
                </Button>
                
                <Button 
                  onClick={() => setActiveTab('leaderboard')}
                  className="bg-yellow-600 hover:bg-yellow-700 h-16 flex flex-col items-center justify-center"
                >
                  <Trophy className="w-6 h-6 mb-1" />
                  <span>Leaderboard</span>
                </Button>
              </div>

              {/* Badges */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.length > 0 ? (
                      user.badges.map((badge, index) => (
                        <Badge key={index} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          {badge}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-400">No badges yet. Submit your first report to earn badges!</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Your Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {reports.length > 0 ? (
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <div key={report.id} className="border-b border-white/10 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{report.title}</h3>
                              <p className="text-gray-300 text-sm">{report.description}</p>
                              <Badge className="mt-2 bg-blue-500/20 text-blue-300">
                                {report.category}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 font-semibold">+{report.pointsAwarded} pts</div>
                              <Badge className={`mt-1 ${
                                report.status === 'verified' 
                                  ? 'bg-green-500/20 text-green-300' 
                                  : 'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {report.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No reports yet. Submit your first report to get started!</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Report Tab */}
          {activeTab === 'report' && (
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Report an Issue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Issue Title</label>
                    <Input
                      value={reportForm.title}
                      onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                      placeholder="Brief description of the issue"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={reportForm.description}
                      onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                      placeholder="Detailed description of the issue"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={reportForm.category}
                      onChange={(e) => setReportForm({ ...reportForm, category: e.target.value })}
                      className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                    >
                      <option value="infrastructure">Infrastructure</option>
                      <option value="environment">Environment</option>
                      <option value="safety">Safety</option>
                      <option value="transport">Transport</option>
                      <option value="waste">Waste Management</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Photo (Optional)</label>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center">
                        {reportForm.image ? (
                          <div className="relative">
                            <img 
                              src={reportForm.image} 
                              alt="Report preview" 
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => setReportForm({ ...reportForm, image: null })}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label 
                              htmlFor="image-upload"
                              className="cursor-pointer text-blue-400 hover:text-blue-300"
                            >
                              Upload Photo
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <div className="space-y-2">
                        <Input
                          value={reportForm.location}
                          onChange={(e) => setReportForm({ ...reportForm, location: e.target.value })}
                          placeholder="Coordinates or address"
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        />
                        <Button
                          type="button"
                          onClick={handleLocationCapture}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Use Current Location
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitReport}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {loading ? 'Submitting...' : 'Submit Report & Earn Points'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                    Community Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboard.map((leader) => (
                      <div key={leader.rank} className={`flex items-center justify-between p-4 rounded-lg ${
                        leader.name === user.name 
                          ? 'bg-blue-600/20 border border-blue-400/50' 
                          : 'bg-white/5 hover:bg-white/10'
                      } transition-colors`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            leader.rank === 1 ? 'bg-yellow-500 text-black' :
                            leader.rank === 2 ? 'bg-gray-400 text-black' :
                            leader.rank === 3 ? 'bg-orange-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {leader.rank}
                          </div>
                          
                          <Avatar>
                            <AvatarImage src={leader.image} />
                            <AvatarFallback>{leader.name?.[0]}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="font-semibold flex items-center">
                              {leader.name}
                              {leader.name === user.name && (
                                <Badge className="ml-2 bg-blue-500 text-white">You</Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">Level {leader.level}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-lg">{leader.totalPoints}</div>
                          <div className="text-sm text-gray-400">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}