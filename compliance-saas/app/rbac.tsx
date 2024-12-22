import React, { useState } from 'react';

const roles = [
  {
    name: 'Admin',
    permissions: ['view_all', 'edit_all', 'delete_all'],
  },
  {
    name: 'Compliance Officer',
    permissions: ['view_all', 'edit_compliance', 'approve_reports'],
  },
  {
    name: 'Contributor',
    permissions: ['view_own', 'edit_own'],
  },
  {
    name: 'Viewer',
    permissions: ['view_all'],
  },
];

const RBAC = () => {
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const handleRoleChange = (roleName) => {
    const role = roles.find(r => r.name === roleName);
    setSelectedRole(role);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Role-Based Access Control</h1>
      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Select Role</label>
        <select
          id="role"
          value={selectedRole.name}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {roles.map((role, index) => (
            <option key={index} value={role.name}>{role.name}</option>
          ))}
        </select>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Permissions</h2>
        <ul className="list-disc pl-5">
          {selectedRole.permissions.map((permission, index) => (
            <li key={index}>{permission}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RBAC;
