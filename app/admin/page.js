'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  TrendingUp,
  MapPin,
  Star,
  Eye,
  X,
  MessageSquare,
  Camera,
  Calendar,
  Filter
} from 'lucide-react'

const sampleReports = [
  {
    id: 'report_1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the intersection',
    category: 'infrastructure',
    status: 'pending',
    priority: 'high',
    userName: 'Alex Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-af?w=50&h=50&fit=crop&crop=face',
    location: '40.7128, -74.0060',
    pointsAwarded: 25,
    createdAt: new Date(Date.now() - 86400000),
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
  },
  {
    id: 'report_2',
    title: 'Broken Street Light',
    description: 'Street light not working, creating safety hazard',
    category: 'safety',
    status: 'in-progress',
    priority: 'medium',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    location: '40.7580, -73.9855',
    pointsAwarded: 30,
    createdAt: new Date(Date.now() - 172800000),
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
  },
  {
    id: 'report_3',
    title: 'Illegal Dumping Site',
    description: 'Large amount of waste dumped in public area',
    category: 'environment',
    status: 'resolved',
    priority: 'high',
    userName: 'Mike Rodriguez',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    location: '40.6892, -74.0445',
    pointsAwarded: 35,
    createdAt: new Date(Date.now() - 259200000),
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop'
  }
]

