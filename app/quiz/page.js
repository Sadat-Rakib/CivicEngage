'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  BookOpen, 
  Leaf, 
  Vote, 
  Shield, 
  AlertTriangle,
  Building,
  CheckCircle,
  X,
  Trophy,
  Star,
  Timer,
  Users
} from 'lucide-react'

const quizCategories = [
  {
    id: 'environmental',
    title: 'Environmental Rights',
    icon: Leaf,
    color: 'bg-green-500',
    description: 'Climate action, pollution, and sustainability',
    quizzes: 12,
    completed: 0
  },
  {
    id: 'waste',
    title: 'Waste Management',
    icon: AlertTriangle,
    color: 'bg-yellow-500',
    description: 'Recycling, disposal, and waste reduction',
    quizzes: 8,
    completed: 0
  },
  {
    id: 'voting',
    title: 'Voting & Democracy',
    icon: Vote,
    color: 'bg-blue-500',
    description: 'Electoral processes and civic participation',
    quizzes: 10,
    completed: 0
  },
  {
    id: 'digital',
    title: 'Digital Citizenship',
    icon: Brain,
    color: 'bg-purple-500',
    description: 'Online rights, privacy, and digital literacy',
    quizzes: 15,
    completed: 0
  },
  {
    id: 'emergency',
    title: 'Emergency Response',
    icon: Shield,
    color: 'bg-red-500',
    description: 'Disaster preparedness and safety protocols',
    quizzes: 6,
    completed: 0
  },
  {
    id: 'governance',
    title: 'Local Governance',
    icon: Building,
    color: 'bg-indigo-500',
    description: 'Municipal services and local government',
    quizzes: 11,
    completed: 0
  }
]

const sampleQuizzes = {
  environmental: [
    {
      id: 'env_1',
      title: 'Climate Change Basics',
      difficulty: 'Beginner',
      questions: [
        {
          question: 'What is the primary cause of climate change?',
          options: [
            'Solar radiation',
            'Greenhouse gas emissions',
            'Ocean currents',
            'Volcanic activity'
          ],
          correct: 1,
          explanation: 'Greenhouse gases trap heat in the atmosphere, causing global warming.'
        },
        {
          question: 'Which of these is a renewable energy source?',
          options: [
            'Coal',
            'Natural gas',
            'Solar power',
            'Nuclear power'
          ],
          correct: 2,
          explanation: 'Solar power is renewable as it comes from the sun, which is virtually inexhaustible.'
        },
        {
          question: 'What percentage of global emissions come from transportation?',
          options: [
            '10%',
            '14%',
            '20%',
            '25%'
          ],
          correct: 1,
          explanation: 'Transportation accounts for approximately 14% of global greenhouse gas emissions.'
        }
      ],
      pointsPerQuestion: 10
    }
  ]
}

