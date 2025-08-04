'use client'

import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { adminRoutes } from '@/constants/adminRoutes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import usePracticeData from '../_hooks/usePracticeData'


export default function AdminPortalLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const { practice } = usePracticeData();

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_authenticated')
    
    // Redirect to login page
    router.push('/')
  }

  return (
    <div className="h-screen flex">
      {/* Navbar */}
      <nav className="w-64 bg-white border-r shadow-sm p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-blue-600"></div>
          <span className="text-xl font-semibold text-gray-900">MedCN</span>
        </div>
        
        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-1.5">
            {adminRoutes.map((route) => {
              const isActive = pathname.startsWith(route.href)
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon icon={route.icon} className="w-4 h-4" />
                    {route.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Logout Button */}
        <div className="mt-4 pt-4 border-t">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <Icon icon="mdi:logout" className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