const sampleUsers = [
  {
    id: 1,
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-af?w=50&h=50&fit=crop&crop=face',
    totalPoints: 125,
    level: 2,
    reportsSubmitted: 5,
    quizzesCompleted: 8,
    joinedDate: new Date(Date.now() - 2592000000),
    status: 'active'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    totalPoints: 890,
    level: 9,
    reportsSubmitted: 23,
    quizzesCompleted: 45,
    joinedDate: new Date(Date.now() - 7776000000),
    status: 'active'
  },
  {
    id: 3,
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    totalPoints: 1250,
    level: 13,
    reportsSubmitted: 34,
    quizzesCompleted: 67,
    joinedDate: new Date(Date.now() - 15552000000),
    status: 'active'
  }
]

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [reports, setReports] = useState(sampleReports)
  const [users, setUsers] = useState(sampleUsers)
  const [selectedReport, setSelectedReport] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const savedUser = localStorage.getItem('civicUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (userData.email !== 'alex@example.com') { // Demo admin check
        router.push('/dashboard')
        return
      }
      setUser(userData)
    } else {
      router.push('/auth/signin')
    }
  }, [router])

  const handleStatusUpdate = (reportId, newStatus) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: newStatus }
        : report
    ))
    
    if (selectedReport?.id === reportId) {
      setSelectedReport({ ...selectedReport, status: newStatus })
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || report.priority === priorityFilter
    return matchesStatus && matchesPriority
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-500/20 text-yellow-300', icon: Clock },
      'in-progress': { color: 'bg-blue-500/20 text-blue-300', icon: AlertCircle },
      resolved: { color: 'bg-green-500/20 text-green-300', icon: CheckCircle }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon
    
    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </Badge>
    )
  }

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-gray-500/20 text-gray-300',
      medium: 'bg-yellow-500/20 text-yellow-300',
      high: 'bg-red-500/20 text-red-300'
    }
    
    return (
      <Badge className={colors[priority] || colors.medium}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    )
  }

  // Analytics data
  const analytics = {
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    resolvedReports: reports.filter(r => r.status === 'resolved').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalPoints: users.reduce((sum, user) => sum + user.totalPoints, 0)
  }

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.push('/dashboard')} variant="ghost" className="text-white hover:bg-white/10">
              ← Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-300 text-sm">Manage reports, users, and community engagement</p>
              </div>
            </div>
          </div>
          
          <Badge className="bg-red-600 text-white px-3 py-1">
            Administrator
          </Badge>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        
        {/* Analytics Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Reports</p>
                  <p className="text-3xl font-bold">{analytics.totalReports}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-400">{analytics.pendingReports}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Active Users</p>
                  <p className="text-3xl font-bold text-green-400">{analytics.activeUsers}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Community Points</p>
                  <p className="text-3xl font-bold text-purple-400">{analytics.totalPoints.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="reports" className="data-[state=active]:bg-white/20">
              Report Management
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white/20">
              User Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Reports Management */}
          <TabsContent value="reports">
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Reports List */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Filters */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardContent className="p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white text-sm mb-2">Filter by Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                        >
                          <option value="all" className="bg-slate-800">All Status</option>
                          <option value="pending" className="bg-slate-800">Pending</option>
                          <option value="in-progress" className="bg-slate-800">In Progress</option>
                          <option value="resolved" className="bg-slate-800">Resolved</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white text-sm mb-2">Filter by Priority</label>
                        <select
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                          className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                        >
                          <option value="all" className="bg-slate-800">All Priority</option>
                          <option value="high" className="bg-slate-800">High</option>
                          <option value="medium" className="bg-slate-800">Medium</option>
                          <option value="low" className="bg-slate-800">Low</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <Filter className="w-4 h-4 mr-2" />
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reports List */}
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Card 
                      key={report.id} 
                      className={`bg-white/10 backdrop-blur-md border-white/20 cursor-pointer transition-all hover:bg-white/15 ${
                        selectedReport?.id === report.id ? 'ring-2 ring-blue-400' : ''
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg mb-1">{report.title}</h3>
                            <p className="text-gray-300 text-sm mb-2">{report.description}</p>
                            <div className="flex items-center space-x-3 text-sm text-gray-400">
                              <div className="flex items-center space-x-1">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={report.userAvatar} />
                                  <AvatarFallback>{report.userName[0]}</AvatarFallback>
                                </Avatar>
                                <span>{report.userName}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>Location</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 items-end">
                            {getStatusBadge(report.status)}
                            {getPriorityBadge(report.priority)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Badge className="bg-purple-500/20 text-purple-300">
                            {report.category}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedReport(report)
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Report Details Sidebar */}
              <div>
                {selectedReport ? (
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white sticky top-6">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{selectedReport.title}</CardTitle>
                        <Button
                          onClick={() => setSelectedReport(null)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      {/* Image */}
                      {selectedReport.imageUrl && (
                        <div>
                          <img 
                            src={selectedReport.imageUrl} 
                            alt="Report" 
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Description */}
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-gray-300 text-sm">{selectedReport.description}</p>
                      </div>

                      {/* Reporter Info */}
                      <div>
                        <h4 className="font-semibold mb-2">Reported By</h4>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={selectedReport.userAvatar} />
                            <AvatarFallback>{selectedReport.userName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{selectedReport.userName}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(selectedReport.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Status & Priority */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold mb-2">Current Status</h4>
                          {getStatusBadge(selectedReport.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Priority Level</h4>
                          {getPriorityBadge(selectedReport.priority)}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <h4 className="font-semibold">Update Status</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(selectedReport.id, 'in-progress')}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={selectedReport.status === 'in-progress'}
                          >
                            In Progress
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleStatusUpdate(selectedReport.id, 'resolved')}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={selectedReport.status === 'resolved'}
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>

                      {/* Points Awarded */}
                      <div>
                        <h4 className="font-semibold mb-2">Points Awarded</h4>
                        <Badge className="bg-yellow-500/20 text-yellow-300">
                          <Star className="w-3 h-3 mr-1" />
                          {selectedReport.pointsAwarded} points
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold mb-2">Select a Report</h3>
                      <p className="text-gray-300">Click on a report to view details and manage status.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                            <span>Level {user.level}</span>
                            <span>{user.totalPoints} points</span>
                            <span>{user.reportsSubmitted} reports</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}>
                          {user.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Report Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['infrastructure', 'safety', 'environment'].map((category) => {
                      const count = reports.filter(r => r.category === category).length
                      const percentage = Math.round((count / reports.length) * 100)
                      return (
                        <div key={category}>
                          <div className="flex justify-between mb-1">
                            <span className="capitalize">{category}</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between">
                        <span>Average Response Time</span>
                        <span className="font-semibold">2.3 days</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Resolution Rate</span>
                        <span className="font-semibold text-green-400">87%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>User Satisfaction</span>
                        <span className="font-semibold text-yellow-400">4.2/5</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Monthly Active Users</span>
                        <span className="font-semibold">{users.length * 5}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}