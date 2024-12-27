import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { DatabaseInitializer } from '@/components/DatabaseInitializer';
import { Metadata } from 'next';
import { Navigation } from '@/components/ui/navigation';
import { TopBar } from '@/components/ui/TopBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Compliance Management',
  description: 'Enterprise compliance management solution',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <DatabaseInitializer />
          <div className="flex min-h-screen bg-gray-50">
            <Navigation />
            <div className="flex-1">
              <TopBar />
              <main className="p-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
