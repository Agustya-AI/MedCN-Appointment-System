'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { usePractitioners } from '@/app/admin/_hooks/usePracticeData'
import { useRouter } from 'next/navigation'

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
  practitioner_uuid: string
  display_name: string
  profession?: string
  is_active: boolean
  qualifications?: string
  education?: string
  languages_spoken?: string
  gender?: string
  professional_statement?: string
}

type TabType = 'all' | 'visible' | 'not-visible' | 'archived'

export default function PracticeSetupPage() {
  const { practitioners, loading, error, refetchPractitioners } = usePractitioners()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')

  const getCounts = () => {
    const visible = practitioners.filter(p => p.is_active).length
    const notVisible = practitioners.filter(p => !p.is_active).length
    return {
      all: practitioners.length,
      visible,
      notVisible,
      archived: 0 // TODO: Add archived practitioners when backend supports it
    }
  }

  const counts = getCounts()

  const filteredPractitioners = practitioners.filter(practitioner => {
    const matchesSearch = practitioner.display_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'visible' ? practitioner.is_active :
      activeTab === 'not-visible' ? !practitioner.is_active :
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

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Practitioners</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">Loading practitioners...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Practitioners</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="text-red-600">Failed to load practitioners</div>
          <Button onClick={refetchPractitioners}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

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
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => router.push('/admin/practioner-setup/new')}
          >
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
            label="Active" 
            count={counts.visible} 
            isActive={activeTab === 'visible'} 
          />
          <TabButton 
            tab="not-visible" 
            label="Inactive" 
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

        <Button variant="outline" className="ml-auto" onClick={refetchPractitioners}>
          <span className="mr-2">🔄</span>
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Practitioner</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPractitioners.map((practitioner) => (
              <TableRow key={practitioner.practitioner_uuid}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg">
                      👨‍⚕️
                    </div>
                    <div>
                      <div className="font-medium">{practitioner.display_name}</div>
                      {practitioner.qualifications && (
                        <div className="text-sm text-muted-foreground">
                          {practitioner.qualifications}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {practitioner.profession || 'Not specified'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'h-2 w-2 rounded-full',
                      practitioner.is_active ? 'bg-emerald-500' : 'bg-red-500'
                    )} />
                    <span className="text-sm">
                      {practitioner.is_active ? 'Active' : 'Inactive'}
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
            
            {filteredPractitioners.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {practitioners.length === 0 
                    ? "No practitioners found. Click 'New Practitioner' to add one."
                    : "No practitioners found matching your criteria."
                  }
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
