"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, FileText, BarChart2, Bell, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Task Manager', href: '/tasks', icon: CheckSquare },
  { name: 'Document Center', href: '/documents', icon: FileText },
  { name: 'Reports Generator', href: '/reports', icon: BarChart2 },
  { name: 'Notifications Panel', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Compliance Knowledge Base', href: '/knowledgeBase', icon: FileText },
  { name: 'Compliance Calendar', href: '/calendar', icon: BarChart2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-screen flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-4">
        <Link href="/" className="flex items-center space-x-2">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <span className="text-2xl font-bold text-purple-600">Arborra</span>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              pathname === item.href 
                ? 'bg-purple-50 text-purple-700' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
