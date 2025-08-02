'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ThreeBackground from '@/components/ThreeBackground'
import { 
  Camera, 
  MapPin, 
  Trophy, 
  Star, 
  Zap,
  Users,
  Award,
  TrendingUp,
  Globe,
  Shield,
  Brain,
  LogOut,
  Settings
} from 'lucide-react'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reports, setReports] = useState([])
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchDashboardData()
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      // Demo data for immediate functionality
      setReports([
        {
          id: 'report_1',
          title: 'Pothole on Main Street',
          description: 'Large pothole causing traffic issues',
          category: 'infrastructure',
          pointsAwarded: 25,
          status: 'verified',
          createdAt: new Date(Date.now() - 86400000)
        }
      ])

      setLeaderboard([
        {
          rank: 1,
          name: 'Emma Rodriguez',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b6124-af?w=50&h=50&fit=crop&crop=face',
          totalPoints: 1250,
          level: 13,
        },
        {
          rank: 2,
          name: session.user.name,
          image: session.user.image,
          totalPoints: session.user.totalPoints || 0,
          level: session.user.level || 1,
        }
      ])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

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
                Level {session.user.level || 1}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-white">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">{session.user.totalPoints || 0} pts</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={session.user.image} />
                  <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <Button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto p-6">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {session.user.name?.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-300">Ready to make a difference in your community today?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{reports.length}</div>
                <p className="text-gray-300 text-sm">Issues Reported</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Zap className="w-5 h-5 mr-2 text-blue-400" />
                  Points Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{session.user.totalPoints || 0}</div>
                <p className="text-gray-300 text-sm">Total Points</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Globe className="w-5 h-5 mr-2 text-green-400" />
                  Community Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">#{leaderboard.findIndex(u => u.name === session.user.name) + 1 || 2}</div>
                <p className="text-gray-300 text-sm">Current Position</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  Quiz Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{session.user.quizScore || 0}</div>
                <p className="text-gray-300 text-sm">Quiz Points</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Button 
                  onClick={() => router.push('/report')}
                  className="bg-blue-600 hover:bg-blue-700 h-20 flex flex-col items-center justify-center"
                >
                  <Camera className="w-8 h-8 mb-2" />
                  <span>Report Issue</span>
                  <span className="text-xs opacity-75">Earn 25+ points</span>
                </Button>
                
                <Button 
                  onClick={() => router.push('/quiz')}
                  className="bg-green-600 hover:bg-green-700 h-20 flex flex-col items-center justify-center"
                >
                  <Brain className="w-8 h-8 mb-2" />
                  <span>Take Quiz</span>
                  <span className="text-xs opacity-75">Learn & earn points</span>
                </Button>
                
                <Button 
                  onClick={() => router.push('/clean-map')}
                  className="bg-purple-600 hover:bg-purple-700 h-20 flex flex-col items-center justify-center"
                >
                  <MapPin className="w-8 h-8 mb-2" />
                  <span>Find Facilities</span>
                  <span className="text-xs opacity-75">Rate & review</span>
                </Button>
                
                <Button 
                  onClick={() => router.push('/leaderboard')}
                  className="bg-yellow-600 hover:bg-yellow-700 h-20 flex flex-col items-center justify-center"
                >
                  <Trophy className="w-8 h-8 mb-2" />
                  <span>Leaderboard</span>
                  <span className="text-xs opacity-75">See rankings</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Badges */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  Your Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(session.user.badges && session.user.badges.length > 0) ? (
                    session.user.badges.map((badge, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        {badge}
                      </Badge>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-400 mb-3">No badges yet!</p>
                      <p className="text-gray-500 text-sm">Submit your first report or take a quiz to earn badges</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Recent Activity
                </CardTitle>
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
                  <div className="text-center py-6">
                    <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-400 mb-3">No activity yet!</p>
                    <p className="text-gray-500 text-sm">Start by reporting an issue or taking a quiz</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Admin Access */}
          {session.user.email === 'alex@example.com' && (
            <Card className="bg-red-600/10 backdrop-blur-md border-red-400/20 text-white mt-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-400" />
                  Administrator Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">You have administrator privileges. Manage community reports and users.</p>
                <Button 
                  onClick={() => router.push('/admin')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Open Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}