'use client';

import { useState } from 'react';
import ProfileMenu from '@/components/ui/ProfileMenu';

export function HeaderMenu() {
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

  const handleNotificationClick = (notification) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id
          ? { ...n, unread: false }
          : n
      )
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="h-16 px-4 flex items-center justify-end border-b border-gray-200 bg-white fixed top-0 right-0 left-[240px] z-40">
      <ProfileMenu
        notificationCount={unreadCount}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
}
