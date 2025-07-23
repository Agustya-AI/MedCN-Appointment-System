'use client'

import React from 'react'
import AdminPortalLayout from '../_components/AdminPortalLayout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Booking {
  id: string
  patientName: string
  appointmentDate: string 
  appointmentStatus: "booked" | "completed" | "cancelled"
  bookedAt: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([
    {
      id: "1",
      patientName: "John Smith",
      appointmentDate: "2024-01-15 09:00 AM",
      appointmentStatus: "booked",
      bookedAt: "2024-01-10 10:30 AM"
    },
    // Add more mock data as needed
  ])

  return (
    <AdminPortalLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Bookings</h1>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Appointment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booked At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.patientName}</TableCell>
                  <TableCell>{booking.appointmentDate}</TableCell>
                  <TableCell>
                    <Badge variant={
                      booking.appointmentStatus === "booked" ? "default" :
                      booking.appointmentStatus === "completed" ? "success" : "destructive"
                    }>
                      {booking.appointmentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{booking.bookedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminPortalLayout>
  )
}
