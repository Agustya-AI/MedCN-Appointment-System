'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  // Healthy Habits Spinner State and Logic
  const healthyHabits = [
    'Drink 8 glasses of water daily',
    'Take a 10-minute walk',
    'Schedule regular checkups',
    'Eat more fruits and veggies',
    'Practice mindfulness',
    'Get 7-8 hours of sleep',
    'Wash your hands regularly',
    'Limit screen time before bed',
    'Stretch every morning',
    'Smile more often!'
  ];
  const [spinning, setSpinning] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setSelectedHabit(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * healthyHabits.length);
      setSelectedHabit(healthyHabits[randomIndex]);
      setSpinning(false);
    }, 1800);
  };

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-20">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
              Online services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get a <span className="text-blue-600">professional</span> diagnosis in your neighborhood
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Leading experts in all major fields are just around the corner. Book your appointment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/appointments"
                className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all text-center"
              >
                Book an appointment
              </Link>
              <Link
                href="/services" 
                className="inline-block px-8 py-4 text-blue-600 font-medium hover:text-blue-700 transition-all text-center"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute -inset-4">
                <div className="w-full h-full max-w-sm mx-auto lg:mx-0 opacity-30 blur-lg bg-gradient-to-r from-blue-400 to-blue-600"></div>
              </div>
              <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                {/* Spinner Game */}
                <div className="flex flex-col items-center mb-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Healthy Habits Spinner</h3>
                  <div className="relative flex items-center justify-center mb-4">
                    <div
                      className={`w-32 h-32 rounded-full border-4 border-blue-400 flex items-center justify-center transition-transform duration-700 ${spinning ? 'animate-spin-slow' : ''}`}
                      style={{ background: 'conic-gradient(#60a5fa 0% 25%, #a7f3d0 25% 50%, #facc15 50% 75%, #fca5a5 75% 100%)' }}
                    >
                      <span className="text-lg font-bold text-blue-900 select-none">{spinning ? 'Spinning...' : '🎯'}</span>
                    </div>
                    {/* Pointer */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <polygon points="12,0 20,12 4,12" fill="#2563eb" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={spinWheel}
                    disabled={spinning}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    {spinning ? 'Spinning...' : 'Spin the Wheel!'}
                  </button>
                  {selectedHabit && (
                    <div className="mt-4 text-center">
                      <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-md">
                        {selectedHabit}
                      </span>
                    </div>
                  )}
                </div>
                {/* End Spinner Game */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
