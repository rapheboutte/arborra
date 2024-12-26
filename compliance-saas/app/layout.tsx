import './globals.css'
import { Inter } from 'next/font/google'
import { Sidebar } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { TooltipProvider } from '@/components/ui/tooltip'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ComplianceHub - Compliance Management for SMBs',
  description: 'Simplify your compliance management with ComplianceHub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <TooltipProvider>
          <div className="flex h-full bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-0">
              <TopBar />
              <main className="flex-1 overflow-auto bg-gray-50">
                {children}
              </main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  )
}
