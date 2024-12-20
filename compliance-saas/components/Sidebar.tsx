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
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <Link href="/" className="flex items-center space-x-2 px-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        <span className="text-2xl font-bold">Arborra</span>
      </Link>
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-2 py-2 px-4 rounded transition duration-200 ${
              pathname === item.href ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
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
