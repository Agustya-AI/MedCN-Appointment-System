"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useAppointmentTypes, CreateAppointmentTypePayload } from '../_hooks/useAppointmentTypes'
import { Calendar, Clock, Users, FileText } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface CreateAppointmentTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function CreateAppointmentTypeModal({ 
  open, 
  onOpenChange, 
  onSuccess 
}: CreateAppointmentTypeModalProps) {
  const { createAppointmentType, loading } = useAppointmentTypes()
  
  const [formData, setFormData] = useState<CreateAppointmentTypePayload>({
    type_of_consultation: '',
    appointment_patient_type: '',
    appointment_patient_duration: '',
    is_enabled: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Get user token from localStorage (you might want to get this from your auth context)
  const getUserToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || ''
    }
    return ''
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.type_of_consultation.trim()) {
      newErrors.type_of_consultation = 'Type of consultation is required'
    }

    if (!formData.appointment_patient_type.trim()) {
      newErrors.appointment_patient_type = 'Patient type is required'
    }

    if (!formData.appointment_patient_duration.trim()) {
      newErrors.appointment_patient_duration = 'Duration is required'
    } else {
      const duration = parseInt(formData.appointment_patient_duration)
      if (isNaN(duration) || duration <= 0) {
        newErrors.appointment_patient_duration = 'Duration must be a positive number'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const userToken = getUserToken()
      if (!userToken) {
        alert('User token not found. Please log in again.')
        return
      }

      await createAppointmentType(userToken, formData)
      
      // Reset form
      setFormData({
        type_of_consultation: '',
        appointment_patient_type: '',
        appointment_patient_duration: '',
        is_enabled: true
      })
      setErrors({})
      
      onSuccess()
    } catch (error: any) {
      console.error('Failed to create appointment type:', error)
      // Error is handled in the hook
    }
  }

  const handleInputChange = (field: keyof CreateAppointmentTypePayload, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const patientTypes = [
    'New Patient',
    'Existing Patient',
    'Follow-up',
    'Emergency',
    'Consultation',
    'Check-up',
    'Procedure',
    'Screening'
  ]

  const durations = [
    '15',
    '30',
    '45',
    '60',
    '90',
    '120'
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Create New Appointment Type
          </DialogTitle>
          <DialogDescription>
            Add a new appointment type to your practice. This will be available for booking by patients.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type of Consultation */}
          <div className="space-y-2">
            <Label htmlFor="type_of_consultation" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Type of Consultation *
            </Label>
            <Input
              id="type_of_consultation"
              placeholder="e.g., General Consultation, Specialist Review"
              value={formData.type_of_consultation}
              onChange={(e) => handleInputChange('type_of_consultation', e.target.value)}
              className={errors.type_of_consultation ? 'border-red-500' : ''}
            />
            {errors.type_of_consultation && (
              <p className="text-sm text-red-500">{errors.type_of_consultation}</p>
            )}
          </div>

          {/* Patient Type */}
          <div className="space-y-2">
            <Label htmlFor="appointment_patient_type" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Patient Type *
            </Label>
            <Select 
              value={formData.appointment_patient_type} 
              onValueChange={(value) => handleInputChange('appointment_patient_type', value)}
            >
              <SelectTrigger className={errors.appointment_patient_type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select patient type" />
              </SelectTrigger>
              <SelectContent>
                {patientTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.appointment_patient_type && (
              <p className="text-sm text-red-500">{errors.appointment_patient_type}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="appointment_patient_duration" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Duration (minutes) *
            </Label>
            <Select 
              value={formData.appointment_patient_duration} 
              onValueChange={(value) => handleInputChange('appointment_patient_duration', value)}
            >
              <SelectTrigger className={errors.appointment_patient_duration ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.appointment_patient_duration && (
              <p className="text-sm text-red-500">{errors.appointment_patient_duration}</p>
            )}
          </div>

          {/* Enable/Disable */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_enabled"
              checked={formData.is_enabled}
              onCheckedChange={(checked) => handleInputChange('is_enabled', checked)}
            />
            <Label htmlFor="is_enabled" className="text-sm font-medium">
              Enable this appointment type
            </Label>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4" />
                  Create Appointment Type
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}