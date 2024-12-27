'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  FileCheck2,
  ClipboardList,
  Users,
  Settings,
  Shield,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tasks', href: '/tasks', icon: FileCheck2 },
  { name: 'Compliance', href: '/compliance', icon: Shield },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Documentation', href: '/docs', icon: BookOpen },
];

const adminNavItems = [
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Role Management', href: '/admin/roles', icon: ClipboardList },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'Admin';

  return (
    <div className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          <div className="mb-4">
            <div className="px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main
              </h2>
            </div>
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Admin Navigation */}
          {isAdmin && (
            <div className="mb-4">
              <div className="px-3 mb-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h2>
              </div>
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
