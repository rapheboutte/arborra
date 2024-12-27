'use client';

import React from 'react';
import RBAC from './rbac';

const Settings = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <RBAC />
    </div>
  );
};

export default Settings;
