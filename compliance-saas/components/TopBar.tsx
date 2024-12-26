"use client";

import { useState } from 'react';
import { Bell, Settings, User, Search, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const TopBar = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'GDPR Compliance Update Required',
      description: 'New requirements need review',
      time: '5m ago',
      unread: true
    },
    {
      id: 2,
      title: 'Task Deadline Approaching',
      description: 'Privacy policy update due in 2 days',
      time: '1h ago',
      unread: true
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="h-16 border-b bg-white px-4 flex items-center justify-between">
      <div className="flex items-center flex-1">
        <div className="w-full max-w-lg">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-gray-50 pl-9 focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500 text-white p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                <div className="flex items-center w-full">
                  <span className="font-medium">{notification.title}</span>
                  {notification.unread && (
                    <Badge className="ml-auto" variant="secondary">New</Badge>
                  )}
                </div>
                <span className="text-sm text-gray-500 mt-1">{notification.description}</span>
                <span className="text-xs text-gray-400 mt-2">{notification.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
