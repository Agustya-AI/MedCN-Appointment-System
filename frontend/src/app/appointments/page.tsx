'use client'

import React, { useState, useEffect } from 'react'
import appAPI from '@/utils/apiUtils'

interface Doctor {
  id: number
  name: string
  email: string
  specialty: string
  phone_number: string
}

interface AvailabilitySlot {
  id: number
  date: string
  start_time: string
  end_time: string
  is_booked: boolean
}

interface BookingData {
  consultation_type: string
  name: string
  email: string
  phone_number: string
  message: string
  doctor_id: number
  slot_id: number | null
}

export default function AppointmentsPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [bookingData, setBookingData] = useState<BookingData>({
    consultation_type: '',
    name: '',
    email: '',
    phone_number: '',
    message: '',
    doctor_id: 0,
    slot_id: null
  })

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await appAPI.get('/booking/doctors')
      setDoctors(response.data)
    } catch (err) {
      setError('Failed to fetch doctors')
      console.error('Error fetching doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailability = async (doctorId: number) => {
    try {
      setLoading(true)
      const response = await appAPI.get(`/booking/doctors/${doctorId}/availability`)
      setAvailableSlots(response.data)
    } catch (err) {
      setError('Failed to fetch availability')
      console.error('Error fetching availability:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDoctorSelect = async (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setBookingData(prev => ({ ...prev, doctor_id: doctor.id }))
    await fetchAvailability(doctor.id)
    setCurrentStep(2)
  }

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot)
    setBookingData(prev => ({ ...prev, slot_id: slot.id }))
    setCurrentStep(3)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setBookingData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await appAPI.post('/booking/', bookingData)
      setSuccess(true)
      setCurrentStep(4)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create booking')
      console.error('Error creating booking:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setSelectedDoctor(null)
    setSelectedSlot(null)
    setAvailableSlots([])
    setSuccess(false)
    setError('')
    setBookingData({
      consultation_type: '',
      name: '',
      email: '',
      phone_number: '',
      message: '',
      doctor_id: 0,
      slot_id: null
    })
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Booked Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment with {selectedDoctor?.name} on {selectedSlot?.date} at {selectedSlot?.start_time} has been confirmed.
            </p>
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Select Doctor' },
              { step: 2, title: 'Choose Time' },
              { step: 3, title: 'Your Details' }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                  currentStep >= item.step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.step}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= item.step ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {item.title}
                </span>
                {item.step < 3 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    currentStep > item.step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step 1: Select Doctor */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Doctor</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading doctors...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor)}
                      className="border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                      <p className="text-gray-600 text-sm">{doctor.email}</p>
                      <p className="text-gray-600 text-sm">{doctor.phone_number}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Time Slot */}
          {currentStep === 2 && selectedDoctor && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Select Time Slot</h2>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Doctors
                </button>
              </div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-900 font-medium">Selected Doctor: {selectedDoctor.name}</p>
                <p className="text-gray-600">{selectedDoctor.specialty}</p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading availability...</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No available slots for this doctor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => handleSlotSelect(slot)}
                      className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${
                        slot.is_booked 
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <p className="font-medium">{slot.date}</p>
                      <p className="text-sm text-gray-600">{slot.start_time} - {slot.end_time}</p>
                      {slot.is_booked && (
                        <p className="text-xs text-red-500 mt-1">Unavailable</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Patient Details */}
          {currentStep === 3 && selectedSlot && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Your Details</h2>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Time Slots
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-900 font-medium">Appointment Summary:</p>
                <p className="text-gray-600">Doctor: {selectedDoctor?.name}</p>
                <p className="text-gray-600">Date: {selectedSlot.date}</p>
                <p className="text-gray-600">Time: {selectedSlot.start_time} - {selectedSlot.end_time}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Type *
                    </label>
                    <select
                      name="consultation_type"
                      value={bookingData.consultation_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select consultation type</option>
                      <option value="General Check-up">General Check-up</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Consultation">Consultation</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={bookingData.phone_number}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={bookingData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information or concerns..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Booking Appointment...' : 'Book Appointment'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 