import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { RootLayout as ClientRootLayout } from "@/components/RootLayout";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arborra - Compliance Management",
  description: "Compliance management system for businesses",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ClientRootLayout>
            <Toaster position="top-right" />
            {children}
          </ClientRootLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
