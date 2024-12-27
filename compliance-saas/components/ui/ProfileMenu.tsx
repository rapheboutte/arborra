'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

interface ProfileMenuProps {
  notificationCount: number;
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export default function ProfileMenu({
  notificationCount,
  notifications,
  onNotificationClick,
}: ProfileMenuProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/signin' });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Notifications */}
      <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500"
                variant="destructive"
              >
                {notificationCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${
                  notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                } cursor-pointer`}
                onClick={() => {
                  onNotificationClick(notification);
                  setNotificationsOpen(false);
                }}
              >
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-gray-500">{notification.description}</p>
                <span className="text-xs text-gray-400 mt-2 block">{notification.time}</span>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Profile Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <div className="flex h-full w-full items-center justify-center bg-blue-100 text-blue-900 rounded-full">
              {session?.user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
