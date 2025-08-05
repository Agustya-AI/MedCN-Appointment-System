"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar, Clock, Users } from 'lucide-react'
import { useAppointmentTypes } from '../_hooks/useAppointmentTypes'
import CreateAppointmentTypeModal from './CreateAppointmentTypeModal'

export default function AppointmentTypePage() {
  const { appointmentTypes, loading, error, fetchAppointmentTypes } = useAppointmentTypes()
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Get user token from localStorage (you might want to get this from your auth context)
  const getUserToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || ''
    }
    return ''
  }

  useEffect(() => {
    const userToken = getUserToken()
    console.log("TOKEN USER: ", userToken)
    if (userToken) {
      fetchAppointmentTypes(userToken)
    }
  }, [])

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    // The hook will automatically refresh the list after creation
  }

  if (loading && appointmentTypes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading appointment types...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => fetchAppointmentTypes(getUserToken())}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointment Types</h1>
          <p className="text-muted-foreground">
            Manage the different types of appointments available in your practice
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Appointment Type
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Types</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointmentTypes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Types</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointmentTypes.filter((type:any) => type.is_appointment_enabled).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointmentTypes.length > 0 
                ? Math.round(appointmentTypes.reduce((acc:any, type:any) => acc + parseInt(type.appointment_patient_duration || '0'), 0) / appointmentTypes.length)
                : 0
              } min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointment Types</CardTitle>
          <CardDescription>
            A list of all appointment types configured for your practice
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentTypes.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No appointment types found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first appointment type
              </p>
              <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Appointment Type
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type of Consultation</TableHead>
                  <TableHead>Patient Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentTypes.map((appointmentType:any) => (
                  <TableRow key={appointmentType.appointment_uuid}>
                    <TableCell className="font-medium">
                      {appointmentType.type_of_consultation}
                    </TableCell>
                    <TableCell>
                      {appointmentType.appointment_patient_type}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {appointmentType.appointment_patient_duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={appointmentType.is_appointment_enabled ? "default" : "secondary"}
                      >
                        {appointmentType.is_appointment_enabled ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate">
                        {appointmentType.appointment_description || "No description"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <CreateAppointmentTypeModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}
