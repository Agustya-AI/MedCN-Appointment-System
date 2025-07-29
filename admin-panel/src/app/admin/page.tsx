'use client'

import React, { useState, useEffect } from 'react'
import AdminPortalLayout from './_components/AdminPortalLayout'

// Mock data structures - these would come from the backend API
interface RevenueData {
  today: { amount: number; change: number }
  thisWeek: { amount: number; change: number }
  thisMonth: { amount: number; change: number }
}

interface AppointmentStats {
  scheduled: number
  checkedIn: number
  completed: number
  noShows: number
}

interface PractitionerUtilization {
  id: string
  name: string
  bookedHours: number
  availableHours: number
  utilization: number
}

interface PatientMix {
  newPatients: number
  returningPatients: number
}

interface Alert {
  id: string
  type: 'urgent' | 'warning' | 'info'
  message: string
  action: string
  count: number
}

interface WaitlistItem {
  id: string
  patientName: string
  phoneNumber: string
  requestedDate: string
  appointmentType: string
  waitingSince: string
  priority: 'high' | 'medium' | 'low'
}

interface PerformanceMetric {
  practitionerId: string
  name: string
  utilizationRate: number
  noShowRate: number
  revenueGenerated: number
  patientVolume: number
  avgRating: number
}

interface AppointmentRisk {
  id: string
  patientName: string
  appointmentTime: string
  practitioner: string
  riskLevel: 'high' | 'medium' | 'low'
  riskFactors: string[]
}

