"use client"

import { useState } from 'react'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-xl transform rotate-6"></div>
            <div className="absolute inset-0 bg-indigo-600 rounded-xl transform -rotate-6"></div>
            <div className="absolute inset-0 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">A</span>
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your compliance dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
