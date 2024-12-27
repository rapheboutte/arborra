'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  FileCheck2,
  Settings,
  Users,
  Bell,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const stats = [
    {
      name: 'Total Tasks',
      value: '24',
      change: '+4.75%',
      changeType: 'positive',
      icon: FileCheck2,
    },
    {
      name: 'Active Users',
      value: '12',
      change: '+10.18%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Compliance Score',
      value: '98.5%',
      change: '+2.02%',
      changeType: 'positive',
      icon: BarChart3,
    },
    {
      name: 'Pending Reviews',
      value: '6',
      change: '-4.05%',
      changeType: 'negative',
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 bg-indigo-500 rounded-lg transform rotate-6"></div>
                  <div className="absolute inset-0 bg-indigo-600 rounded-lg transform -rotate-6"></div>
                  <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">A</span>
                  </div>
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-900">Arborra</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {session.user?.email?.[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {session.user?.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Welcome back, Admin
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Here's what's happening with your compliance tasks today.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
              >
                <dt>
                  <div className="absolute rounded-md bg-indigo-50 p-3">
                    <stat.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </p>
                </dd>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Recent Activity
                </h3>
                <div className="mt-4">
                  <div className="space-y-4">
                    {/* Placeholder for activity items */}
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FileCheck2 className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          New compliance task assigned
                        </p>
                        <p className="text-sm text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          New team member added
                        </p>
                        <p className="text-sm text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
