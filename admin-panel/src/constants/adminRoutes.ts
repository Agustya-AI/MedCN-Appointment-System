export interface AdminRoute {
  href: string
  label: string
  icon: string
}

export const adminRoutes: AdminRoute[] = [
  { href: '/admin', label: 'Dashboard', icon: 'mdi:home' },
  // { href: '/admin/doctors', label: 'Doctors', icon: 'mdi:account' },
  { href: '/admin/bookings', label: 'Bookings', icon: 'mdi:calendar' },
  { href: '/admin/settings', label: 'Settings', icon: 'mdi:cog' },
  { href: "/admin/appointment-types", label: "Appointment Types", icon: "mdi:calendar-multiple" },
  { href: "/admin/practice-setup", label: "Practice Settings", icon: "mdi:hospital-building" },
  { href: "/admin/practioner-setup", label: "Practioner Setup", icon: "mdi:account" },
  { href: "/admin/practice-members", label: "Practice Members", icon: "mdi:account-group" }
]