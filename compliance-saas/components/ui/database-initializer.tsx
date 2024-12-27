'use client';

import { useEffect, useState } from 'react';
import { prisma } from '@/lib/prisma';

export function DatabaseInitializer() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Add any database initialization logic here
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    if (!initialized) {
      initializeDatabase();
    }
  }, [initialized]);

  return null;
}
