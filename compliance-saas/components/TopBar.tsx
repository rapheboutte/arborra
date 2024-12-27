"use client";

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";

export const TopBar = () => {
  const router = useRouter();

  return (
    <div className="h-16 px-4 flex items-center justify-end">
      <div className="w-72">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-8 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};
