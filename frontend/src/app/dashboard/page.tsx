import DashboardLayout from '@/layout/DashboardLayout'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Bell, 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  Stethoscope,
  Building2,
  Plus,
  Filter
} from 'lucide-react'

export default function Dashboard() {
  // Mock data - in real app this would come from API
  const user = {
    name: "Ashish Kumar Verma",
    avatar: "AK"
  }

  const appointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      hospital: "City General Hospital",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "confirmed"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatology",
      hospital: "Metro Medical Center",
      date: "2024-01-18",
      time: "2:30 PM",
      status: "pending"
    }
  ]

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      hospital: "City General Hospital",
      rating: 4.8,
      experience: "15 years"
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dermatology",
      hospital: "Metro Medical Center", 
      rating: 4.6,
      experience: "12 years"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrics",
      hospital: "Children's Hospital",
      rating: 4.9,
      experience: "18 years"
    }
  ]

  const notifications = [
    {
      id: 1,
      message: "Your appointment with Dr. Johnson has been confirmed",
      time: "2 hours ago",
      type: "appointment"
    },
    {
      id: 2,
      message: "New doctor available in Neurology department",
      time: "1 day ago",
      type: "update"
    }
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Greeting Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {getGreeting()}, {user.name.split(' ')[0]}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Welcome back to your health dashboard
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {user.avatar}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Calendar & Appointments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search for doctors, specialties, or hospitals..."
                      className="pl-10 pr-4 py-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Section */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Your Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{appointment.hospital}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-sm font-medium">{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{appointment.time}</span>
                        </div>
                        <Badge 
                          variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                          className={appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-2" />
                    Book New Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-gray-700 mb-1">{notification.message}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doctors & Hospitals History */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Recent Doctors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctors.map((doctor) => (
                    <div key={doctor.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-900">{doctor.name}</h4>
                          <p className="text-xs text-gray-600">{doctor.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Building2 className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{doctor.hospital}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-yellow-600">★</span>
                            <span className="text-xs text-gray-600">{doctor.rating}</span>
                          </div>
                          <p className="text-xs text-gray-500">{doctor.experience}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
