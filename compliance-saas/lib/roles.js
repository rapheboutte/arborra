// Simple role-based access control
const roles = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
};

export const checkPermission = (role, action) => {
  return roles[role]?.includes(action);
};
