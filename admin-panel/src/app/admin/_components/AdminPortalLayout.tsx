'use client'

import React from 'react'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminRoutes } from '@/constants/adminRoutes'
import { cn } from '@/lib/utils'


export default function AdminPortalLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen flex">
      {/* Navbar */}
      <nav className="w-64 bg-white border-r shadow-sm p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-blue-600"></div>
          <span className="text-xl font-semibold text-gray-900">MedCN</span>
        </div>
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
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
