import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { RootLayout } from "@/components/RootLayout";
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arborra",
  description: "Compliance Management Platform",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <RootLayout>
            {children}
            <Toaster />
          </RootLayout>
        </Providers>
      </body>
    </html>
  );
}
