'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Chrome, Mail, User, Sparkles, CheckCircle, Star, Zap } from 'lucide-react'

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/onboarding' })
    } catch (error) {
      console.error('Sign up error:', error)
    }
    setIsLoading(false)
  }

  const handleEmailSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signIn('email', { 
        email: formData.email, 
        callbackUrl: '/onboarding' 
      })
    } catch (error) {
      console.error('Email sign up error:', error)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Benefits */}
        <div className="text-center lg:text-left space-y-8">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Join CivicEngage
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Start making a difference in your community today
            </p>
          </div>

          {/* Benefits List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="text-gray-300">Report civic issues and earn instant rewards</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <span className="text-gray-300">Unlock badges and climb community leaderboards</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-blue-400 flex-shrink-0" />
              <span className="text-gray-300">Take civic quizzes and expand your knowledge</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
              <span className="text-gray-300">Discover public facilities with community reviews</span>
            </div>
          </div>

          {/* What You Get */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">What you get as a member:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">25+</div>
                <div className="text-sm text-gray-400">Points per Report</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">15+</div>
                <div className="text-sm text-gray-400">Badge Types</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">100+</div>
                <div className="text-sm text-gray-400">Civic Quizzes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">Free</div>
                <div className="text-sm text-gray-400">Forever</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Create Account</CardTitle>
              <p className="text-gray-300">Join thousands of engaged citizens</p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Google Sign Up */}
              <Button
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 flex items-center justify-center space-x-2"
              >
                <Chrome className="w-5 h-5" />
                <span>Sign up with Google</span>
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-gray-400">Or sign up with email</span>
                </div>
              </div>

              {/* Email Sign Up */}
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Account
                </Button>
              </form>

              <div className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <button 
                  onClick={() => router.push('/auth/signin')}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Sign in
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                By signing up, you agree to our{' '}
                <span className="text-blue-400">Terms of Service</span>
                {' '}and{' '}
                <span className="text-blue-400">Privacy Policy</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}