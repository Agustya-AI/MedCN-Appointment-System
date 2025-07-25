export interface AdminRoute {
  href: string
  label: string
  icon: string
}

export const adminRoutes: AdminRoute[] = [
  { href: '/admin', label: 'Dashboard', icon: 'mdi:home' },
  { href: '/admin/doctors', label: 'Doctors', icon: 'mdi:account' },
  { href: '/admin/bookings', label: 'Bookings', icon: 'mdi:calendar' },
  { href: '/admin/settings', label: 'Settings', icon: 'mdi:cog' },
]