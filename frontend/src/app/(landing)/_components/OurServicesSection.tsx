import React from 'react'
import Link from 'next/link'

export default function OurServicesSection() {
  const services = [
    {
      title: 'General Practice',
      description: 'Comprehensive medical care for daily care and preventive health. Our experienced doctors are here for your everyday health concerns.',
      link: '/services/general-practice'
    },
    {
      title: 'Vaccinations',
      description: 'Full range of vaccinations for children and adults. Stay healthy with our efficient and safe vaccination services.',
      link: '/services/vaccinations'  
    },
    {
      title: 'Health Assessments',
      description: 'Thorough health assessments including physical examinations and personalized health recommendations.',
      link: '/services/assessments'
    },
    {
      title: 'Mental Health',
      description: 'Support for mental wellbeing with professional counseling services. We help you with mental health concerns.',
      link: '/services/mental-health'
    },
    {
      title: "Women's Health",
      description: 'Specialized care for women including regular check-ups, fertility planning, and reproductive care.',
      link: '/services/womens-health'
    },
    {
      title: "Men's Health",
      description: 'Comprehensive health services for men including preventive care, screening, and lifestyle advice.',
      link: '/services/mens-health'
    },
    {
      title: 'Physiotherapy',
      description: 'Expert physiotherapy services to treat injuries, reduce pain, and improve mobility through personalized treatment plans.',
      link: '/services/physiotherapy'
    },
    {
      title: "Children's Health",
      description: 'Dedicated care services for children. Regular check-ups, vaccinations, and developmental monitoring.',
      link: '/services/childrens-health'
    },
    {
      title: 'Chronic Disease Management',
      description: 'Ongoing care and management of chronic conditions. Personalized treatment plans and regular monitoring.',
      link: '/services/chronic-disease'
    }
  ]

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600">Comprehensive healthcare services tailored to your needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-blue-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex items-center gap-4">
                <Link
                  href={service.link}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-all"
                >
                  Learn More
                </Link>
                <Link
                  href="/appointments"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
