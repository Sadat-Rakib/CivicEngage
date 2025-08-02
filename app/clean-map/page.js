'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MapPin, 
  Search, 
  Star, 
  Filter,
  Plus,
  Navigation,
  Accessible,
  Baby,
  Car,
  Clock,
  Users,
  Camera,
  Send,
  X
} from 'lucide-react'

// Mock map component (would use actual map library in production)
const MapView = ({ facilities, onFacilitySelect, userLocation }) => {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg relative overflow-hidden border border-white/20">
      {/* Mock map background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-4 w-8 h-8 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-12 right-8 w-6 h-6 bg-green-400 rounded-full"></div>
        <div className="absolute bottom-8 left-12 w-6 h-6 bg-yellow-400 rounded-full"></div>
        <div className="absolute bottom-16 right-16 w-6 h-6 bg-purple-400 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-red-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Map overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-blue-400" />
          <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
          <p className="text-gray-300 mb-4">Showing {facilities.length} public facilities nearby</p>
          <div className="flex flex-wrap justify-center gap-2">
            {facilities.slice(0, 3).map((facility, index) => (
              <button
                key={facility.id}
                onClick={() => onFacilitySelect(facility)}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 hover:bg-white/20 transition-all"
              >
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{facility.name}</span>
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="ml-1">{facility.rating}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User location indicator */}
      {userLocation && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Navigation className="w-4 h-4" />
            <span>Your Location</span>
          </div>
        </div>
      )}
    </div>
  )
}

const sampleFacilities = [
  {
    id: 1,
    name: 'Central Park Restroom',
    type: 'Public Restroom',
    rating: 4.2,
    reviewCount: 28,
    distance: '0.2 miles',
    accessibility: ['wheelchair', 'baby-changing'],
    facilities: ['soap', 'paper-towels', 'hand-dryer'],
    hours: '6:00 AM - 10:00 PM',
    lastCleaned: '2 hours ago',
    reviews: [
      {
        id: 1,
        user: 'Sarah M.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6124-af?w=50&h=50&fit=crop&crop=face',
        rating: 4,
        comment: 'Clean and well-maintained. Baby changing station works great!',
        date: '2 days ago',
        images: []
      },
      {
        id: 2,
        user: 'Mike Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        rating: 5,
        comment: 'Excellent facilities, always stocked with supplies.',
        date: '1 week ago',
        images: []
      }
    ]
  },
  {
    id: 2,
    name: 'Metro Station Facilities',
    type: 'Transit Restroom',
    rating: 3.8,
    reviewCount: 45,
    distance: '0.4 miles',
    accessibility: ['wheelchair'],
    facilities: ['soap', 'hand-dryer'],
    hours: '5:00 AM - 12:00 AM',
    lastCleaned: '4 hours ago',
    reviews: [
      {
        id: 3,
        user: 'Jennifer L.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        rating: 4,
        comment: 'Convenient location, could use more frequent cleaning.',
        date: '3 days ago',
        images: []
      }
    ]
  },
  {
    id: 3,
    name: 'Shopping Mall Restroom',
    type: 'Mall Facility',
    rating: 4.6,
    reviewCount: 67,
    distance: '0.6 miles',
    accessibility: ['wheelchair', 'baby-changing', 'family-room'],
    facilities: ['soap', 'paper-towels', 'hand-dryer', 'lotion'],
    hours: '10:00 AM - 9:00 PM',
    lastCleaned: '1 hour ago',
    reviews: []
  }
]

