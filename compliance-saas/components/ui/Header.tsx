'use client';

import ProfileMenu from './ProfileMenu';

/**
 * @deprecated Use TopBar instead.
 */
export default function Header() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Add any other header content here */}
        </div>
        <ProfileMenu />
      </div>
    </header>
  );
}
