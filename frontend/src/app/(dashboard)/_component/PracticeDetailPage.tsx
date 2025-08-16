"use client";

import DashboardLayout from '@/layout/DashboardLayout'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import usePractice from '../practices/_hooks/usePractice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPinIcon, PhoneIcon, ClockIcon, GlobeIcon, UserIcon, LanguagesIcon, HeartIcon, CheckCircleIcon, CalendarIcon } from "lucide-react"

export default function PracticeDetailPage() {

    const { id } = useParams();
    console.log(id);

    const { currentPractice, loading, error, getCurrentPractice, getCurrentPractitioners, currentPractitioners } = usePractice();
    
    useEffect(() => {
        getCurrentPractice(Number(id));
        getCurrentPractitioners(Number(id));
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-blue-600 text-lg">Loading practice details...</div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !currentPractice) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-red-600 text-lg">Error loading practice details</div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Practice Header */}
                <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-xl border border-blue-100 shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-start space-x-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-3xl">
                                    {currentPractice.practice_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentPractice.practice_name}</h1>
                                <p className="text-xl text-blue-600 font-medium mb-4">
                                    {currentPractice.practice_associated_with}
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center space-x-3 text-gray-600">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <PhoneIcon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Phone</p>
                                            <p className="text-sm">{currentPractice.phone_number}</p>
                                        </div>
                                    </div>
                                    
                                    {currentPractice.practice_website && (
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <GlobeIcon className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Website</p>
                                                <p className="text-sm truncate">{currentPractice.practice_website}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {currentPractice.opening_hours && (
                                        <div className="flex items-center space-x-3 text-gray-600">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <ClockIcon className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Opening Hours</p>
                                                <p className="text-sm">Opens at {currentPractice.opening_hours.start}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {currentPractice.wheel_chair_access && (
                                    <div className="mt-4">
                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                                            Wheelchair Accessible
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Practice */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                                <CardTitle className="text-2xl text-gray-900">About the Practice</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-gray-700 leading-relaxed text-lg mb-6">{currentPractice.about_practice}</p>
                                
                                {/* Facilities */}
                                {currentPractice.facilities && currentPractice.facilities.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Facilities Available</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {currentPractice.facilities.map((facility: string, index: number) => (
                                                <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                    <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                                    <span className="text-blue-800 font-medium text-sm">{facility}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Practitioners */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                                <CardTitle className="text-2xl text-gray-900">Our Healthcare Professionals</CardTitle>
                                <CardDescription className="text-lg">
                                    Meet our qualified team of {currentPractitioners?.length || 0} practitioners
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {currentPractitioners && currentPractitioners.length > 0 ? (
                                    currentPractitioners.map((practitioner: any) => (
                                        <div key={practitioner.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                                            <div className="flex items-start space-x-6">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                                    <UserIcon className="h-10 w-10 text-blue-600" />
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{practitioner.display_name}</h3>
                                                            <p className="text-lg text-blue-600 font-semibold mb-2">{practitioner.profession}</p>
                                                            {practitioner.gender && (
                                                                <Badge variant="outline" className="border-gray-300 text-gray-700">
                                                                    {practitioner.gender}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                                            Book Appointment
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                        {practitioner.qualifications && (
                                                            <div className="space-y-2">
                                                                <p className="font-semibold text-gray-900 flex items-center">
                                                                    Qualifications
                                                                </p>
                                                                <p className="text-gray-700 text-sm leading-relaxed">{practitioner.qualifications}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {practitioner.education && (
                                                            <div className="space-y-2">
                                                                <p className="font-semibold text-gray-900 flex items-center">
                                                                    Education
                                                                </p>
                                                                <p className="text-gray-700 text-sm leading-relaxed">{practitioner.education}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {practitioner.languages_spoken && (
                                                            <div className="space-y-2">
                                                                <p className="font-semibold text-gray-900 flex items-center">
                                                                    <LanguagesIcon className="h-4 w-4 text-blue-600 mr-2" />
                                                                    Languages
                                                                </p>
                                                                <p className="text-gray-700 text-sm">{practitioner.languages_spoken}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {practitioner.professional_statement && (
                                                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
                                                            <p className="text-gray-700 leading-relaxed italic">{practitioner.professional_statement}</p>
                                                        </div>
                                                    )}

                                                    {/* Areas of Interest */}
                                                    {practitioner.professional_areas_of_interest && (
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                                <HeartIcon className="h-5 w-5 text-blue-600 mr-2" />
                                                                Areas of Expertise
                                                            </h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.entries(practitioner.professional_areas_of_interest)
                                                                    .filter(([_, value]) => value === true)
                                                                    .map(([area, _]) => (
                                                                        <Badge key={area} className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 px-3 py-1">
                                                                            {area}
                                                                        </Badge>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <UserIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 text-lg">No practitioners found for this practice.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg sticky top-6">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                                <CardTitle className="text-lg text-blue-900">Quick Info</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-1">
                                        {currentPractitioners?.length || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Healthcare Professionals</div>
                                </div>
                                
                                {currentPractice.wheel_chair_access && (
                                    <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                                        <CheckCircleIcon className="h-5 w-5" />
                                        <span className="text-sm font-medium">Wheelchair Accessible</span>
                                    </div>
                                )}
                                
                                <div className="pt-4 border-t">
                                    <p className="text-xs text-gray-500 text-center">
                                        To book an appointment, click the "Book Appointment" button next to your preferred practitioner above.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
