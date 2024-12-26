"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { TooltipProvider } from "@/components/providers/TooltipProvider";

export function RootLayout({
  children,
  isAuthPage,
}: {
  children: React.ReactNode;
  isAuthPage: boolean;
}) {
  const { data: session } = useSession();

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
