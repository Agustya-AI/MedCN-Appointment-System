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
  BarChartIcon,
  LineChartIcon,
  PieChartIcon
} from "lucide-react"
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSidebarOpen } from '@/store/app';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  path: string;
}

function NavItem({ icon, label, expanded, path }: NavItemProps) {


  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-4 p-4 hover:bg-blue-500/80 hover:text-white text-white cursor-pointer transition-all duration-200",
        !expanded && "justify-center p-2"
      )}
      onClick={() => router.push(path)}
    >
      {icon}
      {expanded && <span className="font-medium">{label}</span>}
    </Button>
  )
}

export default function DashboardLayout({children}: {children: React.ReactNode}) {


  const isSidebarOpen = useSelector((state: RootState) => state.appService.isSidebarOpen);

  const dispatch = useDispatch();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Floating Sidebar */}
      <div className={cn(
        "fixed left-4 top-4 z-40 flex h-[calc(100vh-2rem)] flex-col rounded-xl border bg-gradient-to-b from-blue-600 to-blue-700 shadow-xl transition-all duration-300 backdrop-blur-lg",
        isSidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "self-end p-2 pt-4 text-white hover:bg-white/10 transition-colors duration-200",
            isSidebarOpen ? "ml-64" : "m-auto"
          )}
          onClick={() => dispatch(setSidebarOpen(!isSidebarOpen))}
        >
          <MenuIcon className="h-4 w-4" />
        </Button>

        {/* Nav items */}
        <nav className="flex-1 space-y-2 p-2">
          <NavItem icon={<HomeIcon className="h-4 w-4" />} label="Dashboard" expanded={isSidebarOpen} path="/dashboard" />
          <NavItem icon={<SearchIcon className="h-4 w-4" />} label="Search Practice" expanded={isSidebarOpen} path="/practices" />
          <NavItem icon={<LineChartIcon className="h-4 w-4" />} label="Reports" expanded={isSidebarOpen} path="/reports" />
          <NavItem icon={<PieChartIcon className="h-4 w-4" />} label="Statistics" expanded={isSidebarOpen} path="/statistics" />
          <NavItem icon={<CalendarIcon className="h-4 w-4" />} label="Appointments" expanded={isSidebarOpen} path="/appointments" />
          <NavItem icon={<SearchIcon className="h-4 w-4" />} label="Search" expanded={isSidebarOpen} path="/search" />
          <NavItem icon={<UserIcon className="h-4 w-4" />} label="Profile" expanded={isSidebarOpen} path="/profile" />
        </nav>

        {/* Auth buttons */}
        <div className="border-t border-blue-400/30 p-2 space-y-2 backdrop-blur-sm">
          <NavItem icon={<LogInIcon className="h-4 w-4" />} label="Login" expanded={isSidebarOpen} path="/login" />
          <NavItem icon={<LogOutIcon className="h-4 w-4" />} label="Logout" expanded={isSidebarOpen} path="/logout" />
        </div>

      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 p-8 transition-all duration-300 backdrop-blur-sm",
        isSidebarOpen ? "ml-72" : "ml-24"
      )}>
        {children}
      </div>
    </div>
  )
}
