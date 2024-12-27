"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { TooltipProvider } from "@/components/providers/TooltipProvider";

export function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {session && !isAuthPage && <Sidebar />}
      <div className="flex-1 flex flex-col min-h-0">
        {session && !isAuthPage && <TopBar />}
        <main className={`flex-1 overflow-auto ${!isAuthPage ? 'bg-gray-50' : ''}`}>
          <TooltipProvider>{children}</TooltipProvider>
        </main>
      </div>
    </div>
  );
}
