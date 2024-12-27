import { useSession } from 'next-auth/react';
import { HeaderMenu } from './HeaderMenu';

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between">
      <div className="flex items-center">
        <span className="text-xl font-semibold">Compliance Management</span>
      </div>
      <div className="flex items-center space-x-4">
        {session?.user && (
          <HeaderMenu
            name={session.user.name || session.user.email || 'User'}
            email={session.user.email || ''}
            image={session.user.image}
          />
        )}
      </div>
    </header>
  );
}
