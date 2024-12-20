"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Activity, CheckCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

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

const companyName = "Jane's Retail Store";

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

  const [selectedReport, setSelectedReport] = useState('GDPR Audit Report');

  const reportTypes = [
    'GDPR Audit Report',
    'HIPAA Compliance Summary',
    'OSHA Safety Audit',
  ];

  const [reportSections, setReportSections] = useState([
    'Completed Tasks',
    'Stored Documents',
    'Compliance Progress',
  ]);

  const toggleSection = (section) => {
    setReportSections((prevSections) =>
      prevSections.includes(section)
        ? prevSections.filter((s) => s !== section)
        : [...prevSections, section]
    );
  };

  const exportReport = (format) => {
    alert(`Report exported as ${format}!`);
  };

  const generateReport = () => {
    alert('Report generated successfully!');
  };

  const [selectedTemplate, setSelectedTemplate] = useState('GDPR Audit Report');

  const templates = [
    'GDPR Audit Report',
    'HIPAA Compliance Summary',
    'OSHA Safety Audit',
  ];

  const generateTemplateReport = () => {
    alert(`Generating ${selectedTemplate}...`);
  };

  const recommendations = [
    { tip: 'Update your privacy policy to reflect new GDPR changes.', action: 'Learn More' },
    { tip: 'You may be non-compliant with OSHA workplace safety standards.', action: 'Check Now' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {companyName}</h1>

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

      <div className="flex space-x-4 mb-8">
        <Button>Add a Task</Button>
        <Button>Upload a Document</Button>
        <Button>Generate Report</Button>
      </div>

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
    </div>
  );
}
