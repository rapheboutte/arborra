"use client";

import { useSession } from "next-auth/react";
import { Permission, hasPermission } from "@/lib/auth";

export function ProtectedComponent({ 
  children, 
  requiredPermission 
}: { 
  children: React.ReactNode;
  requiredPermission: Permission;
}) {
  const { data: session } = useSession();
  
  if (!session?.user?.role) return null;
  
  if (!hasPermission(session.user.role, requiredPermission)) return null;
  
  return <>{children}</>;
}
