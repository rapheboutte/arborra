'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  CheckSquare,
  FileText,
  BarChart,
  ScrollText,
  Users,
  Settings,
  Shield,
  Menu
} from 'lucide-react'
import { Button } from './button'

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Task Manager', href: '/tasks', icon: CheckSquare },
  { label: 'Document Center', href: '/documents', icon: FileText },
  { label: 'Compliance Reports', href: '/reports', icon: BarChart },
  { label: 'Audit Logs', href: '/audit', icon: ScrollText },
  { label: 'Team', href: '/team', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div className={cn(
      "flex h-screen flex-col border-r bg-white transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className={cn(
          "flex items-center gap-2 overflow-hidden",
          isCollapsed && "opacity-0"
        )}>
          <Shield className="h-5 w-5 flex-shrink-0 text-blue-600" />
          <span className="font-semibold truncate">ComplianceSaaS</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors relative group",
                isActive 
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 flex-shrink-0",
                isActive ? "text-blue-600" : "text-gray-400"
              )} />
              <span className={cn(
                "truncate transition-opacity",
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              )}>
                {item.label}
              </span>
              {isCollapsed && (
                <div className="absolute left-full ml-2 hidden rounded-md bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