export default function AdminPage() {
  const [selectedDateFilter, setSelectedDateFilter] = useState('today')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')

  // Mock data - this would be fetched from APIs
  const revenueData: RevenueData = {
    today: { amount: 2450, change: 12.5 },
    thisWeek: { amount: 18750, change: 8.3 },
    thisMonth: { amount: 67200, change: 15.7 }
  }

  const appointmentStats: AppointmentStats = {
    scheduled: 24,
    checkedIn: 8,
    completed: 12,
    noShows: 2
  }

  const practitionerUtilization: PractitionerUtilization[] = [
    { id: '1', name: 'Dr. Sarah Johnson', bookedHours: 7, availableHours: 8, utilization: 87.5 },
    { id: '2', name: 'Dr. Michael Chen', bookedHours: 6, availableHours: 8, utilization: 75.0 },
    { id: '3', name: 'Dr. Emily Rodriguez', bookedHours: 8, availableHours: 8, utilization: 100.0 },
    { id: '4', name: 'Dr. James Wilson', bookedHours: 5, availableHours: 8, utilization: 62.5 }
  ]

  const patientMix: PatientMix = {
    newPatients: 8,
    returningPatients: 16
  }

  const alerts: Alert[] = [
    { id: '1', type: 'urgent', message: 'unfilled slots from cancellations in the next 48 hours', action: 'View Calendar', count: 3 },
    { id: '2', type: 'warning', message: 'invoices are 30+ days overdue', action: 'View Billing', count: 7 },
    { id: '3', type: 'info', message: 'practitioners have availability today', action: 'View Schedule', count: 2 }
  ]

  const waitlistItems: WaitlistItem[] = [
    { id: '1', patientName: 'Alice Thompson', phoneNumber: '+1-555-0123', requestedDate: '2024-01-15', appointmentType: 'General Consultation', waitingSince: '2024-01-10', priority: 'high' },
    { id: '2', patientName: 'Bob Martinez', phoneNumber: '+1-555-0124', requestedDate: '2024-01-16', appointmentType: 'Follow-up', waitingSince: '2024-01-12', priority: 'medium' },
    { id: '3', patientName: 'Carol Davis', phoneNumber: '+1-555-0125', requestedDate: '2024-01-17', appointmentType: 'Specialist Referral', waitingSince: '2024-01-11', priority: 'high' }
  ]

  const performanceMetrics: PerformanceMetric[] = [
    { practitionerId: '1', name: 'Dr. Sarah Johnson', utilizationRate: 87.5, noShowRate: 5.2, revenueGenerated: 23400, patientVolume: 156, avgRating: 4.8 },
    { practitionerId: '2', name: 'Dr. Michael Chen', utilizationRate: 75.0, noShowRate: 8.1, revenueGenerated: 19200, patientVolume: 128, avgRating: 4.6 },
    { practitionerId: '3', name: 'Dr. Emily Rodriguez', utilizationRate: 100.0, noShowRate: 3.1, revenueGenerated: 28900, patientVolume: 189, avgRating: 4.9 },
    { practitionerId: '4', name: 'Dr. James Wilson', utilizationRate: 62.5, noShowRate: 12.3, revenueGenerated: 15600, patientVolume: 98, avgRating: 4.4 }
  ]

  const appointmentRisks: AppointmentRisk[] = [
    { id: '1', patientName: 'John Doe', appointmentTime: 'Today 9:00 AM', practitioner: 'Dr. Johnson', riskLevel: 'high', riskFactors: ['2 previous no-shows', 'Monday morning'] },
    { id: '2', patientName: 'Jane Smith', appointmentTime: 'Today 2:30 PM', practitioner: 'Dr. Chen', riskLevel: 'medium', riskFactors: ['1 previous no-show'] },
    { id: '3', patientName: 'Mike Brown', appointmentTime: 'Tomorrow 10:00 AM', practitioner: 'Dr. Rodriguez', riskLevel: 'high', riskFactors: ['Booked >30 days ago', 'First time patient'] }
  ]

  const handleSearch = (query: string) => {
    // Mock search implementation - this would call an AI/LLM API
    const mockResults = [
      { type: 'appointment', data: 'Found 5 appointments for today' },
      { type: 'patient', data: 'Patient John Doe has 2 upcoming appointments' },
      { type: 'practitioner', data: 'Dr. Smith has 85% utilization rate' }
    ]
    setSearchResults(mockResults)
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-500'
    if (utilization >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminPortalLayout>
      <div className="space-y-6">
        {/* Header with Navigation Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
            <div className="flex space-x-4">
              {['dashboard', 'performance', 'waitlist', 'risk-analysis'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === tab 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
          
          {/* Global Date Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Export Report
            </button>
          </div>
        </div>

        {/* Natural Language Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ask a question about your practice... (e.g., 'show all patients for Dr. Smith', 'how many appointments today')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={() => handleSearch(searchQuery)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Search
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
                <div className="space-y-2">
                  {searchResults.map((result, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-blue-600">{result.type}:</span> {result.data}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Revenue Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Today's Revenue</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">${revenueData.today.amount.toLocaleString()}</p>
                <p className={`text-sm mt-1 ${revenueData.today.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueData.today.change >= 0 ? '+' : ''}{revenueData.today.change}% vs yesterday
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">This Week's Revenue</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">${revenueData.thisWeek.amount.toLocaleString()}</p>
                <p className={`text-sm mt-1 ${revenueData.thisWeek.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueData.thisWeek.change >= 0 ? '+' : ''}{revenueData.thisWeek.change}% vs last week
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">This Month's Revenue</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">${revenueData.thisMonth.amount.toLocaleString()}</p>
                <p className={`text-sm mt-1 ${revenueData.thisMonth.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueData.thisMonth.change >= 0 ? '+' : ''}{revenueData.thisMonth.change}% vs last month
                </p>
              </div>
            </div>

            {/* Appointments & Patient Mix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Appointment Stats */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Today's Appointments</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{appointmentStats.scheduled}</p>
                    <p className="text-sm text-gray-600">Scheduled</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{appointmentStats.checkedIn}</p>
                    <p className="text-sm text-gray-600">Checked In</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{appointmentStats.completed}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{appointmentStats.noShows}</p>
                    <p className="text-sm text-gray-600">No Shows</p>
                  </div>
                </div>
              </div>

              {/* Patient Mix */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Patient Mix (Today)</h3>
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-blue-600">{patientMix.newPatients}</span>
                    </div>
                    <p className="text-sm text-gray-600">New Patients</p>
                    <p className="text-xs text-gray-500">{((patientMix.newPatients / (patientMix.newPatients + patientMix.returningPatients)) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-2xl font-bold text-green-600">{patientMix.returningPatients}</span>
                    </div>
                    <p className="text-sm text-gray-600">Returning</p>
                    <p className="text-xs text-gray-500">{((patientMix.returningPatients / (patientMix.newPatients + patientMix.returningPatients)) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Practitioner Utilization */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Practitioner Utilization (Today)</h3>
              <div className="space-y-4">
                {practitionerUtilization.map((practitioner) => (
                  <div key={practitioner.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{practitioner.name}</p>
                      <p className="text-sm text-gray-500">
                        {practitioner.bookedHours}/{practitioner.availableHours} hours
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getUtilizationColor(practitioner.utilization)}`}
                          style={{ width: `${practitioner.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12">
                        {practitioner.utilization.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Alerts */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Actionable Alerts</h3>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'urgent' ? 'border-red-500 bg-red-50' :
                    alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          <span className="font-bold">{alert.count}</span> {alert.message}
                        </p>
                      </div>
                      <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
                        {alert.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Practitioner Performance Scorecard</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Practitioner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No-Show Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performanceMetrics.map((metric) => (
                    <tr key={metric.practitionerId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{metric.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className={`h-2 rounded-full ${getUtilizationColor(metric.utilizationRate)}`}
                              style={{ width: `${metric.utilizationRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{metric.utilizationRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.noShowRate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${metric.revenueGenerated.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.patientVolume}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">{metric.avgRating}</span>
                          <div className="ml-2 flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-4 w-4 ${i < Math.floor(metric.avgRating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Waitlist Tab */}
        {activeTab === 'waitlist' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Automated Waitlist Management</h3>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Process Next in Queue
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting Since</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {waitlistItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.requestedDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.appointmentType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.waitingSince}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Notify</button>
                        <button className="text-green-600 hover:text-green-900">Book Now</button>
                        <button className="text-red-600 hover:text-red-900">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Risk Analysis Tab */}
        {activeTab === 'risk-analysis' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Predictive No-Show Risk Analysis</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm">High Risk Only</button>
                <button className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">Medium Risk Only</button>
                <button className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm">All Appointments</button>
              </div>
            </div>
            <div className="space-y-4">
              {appointmentRisks.map((appointment) => (
                <div key={appointment.id} className={`p-4 rounded-lg border-2 ${
                  appointment.riskLevel === 'high' ? 'border-red-200 bg-red-50' :
                  appointment.riskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">{appointment.appointmentTime} with {appointment.practitioner}</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(appointment.riskLevel)}`}>
                          {appointment.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Risk Factors:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {appointment.riskFactors.map((factor, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                        Call Patient
                      </button>
                      <button className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                        Send Reminder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminPortalLayout>
  )
}
