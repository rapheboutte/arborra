"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Activity, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';

const mockData = {
  complianceScore: 85,
  regulations: [
    { name: 'GDPR', progress: 70 },
    { name: 'HIPAA', progress: 90 },
  ],
  alerts: [
    { message: '2 overdue tasks!', type: 'warning' },
    { message: 'Audit report due in 3 days', type: 'info' },
  ],
  tasks: [
    { name: 'Complete Employee HIPAA Training', dueDate: '2024-12-25', priority: 'High', status: 'Pending' },
    { name: 'Submit Quarterly Safety Report', dueDate: '2024-12-30', priority: 'Low', status: 'Pending' },
  ],
};

const documents = [
  { name: 'Privacy Policy', category: 'Legal', date: '2024-01-15' },
  { name: 'Safety Training Certificate', category: 'Training', date: '2024-02-10' },
];

const notifications = [
  { message: 'Data Protection Policy Update due in 5 days', type: 'info' },
  { message: 'HIPAA training certificates expiring soon', type: 'warning' },
];

export default function Dashboard() {
  const [data, setData] = useState(mockData);
  const [docs, setDocs] = useState(documents);
  const [notifs, setNotifs] = useState(notifications);
  const today = new Date();
  const modifiers = {
    overdue: { before: new Date('2023-07-15') },
    dueToday: { on: today },
    upcoming: { after: today, before: new Date('2023-08-01') },
    future: { after: new Date('2023-08-01') },
  };

  const modifierClassNames = {
    overdue: 'bg-red-500',
    dueToday: 'bg-yellow-500',
    upcoming: 'bg-blue-500',
    future: 'bg-green-500',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* Compliance Status */}
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Compliance Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-200 rounded-full h-6 mb-4">
            <div className="bg-green-500 h-6 rounded-full" style={{ width: `${data.complianceScore}%` }}></div>
          </div>
          <p className="text-sm">{data.complianceScore}% compliant with current regulations</p>
          {data.regulations.map((regulation) => (
            <div key={regulation.name} className="mb-2">
              <p>{regulation.name}: {regulation.progress}%</p>
              <div className="bg-gray-200 rounded-full h-4">
                <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${regulation.progress}%` }}></div>
              </div>
            </div>
          ))}
          {data.alerts.map((alert, index) => (
            <p key={index} className={`text-${alert.type === 'warning' ? 'red' : 'yellow'}-500`}>{alert.message}</p>
          ))}
        </CardContent>
      </Card>

      {/* Task Manager */}
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {data.tasks.map((task, index) => (
              <li key={index} className="mb-2">
                {task.name} - <span className="text-yellow-500">Due: {task.dueDate}</span>
                <button className="ml-2 text-blue-500">Mark as Done</button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Document Repository */}
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Document Center</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {docs.map((doc, index) => (
              <li key={index} className="mb-2">
                {doc.name} - <span className="text-gray-500">{doc.category}</span> (Uploaded: {doc.date})
              </li>
            ))}
          </ul>
          <button className="mt-4 text-blue-500">Upload New Document</button>
        </CardContent>
      </Card>

      {/* Notifications Panel */}
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Notifications Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {notifs.map((notification, index) => (
              <li key={index} className={`mb-2 text-${notification.type === 'warning' ? 'red' : 'yellow'}-500`}>
                {notification.message}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Reports Generator */}
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Reports Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <button className="text-blue-500">Generate Report</button>
        </CardContent>
      </Card>

      {/* Guided Recommendations */}
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Guided Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Get tips and prompts for staying compliant.</p>
        </CardContent>
      </Card>

      {/* Training and Updates */}
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Training and Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Access training modules and updates on regulations.</p>
        </CardContent>
      </Card>

      {/* Industry-Specific Insights */}
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Industry-Specific Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Receive personalized compliance tasks and templates.</p>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Due Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar and Task List */}
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Task Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <div className="w-1/2">
              <Calendar
                modifiers={modifiers}
                modifierClassNames={modifierClassNames}
              />
            </div>
            <div className="w-1/2 overflow-x-auto pl-0">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b"></th>
                    <th className="py-2 px-4 border-b">Task Name</th>
                    <th className="py-2 px-4 border-b">Deadline</th>
                    <th className="py-2 px-4 border-b">Recurrence</th>
                    <th className="py-2 px-4 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b"><span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span></td>
                    <td className="py-2 px-4 border-b">Update privacy policy</td>
                    <td className="py-2 px-4 border-b">2023-07-15</td>
                    <td className="py-2 px-4 border-b">Monthly</td>
                    <td className="py-2 px-4 border-b">In Progress</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="py-2 px-4 border-b"><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span></td>
                    <td className="py-2 px-4 border-b">Conduct security audit</td>
                    <td className="py-2 px-4 border-b">2023-08-01</td>
                    <td className="py-2 px-4 border-b">Quarterly</td>
                    <td className="py-2 px-4 border-b">Not Started</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b"><span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span></td>
                    <td className="py-2 px-4 border-b">Review data retention policies</td>
                    <td className="py-2 px-4 border-b">2023-06-30</td>
                    <td className="py-2 px-4 border-b">Annually</td>
                    <td className="py-2 px-4 border-b">Completed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
    </div>
  );
}
