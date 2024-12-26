"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ErrorPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <Alert variant="destructive">
          <AlertDescription>
            An error occurred during authentication. You will be redirected to the login page.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
