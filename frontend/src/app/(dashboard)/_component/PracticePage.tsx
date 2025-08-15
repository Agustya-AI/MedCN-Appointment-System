
"use client";

import DashboardLayout from '@/layout/DashboardLayout'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon, MapPinIcon, ClockIcon, StarIcon, PhoneIcon, MailIcon } from "lucide-react"

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  openingHours: string;
  gender: string;
  phone: string;
  email: string;
  image: string;
  isTopRated: boolean;
}

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    experience: "15 years",
    location: "New York Medical Center",
    openingHours: "9:00 AM - 6:00 PM",
    gender: "Female",
    phone: "+1 (555) 123-4567",
    email: "sarah.johnson@email.com",
    image: "/api/placeholder/100/100",
    isTopRated: true
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    rating: 4.8,
    experience: "12 years",
    location: "Central Hospital",
    openingHours: "8:00 AM - 5:00 PM",
    gender: "Male",
    phone: "+1 (555) 234-5678",
    email: "michael.chen@email.com",
    image: "/api/placeholder/100/100",
    isTopRated: true
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    rating: 4.7,
    experience: "10 years",
    location: "Children's Medical Center",
    openingHours: "10:00 AM - 7:00 PM",
    gender: "Female",
    phone: "+1 (555) 345-6789",
    email: "emily.rodriguez@email.com",
    image: "/api/placeholder/100/100",
    isTopRated: false
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgeon",
    rating: 4.6,
    experience: "18 years",
    location: "Sports Medicine Clinic",
    openingHours: "7:00 AM - 4:00 PM",
    gender: "Male",
    phone: "+1 (555) 456-7890",
    email: "james.wilson@email.com",
    image: "/api/placeholder/100/100",
    isTopRated: true
  }
];

export default function PracticePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedHours, setSelectedHours] = useState("");

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = !selectedGender || doctor.gender === selectedGender;
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesGender && matchesSpecialty;
  });

  const topDoctors = mockDoctors.filter(doctor => doctor.isTopRated);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Find Medical Practices</h1>
          <p className="text-gray-600">Search and connect with healthcare professionals near you</p>
        </div>

        {/* Search Section */}
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="text-blue-900">Search Doctors</CardTitle>
            <CardDescription className="text-blue-700">
              Use filters to find the perfect healthcare provider for your needs
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search doctors or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-500"
                />
              </div>

              {/* Gender Filter */}
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>

              {/* Specialty Filter */}
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  <SelectItem value="Cardiologist">Cardiologist</SelectItem>
                  <SelectItem value="Neurologist">Neurologist</SelectItem>
                  <SelectItem value="Pediatrician">Pediatrician</SelectItem>
                  <SelectItem value="Orthopedic Surgeon">Orthopedic Surgeon</SelectItem>
                </SelectContent>
              </Select>

              {/* Opening Hours Filter */}
              <Select value={selectedHours} onValueChange={setSelectedHours}>
                <SelectTrigger className="border-blue-200 focus:border-blue-500">
                  <SelectValue placeholder="Opening Hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Hours</SelectItem>
                  <SelectItem value="morning">Morning (7AM-12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM-6PM)</SelectItem>
                  <SelectItem value="evening">Evening (6PM-9PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Results */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Search Results ({filteredDoctors.length} doctors found)
            </h2>
            
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                          <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium ml-1">{doctor.rating}</span>
                            </div>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                              {doctor.experience} experience
                            </Badge>
                          </div>
                        </div>
                        
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Book Appointment
                        </Button>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4 text-blue-500" />
                          <span>{doctor.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="h-4 w-4 text-blue-500" />
                          <span>{doctor.openingHours}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PhoneIcon className="h-4 w-4 text-blue-500" />
                          <span>{doctor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MailIcon className="h-4 w-4 text-blue-500" />
                          <span>{doctor.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top Doctors Sidebar */}
          <div className="space-y-4">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r ">
                <CardTitle className="flex items-center space-x-2">
                  <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>Top Rated Doctors</span>
                </CardTitle>
                <CardDescription className="">
                  Highly recommended healthcare professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {topDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-semibold text-sm">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{doctor.name}</h4>
                      <p className="text-xs text-blue-600">{doctor.specialty}</p>
                      <div className="flex items-center mt-1">
                        <StarIcon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium ml-1">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Doctors</span>
                  <span className="font-semibold text-blue-600">{mockDoctors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialties</span>
                  <span className="font-semibold text-blue-600">15+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold text-blue-600">4.7★</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
