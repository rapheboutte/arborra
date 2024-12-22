import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-full shadow-md bg-white px-1">
      <ul className="relative">
        <li className="relative">
          <NavLink to="/dashboard" className="block py-4 px-6 text-gray-700 hover:bg-gray-100">Dashboard</NavLink>
        </li>
        <li className="relative">
          <NavLink to="/tasks" className="block py-4 px-6 text-gray-700 hover:bg-gray-100">Task Manager</NavLink>
        </li>
        <li className="relative">
          <NavLink to="/documents" className="block py-4 px-6 text-gray-700 hover:bg-gray-100">Document Center</NavLink>
        </li>
        <li className="relative">
          <NavLink to="/reports" className="block py-4 px-6 text-gray-700 hover:bg-gray-100">Reports Generator</NavLink>
        </li>
        <li className="relative">
          <NavLink to="/notifications" className="block py-4 px-6 text-gray-700 hover:bg-gray-100">Notifications Panel</NavLink>
        </li>
        <li className="relative">
          <NavLink to="/settings" className="block py-4 px-6 text-gray-700 hover:bg-gray-100">Settings</NavLink>
        </li>
        <li className="relative">
          <NavLink to="/knowledgeBase" className="block py-4 px-6 text-gray-700 hover:bg-gray-100">Compliance Knowledge Base</NavLink>
        </li>
        <li className="relative">
          <NavLink to="/calendar" className="block py-4 px-6 text-gray-700 hover:bg-gray-100">Compliance Calendar</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
