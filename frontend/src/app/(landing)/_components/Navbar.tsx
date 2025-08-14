import React from 'react'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hover:from-blue-700 hover:to-blue-900 transition-all">
              MedCN
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/services" className="text-gray-600 hover:text-blue-600 font-medium transition-all hover:scale-105">
              Services
            </Link>
            <Link href="/appointments" className="text-gray-600 hover:text-blue-600 font-medium transition-all hover:scale-105">
              Book Appointments
            </Link>
          </div>

          {/* Call Us Button */}
          <div className="flex items-center">
            <Link
              href="/auth" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-medium hover:from-blue-700 hover:to-blue-800 transition-all hover:shadow-lg hover:scale-105"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
