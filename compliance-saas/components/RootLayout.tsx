"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { HeaderMenu } from "@/components/HeaderMenu";

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

  if (!session && !isAuthPage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthPage && (
        <div className="fixed inset-y-0 z-50 flex">
          <Sidebar />
        </div>
      )}
      <main className={`flex min-h-screen flex-col ${!isAuthPage ? 'ml-[240px]' : ''}`}>
        {!isAuthPage && <HeaderMenu />}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
