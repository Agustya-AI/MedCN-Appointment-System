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
      <div className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Greeting Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-light text-slate-800 mb-2">
              {getGreeting()}, <span className="font-medium text-blue-700">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-lg text-slate-600 font-light">
              Welcome back to your health dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Search Bar */}
              <Card className="border-0 shadow-sm bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <Input 
                        placeholder="Search for doctors, specialties, or hospitals..."
                        className="pl-12 pr-4 py-3 border-slate-200 focus:border-blue-400 text-base bg-slate-50 focus:bg-white transition-colors"
                      />
                    </div>
                    <Button variant="outline" className="px-6 py-3 border-blue-200 text-blue-700 hover:bg-blue-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Appointments Section */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-medium text-slate-800 flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    Your Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-6 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors bg-slate-50/50 hover:bg-blue-50/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                              <Stethoscope className="h-7 w-7 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-slate-800 mb-1">{appointment.doctor}</h3>
                              <p className="text-blue-600 mb-2 font-medium">{appointment.specialty}</p>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <span className="text-sm text-slate-500">{appointment.hospital}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-700">{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span className="text-sm text-slate-600">{appointment.time}</span>
                            </div>
                            <Badge 
                              variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                              className={`${
                                appointment.status === 'confirmed' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              } font-medium`}
                            >
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full h-16 border-dashed border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50 text-blue-700"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Book New Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              {/* User Profile Card */}
              <Card className="border-0 shadow-sm bg-white border-t-4 border-t-blue-500">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-medium text-blue-700 mx-auto mb-4">
                    {user.avatar}
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-1">{user.name}</h3>
                  <p className="text-sm text-blue-600">Patient ID: #12345</p>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-3">
                    <Bell className="h-5 w-5 text-orange-500" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-300">
                        <p className="text-sm text-slate-700 mb-2 leading-relaxed">{notification.message}</p>
                        <span className="text-xs text-orange-600 font-medium">{notification.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Doctors */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-slate-800 flex items-center gap-3">
                    <User className="h-5 w-5 text-purple-500" />
                    Recent Doctors
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div key={doctor.id} className="p-4 border border-slate-100 rounded-lg hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 mb-1 truncate">{doctor.name}</h4>
                            <p className="text-sm text-purple-600 font-medium mb-1">{doctor.specialty}</p>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3 w-3 text-slate-400 flex-shrink-0" />
                              <span className="text-xs text-slate-500 truncate">{doctor.hospital}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-sm text-amber-500">★</span>
                              <span className="text-sm font-medium text-slate-700">{doctor.rating}</span>
                            </div>
                            <p className="text-xs text-slate-500">{doctor.experience}</p>
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
      </div>
    </DashboardLayout>
  )
}
