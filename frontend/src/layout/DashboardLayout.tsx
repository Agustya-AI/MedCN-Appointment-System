"use client";

import React from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  SearchIcon,
  CalendarIcon,
  UserIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react"

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, expanded, onClick }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-4 p-4 hover:bg-blue-600/50 text-white",
        !expanded && "justify-center p-2"
      )}
      onClick={onClick}
    >
      {icon}
      {expanded && <span>{label}</span>}
    </Button>
  )
}

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Floating Sidebar */}
      <div className={cn(
        "fixed left-4 top-4 z-40 flex h-[calc(100vh-2rem)] flex-col rounded-xl border bg-blue-500 shadow-lg transition-all duration-300",
        isExpanded ? "w-64" : "w-16"
      )}>
        
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "self-end p-2 pt-4 text-white hover:bg-blue-600/50",
            isExpanded ? "ml-64" : "m-auto"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <MenuIcon className="h-4 w-4" />
        </Button>

        {/* Nav items */}
        <nav className="flex-1 space-y-2 p-2">
          <NavItem icon={<HomeIcon className="h-4 w-4" />} label="Home" expanded={isExpanded} />
          <NavItem icon={<SearchIcon className="h-4 w-4" />} label="Search" expanded={isExpanded} />
          <NavItem icon={<CalendarIcon className="h-4 w-4" />} label="Appointments" expanded={isExpanded} />
          <NavItem icon={<CalendarIcon className="h-4 w-4" />} label="Services" expanded={isExpanded} />
          <NavItem icon={<UserIcon className="h-4 w-4" />} label="Profile" expanded={isExpanded} />
        </nav>

        {/* Auth buttons */}
        <div className="border-t border-blue-400 p-2 space-y-2">
          <NavItem icon={<LogInIcon className="h-4 w-4" />} label="Login" expanded={isExpanded} />
          <NavItem icon={<LogOutIcon className="h-4 w-4" />} label="Logout" expanded={isExpanded} />
        </div>

      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 p-8 transition-all duration-300",
        isExpanded ? "ml-72" : "ml-24"
      )}>
        {children}
      </div>
    </div>
  )
}
