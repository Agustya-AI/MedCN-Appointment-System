"use client";

import { useState, useEffect, useRef } from "react";

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

interface TimingsData {
    opening_hours?: OpeningHours;
    exceptions?: Exception[];
    alert_message?: string;
}

interface TimingsComponentProps {
    initialData?: TimingsData;
    onChange?: (data: TimingsData) => void;
}

export function TimingsOfHospitalComponent({ 
    initialData = {}, 
    onChange 
}: TimingsComponentProps) {
    const defaultOpeningHours: OpeningHours = {
        monday: { enabled: true, slots: [{ startTime: '08:00', endTime: '17:00' }] },
        tuesday: { enabled: true, slots: [{ startTime: '08:00', endTime: '17:00' }] },
        wednesday: { enabled: true, slots: [{ startTime: '08:00', endTime: '17:00' }] },
        thursday: { enabled: true, slots: [{ startTime: '08:00', endTime: '17:00' }] },
        friday: { enabled: true, slots: [{ startTime: '08:00', endTime: '17:00' }] },
        saturday: { enabled: false, slots: [] },
        sunday: { enabled: false, slots: [] }
    };

    const [openingHours, setOpeningHours] = useState<OpeningHours>(
        initialData.opening_hours || defaultOpeningHours
    );
    const [exceptions, setExceptions] = useState<Exception[]>(initialData.exceptions || []);
    const [alertMessage, setAlertMessage] = useState<string>(
        initialData.alert_message || 'We still bulk bill patients with Valid Healthcare card, Pension card, Ages below 16 or above 65yrs. Please check with reception when you check in for the fees. Thanks for your cooperation.\nAs of 1 July 2023, We are a mixed billing Clinic, fee applies to all services...'
    );

    // Use ref to track if component is initializing
    const isInitializing = useRef(true);
    const prevInitialDataRef = useRef(initialData);

    // Only update local state if initialData actually changed (deep comparison of keys)
    useEffect(() => {
        const hasChanged = 
            prevInitialDataRef.current.opening_hours !== initialData.opening_hours ||
            prevInitialDataRef.current.exceptions !== initialData.exceptions ||
            prevInitialDataRef.current.alert_message !== initialData.alert_message;

        if (hasChanged) {
            isInitializing.current = true;
            setOpeningHours(initialData.opening_hours || defaultOpeningHours);
            setExceptions(initialData.exceptions || []);
            setAlertMessage(initialData.alert_message || '');
            prevInitialDataRef.current = initialData;
        }
    }, [initialData.opening_hours, initialData.exceptions, initialData.alert_message]);

    // Call onChange only after initialization and when user makes changes
    useEffect(() => {
        if (isInitializing.current) {
            isInitializing.current = false;
            return;
        }

        onChange?.({
            opening_hours: openingHours,
            exceptions,
            alert_message: alertMessage
        });
    }, [openingHours, exceptions, alertMessage, onChange]);

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