"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  BarChart3,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard
    },
    {
      name: 'Task Manager',
      href: '/tasks',
      icon: CheckSquare
    },
    {
      name: 'Document Center',
      href: '/documents',
      icon: FileText,
    },
    {
      name: 'Reports & Analytics',
      href: '/reports',
      icon: BarChart3,
    }
  ];

  return (
    <div className="flex h-full">
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <Link href="/" className="flex items-center flex-shrink-0 px-4">
            <img
              className="w-auto h-8"
              src="/logo.svg"
              alt="Arborra"
            />
          </Link>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive
                          ? 'text-purple-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
