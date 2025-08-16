"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/constants/apiUtils';

interface AvailabilitySlot {
  availability_uuid?: string;
  day_of_week: string;
  day_name: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface PractitionerAvailabilityComponentProps {
  practitioner_uuid?: string;
  initialAvailability?: AvailabilitySlot[];
  onAvailabilityChange?: (availability: AvailabilitySlot[]) => void;
  isEditMode?: boolean;
}

const DAYS_OF_WEEK = [
  { value: 'MONDAY', label: 'Monday' },
  { value: 'TUESDAY', label: 'Tuesday' },
  { value: 'WEDNESDAY', label: 'Wednesday' },
  { value: 'THURSDAY', label: 'Thursday' },
  { value: 'FRIDAY', label: 'Friday' },
  { value: 'SATURDAY', label: 'Saturday' },
  { value: 'SUNDAY', label: 'Sunday' },
];

const TIME_OPTIONS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30'
];

export default function PractitionerAvailabilityComponent({
  practitioner_uuid,
  initialAvailability = [],
  onAvailabilityChange,
  isEditMode = false
}: PractitionerAvailabilityComponentProps) {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(initialAvailability);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSlot, setNewSlot] = useState({
    day_of_week: 'MONDAY',
    start_time: '09:00',
    end_time: '10:00'
  });

  // Load existing availability when editing
  useEffect(() => {
    if (isEditMode && practitioner_uuid) {
      loadExistingAvailability();
    }
  }, [isEditMode, practitioner_uuid]);

  const loadExistingAvailability = async () => {
    if (!practitioner_uuid) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("Authentication token not found");

      const { data } = await axiosInstance.get(
        `/practice/practitioners/${practitioner_uuid}/availability`,
        { params: { user_token: token } }
      );

      if (data.availability_slots) {
        setAvailability(data.availability_slots);
        onAvailabilityChange?.(data.availability_slots);
      }
    } catch (err: any) {
      console.error('Error loading availability:', err);
      setError(err.response?.data?.detail || err.message || "Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  const addSlot = () => {
    if (!newSlot.start_time || !newSlot.end_time) {
      setError("Please select both start and end times");
      return;
    }

    if (newSlot.start_time >= newSlot.end_time) {
      setError("Start time must be before end time");
      return;
    }

    // Check for overlapping slots on the same day
    const overlappingSlot = availability.find(slot => 
      slot.day_of_week === newSlot.day_of_week &&
      slot.is_active &&
      ((newSlot.start_time < slot.end_time && newSlot.end_time > slot.start_time))
    );

    if (overlappingSlot) {
      setError("This time slot overlaps with an existing slot");
      return;
    }

    const newAvailabilitySlot: AvailabilitySlot = {
      day_of_week: newSlot.day_of_week,
      day_name: DAYS_OF_WEEK.find(day => day.value === newSlot.day_of_week)?.label || '',
      start_time: newSlot.start_time,
      end_time: newSlot.end_time,
      is_active: true
    };

    const updatedAvailability = [...availability, newAvailabilitySlot];
    setAvailability(updatedAvailability);
    onAvailabilityChange?.(updatedAvailability);
    
    // Reset form
    setNewSlot({
      day_of_week: 'MONDAY',
      start_time: '09:00',
      end_time: '10:00'
    });
    setError(null);
  };

  const removeSlot = (index: number) => {
    const updatedAvailability = availability.filter((_, i) => i !== index);
    setAvailability(updatedAvailability);
    onAvailabilityChange?.(updatedAvailability);
  };

  const toggleSlotActive = (index: number) => {
    const updatedAvailability = [...availability];
    updatedAvailability[index].is_active = !updatedAvailability[index].is_active;
    setAvailability(updatedAvailability);
    onAvailabilityChange?.(updatedAvailability);
  };

  const saveAvailability = async () => {
    if (!practitioner_uuid) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("Authentication token not found");

      // For each active slot, create it via API
      for (const slot of availability.filter(s => s.is_active)) {
        if (!slot.availability_uuid) {
          // Create new slot
          await axiosInstance.post(
            `/practice/practitioners/${practitioner_uuid}/availability`,
            {
              day_of_week: slot.day_of_week,
              start_time: slot.start_time,
              end_time: slot.end_time
            },
            { params: { user_token: token } }
          );
        }
      }

      // Reload availability to get UUIDs
      await loadExistingAvailability();
      
    } catch (err: any) {
      console.error('Error saving availability:', err);
      setError(err.response?.data?.detail || err.message || "Failed to save availability");
    } finally {
      setLoading(false);
    }
  };

  const getSlotsForDay = (dayValue: string) => {
    return availability.filter(slot => slot.day_of_week === dayValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Availability Schedule</span>
          {isEditMode && (
            <Button
              onClick={saveAvailability}
              disabled={loading}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Saving...' : 'Save Availability'}
            </Button>
          )}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Set the practitioner's weekly availability schedule
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Add New Slot Form */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Add New Time Slot</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Label htmlFor="day-select">Day</Label>
              <Select
                value={newSlot.day_of_week}
                onValueChange={(value) => setNewSlot(prev => ({ ...prev, day_of_week: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Select
                value={newSlot.start_time}
                onValueChange={(value) => setNewSlot(prev => ({ ...prev, start_time: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Select
                value={newSlot.end_time}
                onValueChange={(value) => setNewSlot(prev => ({ ...prev, end_time: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={addSlot} className="w-full">
                Add Slot
              </Button>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Display */}
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => {
            const daySlots = getSlotsForDay(day.value);
            return (
              <div key={day.value} className="border rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">{day.label}</h5>
                
                {daySlots.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No availability set</p>
                ) : (
                  <div className="space-y-2">
                    {daySlots.map((slot, index) => {
                      const globalIndex = availability.findIndex(s => 
                        s.day_of_week === slot.day_of_week && 
                        s.start_time === slot.start_time && 
                        s.end_time === slot.end_time
                      );
                      
                      return (
                        <div
                          key={`${slot.day_of_week}-${slot.start_time}-${slot.end_time}`}
                          className={`flex items-center justify-between p-3 rounded-md border ${
                            slot.is_active ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Badge variant={slot.is_active ? "default" : "secondary"}>
                              {slot.start_time} - {slot.end_time}
                            </Badge>
                            {!slot.is_active && (
                              <span className="text-sm text-gray-500">(Inactive)</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSlotActive(globalIndex)}
                            >
                              {slot.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSlot(globalIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
