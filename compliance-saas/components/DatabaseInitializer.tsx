'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function DatabaseInitializer() {
  const { data: session } = useSession();

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch('/api/db/init', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || typeof data !== 'object') {
          throw new Error('Expected a valid JSON object but got null/invalid data.');
        }

        console.log('Response from /api/db/init:', data);
        console.log('Database initialization:', data);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    // Initialize immediately, don't wait for session
    init();
  }, []); // Remove session dependency since we don't need it

  return null;
}
