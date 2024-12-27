'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Save, Lock, Globe, Bell, Mail } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState({
    companyName: 'Arborra',
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: true,
    language: 'en',
    timezone: 'America/Chicago',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings update
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure global system settings and preferences.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
          {/* General Settings */}
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  General Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Basic configuration options for your organization.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="company-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="company-name"
                      id="company-name"
                      value={settings.companyName}
                      onChange={(e) =>
                        setSettings({ ...settings, companyName: e.target.value })
                      }
                      className="block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="pt-8">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Notifications
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure how and when you want to be notified.
                </p>
              </div>

              <div className="mt-6">
                <fieldset>
                  <div className="space-y-4">
                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="email-notifications"
                          name="email-notifications"
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              emailNotifications: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="email-notifications"
                          className="font-medium text-gray-700"
                        >
                          Email notifications
                        </label>
                        <p className="text-gray-500">
                          Get notified when tasks are assigned or completed.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="push-notifications"
                          name="push-notifications"
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              pushNotifications: e.target.checked,
                            })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="push-notifications"
                          className="font-medium text-gray-700"
                        >
                          Push notifications
                        </label>
                        <p className="text-gray-500">
                          Receive push notifications in your browser.
                        </p>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>

            {/* Security Settings */}
            <div className="pt-8">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Security
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Configure security settings and authentication methods.
                </p>
              </div>

              <div className="mt-6">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="2fa"
                      name="2fa"
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          twoFactorAuth: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="2fa" className="font-medium text-gray-700">
                      Two-factor authentication
                    </label>
                    <p className="text-gray-500">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
