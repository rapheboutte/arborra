export const Permissions = {
  // Organization management
  MANAGE_ORGANIZATION: "manage_organization",
  MANAGE_USERS: "manage_users",
  MANAGE_SETTINGS: "manage_settings",
  
  // Task management
  VIEW_TASKS: "view_tasks",
  CREATE_TASKS: "create_tasks",
  EDIT_TASKS: "edit_tasks",
  DELETE_TASKS: "delete_tasks",
  
  // Document management
  VIEW_DOCUMENTS: "view_documents",
  UPLOAD_DOCUMENTS: "upload_documents",
  DELETE_DOCUMENTS: "delete_documents",
  
  // Reports
  VIEW_REPORTS: "view_reports",
  GENERATE_REPORTS: "generate_reports"
} as const;

export type Permission = keyof typeof Permissions;

export const RolePermissions: Record<string, Permission[]> = {
  admin: Object.values(Permissions) as Permission[],
  user: [
    Permissions.VIEW_TASKS,
    Permissions.VIEW_DOCUMENTS,
    Permissions.VIEW_REPORTS,
    Permissions.EDIT_TASKS
  ]
};

export function hasPermission(userRole: string, permission: Permission): boolean {
  return RolePermissions[userRole]?.includes(permission) ?? false;
}

export function validatePermissions(userRole: string, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}