export default function CleanMap() {
  const [user, setUser] = useState(null)
  const [facilities, setFacilities] = useState(sampleFacilities)
  const [selectedFacility, setSelectedFacility] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAccessibility, setFilterAccessibility] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const router = useRouter()

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    images: []
  })

  // Add facility form state
  const [addForm, setAddForm] = useState({
    name: '',
    type: 'Public Restroom',
    location: '',
    accessibility: [],
    facilities: []
  })

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('civicUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      router.push('/auth/signin')
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Location error:', error)
        }
      )
    }
  }, [router])

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.type.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterAccessibility.length === 0 || 
                         filterAccessibility.every(filter => facility.accessibility.includes(filter))
    
    return matchesSearch && matchesFilter
  })

  const handleAddFacility = async () => {
    const newFacility = {
      id: facilities.length + 1,
      ...addForm,
      rating: 0,
      reviewCount: 0,
      distance: '0.1 miles',
      hours: '24/7',
      lastCleaned: 'Just added',
      reviews: []
    }

    setFacilities([...facilities, newFacility])
    
    // Award points for adding facility
    const updatedUser = {
      ...user,
      totalPoints: user.totalPoints + 15
    }
    setUser(updatedUser)
    localStorage.setItem('civicUser', JSON.stringify(updatedUser))
    
    alert('🎉 Facility added! You earned 15 points!')
    
    setAddForm({
      name: '',
      type: 'Public Restroom',
      location: '',
      accessibility: [],
      facilities: []
    })
    setShowAddForm(false)
  }

  const handleSubmitReview = async () => {
    if (!selectedFacility || !reviewForm.comment) return

    const newReview = {
      id: Date.now(),
      user: user.name,
      avatar: user.image,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: 'Just now',
      images: reviewForm.images
    }

    const updatedFacilities = facilities.map(facility => {
      if (facility.id === selectedFacility.id) {
        const updatedReviews = [...facility.reviews, newReview]
        const newRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length
        
        return {
          ...facility,
          reviews: updatedReviews,
          rating: Math.round(newRating * 10) / 10,
          reviewCount: updatedReviews.length
        }
      }
      return facility
    })

    setFacilities(updatedFacilities)
    setSelectedFacility(updatedFacilities.find(f => f.id === selectedFacility.id))

    // Award points for review
    const updatedUser = {
      ...user,
      totalPoints: user.totalPoints + 10
    }
    setUser(updatedUser)
    localStorage.setItem('civicUser', JSON.stringify(updatedUser))

    alert('🎉 Review submitted! You earned 10 points!')

    setReviewForm({
      rating: 5,
      comment: '',
      images: []
    })
    setShowReviewForm(false)
  }

  const accessibilityOptions = [
    { id: 'wheelchair', label: 'Wheelchair Accessible', icon: Accessible },
    { id: 'baby-changing', label: 'Baby Changing', icon: Baby },
    { id: 'family-room', label: 'Family Room', icon: Users },
    { id: 'parking', label: 'Parking Available', icon: Car }
  ]

  const facilityOptions = [
    'Soap Dispenser',
    'Paper Towels',
    'Hand Dryer',
    'Baby Changing Station',
    'Vending Machine',
    'Lotion Dispenser'
  ]

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button onClick={() => router.push('/dashboard')} variant="ghost" className="text-white hover:bg-white/10">
              ← Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-white">CleanMap</h1>
            <Badge className="bg-green-600 text-white">
              {filteredFacilities.length} facilities nearby
            </Badge>
          </div>
          
          <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Facility
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        
        {/* Search & Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search facilities..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filterAccessibility[0] || ''}
              onChange={(e) => setFilterAccessibility(e.target.value ? [e.target.value] : [])}
              className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
            >
              <option value="">All Accessibility</option>
              {accessibilityOptions.map(option => (
                <option key={option.id} value={option.id} className="bg-slate-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Map & Facility List */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Map */}
            <MapView 
              facilities={filteredFacilities} 
              onFacilitySelect={setSelectedFacility}
              userLocation={userLocation}
            />

            {/* Facility List */}
            <div className="space-y-4">
              {filteredFacilities.map((facility) => (
                <Card 
                  key={facility.id} 
                  className={`bg-white/10 backdrop-blur-md border-white/20 cursor-pointer transition-all hover:bg-white/15 ${
                    selectedFacility?.id === facility.id ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedFacility(facility)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-white text-lg">{facility.name}</h3>
                        <p className="text-gray-300 text-sm">{facility.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-semibold">{facility.rating}</span>
                          <span className="text-gray-400 text-sm">({facility.reviewCount})</span>
                        </div>
                        <p className="text-gray-400 text-sm">{facility.distance}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {facility.accessibility.map((feature) => {
                        const option = accessibilityOptions.find(opt => opt.id === feature)
                        if (!option) return null
                        const IconComponent = option.icon
                        return (
                          <Badge key={feature} className="bg-blue-500/20 text-blue-300">
                            <IconComponent className="w-3 h-3 mr-1" />
                            {option.label}
                          </Badge>
                        )
                      })}
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{facility.hours}</span>
                      </div>
                      <span>Cleaned {facility.lastCleaned}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Facility Details */}
          <div>
            {selectedFacility ? (
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white sticky top-6">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedFacility.name}</CardTitle>
                      <p className="text-gray-300">{selectedFacility.type}</p>
                    </div>
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Rating */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{selectedFacility.rating}</div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-5 h-5 ${star <= Math.round(selectedFacility.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm">{selectedFacility.reviewCount} reviews</p>
                  </div>

                  {/* Accessibility Features */}
                  <div>
                    <h4 className="font-semibold mb-3">Accessibility</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.accessibility.map((feature) => {
                        const option = accessibilityOptions.find(opt => opt.id === feature)
                        if (!option) return null
                        const IconComponent = option.icon
                        return (
                          <Badge key={feature} className="bg-green-500/20 text-green-300">
                            <IconComponent className="w-3 h-3 mr-1" />
                            {option.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <h4 className="font-semibold mb-3">Available Facilities</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedFacility.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="capitalize">{facility.replace('-', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  <div>
                    <h4 className="font-semibold mb-3">Recent Reviews</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedFacility.reviews.length > 0 ? (
                        selectedFacility.reviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="border-b border-white/10 pb-3 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={review.avatar} />
                                <AvatarFallback>{review.user[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-semibold text-sm">{review.user}</span>
                                  <div className="flex space-x-1">
                                    {[1,2,3,4,5].map((star) => (
                                      <Star 
                                        key={star} 
                                        className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-gray-300 text-sm">{review.comment}</p>
                                <p className="text-gray-500 text-xs mt-1">{review.date}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Select a Facility</h3>
                  <p className="text-gray-300">Click on a facility from the list or map to view details and reviews.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Add Facility Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Add New Facility</CardTitle>
                <Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Facility Name</Label>
                <Input
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g., Central Park Restroom"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <Label>Type</Label>
                <select
                  value={addForm.type}
                  onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
                  className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                >
                  <option value="Public Restroom" className="bg-slate-800">Public Restroom</option>
                  <option value="Mall Facility" className="bg-slate-800">Mall Facility</option>
                  <option value="Transit Restroom" className="bg-slate-800">Transit Restroom</option>
                  <option value="Park Facility" className="bg-slate-800">Park Facility</option>
                </select>
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  value={addForm.location}
                  onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                  placeholder="Address or coordinates"
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleAddFacility} className="flex-1 bg-green-600 hover:bg-green-700">
                  Add Facility (+15 pts)
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Review Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Write a Review</CardTitle>
                <Button onClick={() => setShowReviewForm(false)} variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex space-x-1 mt-2">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'} hover:text-yellow-300 transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Your Review</Label>
                <Textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..."
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  rows={4}
                />
              </div>

              <div className="flex space-x-3">
                <Button onClick={handleSubmitReview} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review (+10 pts)
                </Button>
                <Button onClick={() => setShowReviewForm(false)} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}