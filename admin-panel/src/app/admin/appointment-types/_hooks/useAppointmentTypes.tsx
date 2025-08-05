import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { setPracticeAppointmentTypes } from '@/store/practice'
import axiosInstance from '@/constants/apiUtils'
import { useState } from 'react'

export interface AppointmentType {
  id: number
  appointment_uuid: string
  is_appointment_enabled: boolean
  type_of_consultation: string
  appointment_patient_type: string
  appointment_patient_duration: string
  appointment_description?: string
}

export interface CreateAppointmentTypePayload {
  type_of_consultation: string
  appointment_patient_type: string
  appointment_patient_duration: string
  is_enabled?: boolean
}

export const useAppointmentTypes = () => {
  const dispatch = useDispatch<AppDispatch>()
  const appointmentTypes = useSelector((state: RootState) => state.practiceService.practiceAppointmentTypes)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointmentTypes = async (userToken: string) => {
    try {
      console.log("Fetching appointment types")
      setLoading(true)
      setError(null)
      
      const response = await axiosInstance.get('/practice/appointment-types', {
        params: { user_token: userToken }
      })
      
      if (response.data && response.data.appointments) {
        dispatch(setPracticeAppointmentTypes(response.data.appointments))
        return response.data.appointments
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to fetch appointment types'
      setError(errorMessage)
      console.error('Error fetching appointment types:', err)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createAppointmentType = async (userToken: string, appointmentData: CreateAppointmentTypePayload) => {
    try {
      setLoading(true)
      setError(null)

      const response = await axiosInstance.post('/practice/create-appointment-type', appointmentData, {
        params: { user_token: userToken }
      })

      if (response.data) {
        // Refresh the appointment types list after creation
        await fetchAppointmentTypes(userToken)
        return response.data
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to create appointment type'
      setError(errorMessage)
      console.error('Error creating appointment type:', err)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    appointmentTypes,
    loading,
    error,
    fetchAppointmentTypes,
    createAppointmentType,
    clearError: () => setError(null)
  }
}