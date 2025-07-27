"use client";

import React, { useState } from 'react'
import AdminPortalLayout from '../../_components/AdminPortalLayout'



function PracticeProfileComponent() {


    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);


    return (
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Practice Details */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Practice Profile</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Practice Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter practice name"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter phone number"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Website</label>
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Enter website URL"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Accreditation</label>
                                <select className="w-full px-3 py-2 border rounded-md">
                                    <option>Please choose accreditation body</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Social Media Links</label>
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 border rounded-md mb-2"
                                    placeholder="Facebook URL"
                                />
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Twitter URL"
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column - Image Upload & About */}
                <div className="space-y-6">



                    <div>
                        <label className="text-sm font-medium">Facilities</label>
                        <div className="relative">
                            <select
                                className="w-full px-3 py-2 border rounded-md"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        // Add new facility chip
                                        const newFacility = e.target.value;
                                        setSelectedFacilities(prev => [...prev, newFacility]);
                                        e.target.value = ''; // Reset select
                                    }
                                }}
                            >
                                <option value="">Select a facility</option>
                                <option value="Onsite Pathology">Onsite Pathology</option>
                                <option value="Onsite Allied Health">Onsite Allied Health</option>
                                <option value="Onsite Radiology">Onsite Radiology</option>
                                <option value="Onsite Pharmacy">Onsite Pharmacy</option>
                                <option value="Pathology Nearby">Pathology Nearby</option>
                                <option value="Allied Health Nearby">Allied Health Nearby</option>
                                <option value="Radiology Nearby">Radiology Nearby</option>
                                <option value="Pharmacy Nearby">Pharmacy Nearby</option>
                            </select>

                            <div className="mt-2 flex flex-wrap gap-2">
                                {selectedFacilities?.map((facility, index) => (
                                    <div key={index} className="inline-flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                                        <span>{facility}</span>
                                        <button
                                            className="ml-1 hover:text-blue-900"
                                            onClick={() => {
                                                setSelectedFacilities(prev =>
                                                    prev.filter((_, i) => i !== index)
                                                );
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div>
                        <label className="text-sm font-medium">About your Practice</label>
                        <textarea
                            className="w-full px-3 py-2 border rounded-md h-32"
                            placeholder="Enter description about your practice"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Facilities</label>
                        <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" />
                                <span>Wheelchair Access</span>
                            </label>
                            {/* Add more facility checkboxes as needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


function TimingsOfHospitalComponent() {
    type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    
    type TimeSlot = {
        startTime: string;
        endTime: string;
    };
    
    type DayData = {
        enabled: boolean;
        slots: TimeSlot[];
    };
    
    type OpeningHours = Record<DayKey, DayData>;
    
    type Exception = {
        date: string;
        reason: string;
    };

    const [openingHours, setOpeningHours] = useState<OpeningHours>({
        monday: {
            enabled: true,
            slots: [
                { startTime: '07:30', endTime: '17:00' },
                { startTime: '18:00', endTime: '21:00' }
            ]
        },
        tuesday: {
            enabled: true,
            slots: [
                { startTime: '08:00', endTime: '17:00' }
            ]
        },
        wednesday: {
            enabled: true,
            slots: [
                { startTime: '08:00', endTime: '17:00' }
            ]
        },
        thursday: {
            enabled: true,
            slots: [
                { startTime: '08:00', endTime: '17:00' }
            ]
        },
        friday: {
            enabled: true,
            slots: [
                { startTime: '07:30', endTime: '17:00' }
            ]
        },
        saturday: {
            enabled: false,
            slots: []
        },
        sunday: {
            enabled: false,
            slots: []
        }
    });

    const [exceptions, setExceptions] = useState<Exception[]>([]);
    const [alertMessage, setAlertMessage] = useState<string>('We still bulk bill patients with Valid Healthcare card, Pension card, Ages below 16 or above 65yrs. Please check with reception when you check in for the fees. Thanks for your cooperation.\nAs of 1 July 2023, We are a mixed billing Clinic, fee applies to all services...');

    const dayNames: Record<DayKey, string> = {
        monday: 'Monday',
        tuesday: 'Tuesday', 
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
    };

    const toggleDay = (day: DayKey) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                enabled: !prev[day].enabled
            }
        }));
    };

    const addTimeSlot = (day: DayKey) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: [...prev[day].slots, { startTime: '08:00', endTime: '17:00' }]
            }
        }));
    };

    const removeTimeSlot = (day: DayKey, slotIndex: number) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: prev[day].slots.filter((_, index) => index !== slotIndex)
            }
        }));
    };

    const updateTimeSlot = (day: DayKey, slotIndex: number, field: keyof TimeSlot, value: string) => {
        setOpeningHours(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                slots: prev[day].slots.map((slot, index) => 
                    index === slotIndex ? { ...slot, [field]: value } : slot
                )
            }
        }));
    };

    const addException = () => {
        setExceptions(prev => [...prev, { date: '', reason: 'Holiday' }]);
    };

    const removeException = (index: number) => {
        setExceptions(prev => prev.filter((_, i) => i !== index));
    };

    const updateException = (index: number, field: keyof Exception, value: string) => {
        setExceptions(prev => prev.map((exception, i) => 
            i === index ? { ...exception, [field]: value } : exception
        ));
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Opening Hours Section */}
            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-6">Opening Hours</h2>
                <div className="space-y-4">
                    {Object.entries(openingHours).map(([day, dayData]) => (
                        <div key={day} className="flex items-center gap-4">
                            {/* Day checkbox and name */}
                            <div className="flex items-center gap-2 w-24">
                                <input
                                    type="checkbox"
                                    checked={dayData.enabled}
                                    onChange={() => toggleDay(day as DayKey)}
                                    className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {dayNames[day as DayKey]}
                                </span>
                            </div>

                            {/* Time slots or Closed */}
                            <div className="flex-1">
                                {dayData.enabled ? (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {dayData.slots.map((slot, slotIndex) => (
                                            <div key={slotIndex} className="flex items-center gap-2">
                                                <input
                                                    type="time"
                                                    value={slot.startTime}
                                                    onChange={(e) => updateTimeSlot(day as DayKey, slotIndex, 'startTime', e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                                                />
                                                <span className="text-gray-500 text-sm">to</span>
                                                <input
                                                    type="time"
                                                    value={slot.endTime}
                                                    onChange={(e) => updateTimeSlot(day as DayKey, slotIndex, 'endTime', e.target.value)}
                                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                                                />
                                                <button
                                                    onClick={() => removeTimeSlot(day as DayKey, slotIndex)}
                                                    className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 text-sm"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addTimeSlot(day as DayKey)}
                                            className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 text-sm font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <span className="text-gray-500 text-sm">Closed</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exceptions Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Exceptions</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Add Public Holiday closures or any other exception to your clinic's opening hours.
                </p>
                
                <div className="space-y-3">
                    {exceptions.map((exception, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <input
                                type="date"
                                value={exception.date}
                                onChange={(e) => updateException(index, 'date', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="text"
                                value={exception.reason}
                                onChange={(e) => updateException(index, 'reason', e.target.value)}
                                placeholder="Reason for closure"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                onClick={() => removeException(index)}
                                className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addException}
                    className="mt-3 px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-md hover:bg-green-100 flex items-center gap-2"
                >
                    <span className="text-lg">+</span>
                    Add exception
                </button>
            </div>

            {/* Alert Message Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Alert Message</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Display a short message about any important changes at your practice (e.g. a new policy, temporary closure or holidays).
                </p>
                <textarea
                    value={alertMessage}
                    onChange={(e) => setAlertMessage(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md h-32 text-sm resize-none"
                    placeholder="Enter your alert message here..."
                />
            </div>
        </div>
    );
}




export default function page() {
    return (
        <AdminPortalLayout>
            <div className="bg-white rounded-xl">
                <PracticeProfileComponent />
                <hr className="my-8 border-gray-200" />
                <TimingsOfHospitalComponent />
            </div>
        </AdminPortalLayout>
    )
}