export default function QuizPlatform() {
  const [user, setUser] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [leaderboard, setLeaderboard] = useState([])
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('civicUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      fetchLeaderboard()
    } else {
      router.push('/auth/signin')
    }
  }, [router])

  useEffect(() => {
    if (currentQuiz && !showExplanation && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showExplanation) {
      handleAnswerSubmit()
    }
  }, [timeLeft, showExplanation, currentQuiz])

  const fetchLeaderboard = () => {
    // Demo leaderboard data
    const demoLeaderboard = [
      { name: 'Emma Rodriguez', score: 2450, level: 'Expert', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6124-af?w=50&h=50&fit=crop&crop=face' },
      { name: 'Marcus Johnson', score: 1890, level: 'Advanced', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face' },
      { name: 'Sophia Kim', score: 1675, level: 'Intermediate', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face' },
      { name: 'Alex Chen', score: user?.quizScore || 0, level: 'Beginner', avatar: user?.image }
    ]
    setLeaderboard(demoLeaderboard)
  }

  const startQuiz = (categoryId) => {
    const quiz = sampleQuizzes[categoryId]?.[0]
    if (quiz) {
      setCurrentQuiz(quiz)
      setSelectedCategory(categoryId)
      setCurrentQuestion(0)
      setScore(0)
      setTimeLeft(30)
      setQuizCompleted(false)
    }
  }

  const handleAnswerSelect = (answerIndex) => {
    if (!showExplanation) {
      setSelectedAnswer(answerIndex)
    }
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null && timeLeft > 0) return
    
    const question = currentQuiz.questions[currentQuestion]
    const isCorrect = selectedAnswer === question.correct
    
    if (isCorrect) {
      setScore(score + currentQuiz.pointsPerQuestion)
    }
    
    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(30)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    setQuizCompleted(true)
    
    // Update user score
    const updatedUser = {
      ...user,
      quizScore: (user.quizScore || 0) + score,
      totalPoints: user.totalPoints + score
    }
    setUser(updatedUser)
    localStorage.setItem('civicUser', JSON.stringify(updatedUser))
    
    // Update leaderboard
    fetchLeaderboard()
  }

  const resetQuiz = () => {
    setCurrentQuiz(null)
    setSelectedCategory(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizCompleted(false)
  }

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  // Quiz Interface
  if (currentQuiz && !quizCompleted) {
    const question = currentQuiz.questions[currentQuestion]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Quiz Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{currentQuiz.title}</h1>
              <p className="text-gray-300">Question {currentQuestion + 1} of {currentQuiz.questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <Timer className="w-5 h-5" />
                <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
              <Badge className="bg-purple-600 text-white">
                Score: {score}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={(currentQuestion / currentQuiz.questions.length) * 100} className="mb-6" />

          {/* Question Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedAnswer === index
                        ? showExplanation
                          ? index === question.correct
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-red-500 bg-red-500/20'
                          : 'border-blue-500 bg-blue-500/20'
                        : showExplanation && index === question.correct
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center">
                      {showExplanation && index === question.correct && (
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                      )}
                      {showExplanation && selectedAnswer === index && index !== question.correct && (
                        <X className="w-5 h-5 text-red-400 mr-3" />
                      )}
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold mb-2 text-blue-300">Explanation:</h4>
                  <p className="text-gray-300">{question.explanation}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button onClick={resetQuiz} variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Exit Quiz
            </Button>
            
            {!showExplanation ? (
              <Button onClick={handleAnswerSubmit} disabled={selectedAnswer === null} className="bg-blue-600 hover:bg-blue-700">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="bg-green-600 hover:bg-green-700">
                {currentQuestion < currentQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Quiz Completed Screen
  if (quizCompleted) {
    const percentage = Math.round((score / (currentQuiz.questions.length * currentQuiz.pointsPerQuestion)) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-md w-full text-center">
          <CardHeader>
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">{score}</div>
              <p className="text-gray-300">Points Earned</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">{percentage}%</div>
                <p className="text-sm text-gray-400">Accuracy</p>
              </div>
              <div>
                <div className="text-xl font-bold text-white">{score > 20 ? 'Expert' : score > 10 ? 'Good' : 'Learning'}</div>
                <p className="text-sm text-gray-400">Performance</p>
              </div>
            </div>

            {score >= currentQuiz.questions.length * currentQuiz.pointsPerQuestion * 0.8 && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="font-semibold">New Badge!</span>
                </div>
                <p className="text-sm text-gray-300">Quiz Master - Score 80%+ on a quiz</p>
              </div>
            )}

            <div className="flex space-x-3">
              <Button onClick={resetQuiz} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Take Another Quiz
              </Button>
              <Button onClick={() => router.push('/dashboard')} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Quiz Categories Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.push('/dashboard')} variant="ghost" className="text-white hover:bg-white/10">
              ← Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-white">Civic Sense Quiz</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-purple-600 text-white">
              Quiz Score: {user.quizScore || 0}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Quiz Categories */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Challenge</h2>
              <p className="text-gray-300">Test your civic knowledge and earn points</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {quizCategories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Card key={category.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${category.color}/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <IconComponent className={`w-6 h-6 text-${category.color.split('-')[1]}-400`} />
                        </div>
                        <div>
                          <CardTitle className="text-white">{category.title}</CardTitle>
                          <p className="text-sm text-gray-400">{category.quizzes} quizzes available</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4">{category.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <BookOpen className="w-4 h-4" />
                          <span>{category.completed}/{category.quizzes} completed</span>
                        </div>
                        <Button 
                          onClick={() => startQuiz(category.id)}
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={!sampleQuizzes[category.id]}
                        >
                          {sampleQuizzes[category.id] ? 'Start Quiz' : 'Coming Soon'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quiz Leaderboard */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                  Quiz Leaders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.slice(0, 5).map((leader, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{leader.name}</div>
                        <div className="text-xs text-gray-400">{leader.level}</div>
                      </div>
                      <div className="text-sm font-bold">{leader.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Quizzes Taken</span>
                    <span className="font-bold">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Average Score</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Best Category</span>
                    <span className="font-bold">Environment</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}