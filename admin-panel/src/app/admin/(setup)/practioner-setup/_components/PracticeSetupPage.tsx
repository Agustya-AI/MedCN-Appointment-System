'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Button component (inline for now)
const Button = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
  }
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-11 px-8'
  }
  
  return (
    <button 
      className={cn(baseClasses, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  )
}

// Input component (inline for now)
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

// Select component (inline for now)
const Select = ({ children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

interface Practitioner {
  id: string
  name: string
  avatar?: string
  visible: boolean
  specialty?: string
}

const dummyPractitioners: Practitioner[] = [
  { id: '1', name: 'Bruno Rebello', visible: true, avatar: '👨‍⚕️' },
  { id: '2', name: 'Chris Goodall', visible: true, avatar: '👨‍⚕️' },
  { id: '3', name: 'Flu Clinic', visible: true, avatar: '🏥' },
  { id: '4', name: 'Dr Frank (Hong-way) Lin', visible: true, avatar: '👨‍⚕️' },
  { id: '5', name: 'Dr Pejman Amini( Bulk Billing)', visible: true, avatar: '👨‍⚕️' },
  { id: '6', name: 'Dr Praveen Veeramachineni', visible: true, avatar: '👨‍⚕️' },
  { id: '7', name: 'Bruno Rebello', visible: false, avatar: '👨‍⚕️' },
  { id: '8', name: 'Dr Cho Thet Paing', visible: false, avatar: '👨‍⚕️' },
]

type TabType = 'all' | 'visible' | 'not-visible' | 'archived'

export default function PracticeSetupPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')

  const getCounts = () => {
    const visible = dummyPractitioners.filter(p => p.visible).length
    const notVisible = dummyPractitioners.filter(p => !p.visible).length
    return {
      all: dummyPractitioners.length,
      visible,
      notVisible,
      archived: 25 // dummy count
    }
  }

  const counts = getCounts()

  const filteredPractitioners = dummyPractitioners.filter(practitioner => {
    const matchesSearch = practitioner.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'visible' ? practitioner.visible :
      activeTab === 'not-visible' ? !practitioner.visible :
      false // archived - no data for now
    
    return matchesSearch && matchesTab
  })

  const TabButton = ({ 
    tab, 
    label, 
    count, 
    isActive 
  }: { 
    tab: TabType
    label: string
    count: number
    isActive: boolean 
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 transition-colors',
        isActive 
          ? 'border-primary text-primary' 
          : 'border-transparent text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
      <span className={cn(
        'rounded-full px-2 py-0.5 text-xs',
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'
      )}>
        {count}
      </span>
    </button>
  )

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Practitioners</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <span className="mr-2">❓</span>
            Need Help?
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <span className="mr-2">+</span>
            New Practitioner
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <TabButton 
            tab="all" 
            label="All" 
            count={counts.all} 
            isActive={activeTab === 'all'} 
          />
          <TabButton 
            tab="visible" 
            label="Visible" 
            count={counts.visible} 
            isActive={activeTab === 'visible'} 
          />
          <TabButton 
            tab="not-visible" 
            label="Not Visible" 
            count={counts.notVisible} 
            isActive={activeTab === 'not-visible'} 
          />
          <TabButton 
            tab="archived" 
            label="Archived" 
            count={counts.archived} 
            isActive={activeTab === 'archived'} 
          />
        </nav>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select 
          value={branchFilter} 
          onChange={(e) => setBranchFilter(e.target.value)}
          className="w-48"
        >
          <option value="all">Filter branch</option>
          <option value="main">Main Branch</option>
          <option value="north">North Branch</option>
          <option value="south">South Branch</option>
        </Select>
        
        <div className="relative flex-1 max-w-sm">
          <Input
            type="text"
            placeholder="Filter by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
        </div>

        <Button variant="outline" className="ml-auto">
          <span className="mr-2">⚙️</span>
          Sort Practitioners on Bookings Page
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Practitioner</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPractitioners.map((practitioner) => (
              <TableRow key={practitioner.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg">
                      {practitioner.avatar}
                    </div>
                    <span className="font-medium">{practitioner.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'h-2 w-2 rounded-full',
                      practitioner.visible ? 'bg-emerald-500' : 'bg-red-500'
                    )} />
                    <span className="text-sm">
                      {practitioner.visible ? 'Yes' : 'No'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredPractitioners.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No practitioners found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
