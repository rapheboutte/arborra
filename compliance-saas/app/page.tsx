"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Activity, CheckCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

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
    { name: 'Complete Employee HIPAA Training', dueDate: '2024-12-25', priority: 'High', status: 'Pending', recurring: false, relatedRegulation: 'HIPAA' },
    { name: 'Submit Quarterly Safety Report', dueDate: '2024-12-30', priority: 'Low', status: 'Pending', recurring: false, relatedRegulation: 'OSHA' },
    { name: 'Conduct Annual Compliance Review', dueDate: '2025-01-15', priority: 'High', status: 'Pending', recurring: true, relatedRegulation: 'GDPR' },
  ],
};

const documents = [
  { name: 'Privacy Policy', category: 'Legal', date: '2024-01-15', status: 'Updated' },
  { name: 'Safety Training Certificate', category: 'Training', date: '2024-02-10', status: 'Expiring Soon' },
];

const notifications = [
  { message: 'Data Protection Policy Update due in 5 days', type: 'important' },
  { message: 'HIPAA training certificates expiring soon', type: 'critical' },
];

const companyName = "Jane's Retail Store";

const Dashboard = () => {
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

  const router = useRouter();

  useEffect(() => {
    if (!router) return;
  }, [router]);

  const dismissNotification = (index) => {
    setNotifs(notifs.filter((notif, i) => i !== index));
  };

  const [onboardingStep, setOnboardingStep] = useState(0);
  const onboardingSteps = [
    'Welcome to Arborra! Let’s start by adding your first compliance task.',
    'Great! Now, upload a compliance document to the Document Center.',
    'Finally, configure your notification settings to stay informed.',
  ];

  const nextStep = () => {
    setOnboardingStep((prevStep) => Math.min(prevStep + 1, onboardingSteps.length - 1));
  };

  const prevStep = () => {
    setOnboardingStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {onboardingStep < onboardingSteps.length && (
        <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg">
          <p>{onboardingSteps[onboardingStep]}</p>
          <div className="flex justify-between mt-2">
            <button onClick={prevStep} className="text-blue-600 hover:underline">Back</button>
            <button onClick={nextStep} className="text-blue-600 hover:underline">Next</button>
          </div>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%` }}></div>
      </div>
      <h1 className="text-3xl font-bold mb-8">Welcome, {companyName}</h1>
      <Card className="mb-8 p-6 bg-gray-100">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-4xl font-extrabold text-blue-600" title="Calculated based on completed tasks and document compliance">{data.complianceScore}%</div>
            <Button className="bg-green-500 hover:bg-green-600 text-white">View Details</Button>
          </div>
          <div className="mt-4">
            {data.regulations.map((regulation, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span className="font-semibold" title={`Progress calculated based on ${regulation.name} requirements`}>{regulation.name}</span>
                <div className="w-full bg-gray-200 rounded-full h-2 mx-4">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${regulation.progress}%` }}></div>
                </div>
                <span>{regulation.progress}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Recommended Steps</h3>
            <ul className="list-disc pl-5">
              <li>Complete 2 pending trainings under GDPR.</li>
              <li>Submit missing audit reports for HIPAA.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.tasks.map((task, index) => (
              <li key={index} className="flex items-center">
                {task.priority === 'High' && <span className="mr-2 text-red-600">🔴</span>}
                {task.name} – Due: {task.dueDate}
                <span className="ml-2 text-sm text-gray-500">(Related to {task.relatedRegulation})</span>
                {task.recurring && <span className="ml-2">🔄</span>}
              </li>
            ))}
          </ul>
          <a href="/tasks" className="text-blue-600 hover:underline mt-2 block">View All Tasks</a>
        </CardContent>
      </Card>

      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Document Center</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {docs.slice(0, 3).map((doc, index) => (
              <li key={index} className="flex items-center">
                {doc.name} – Updated on {doc.date}
                {doc.status === 'Expiring Soon' && <span className="text-yellow-500 ml-2">⚠</span>}
                {doc.status === 'Updated' && <span className="text-green-500 ml-2">✅</span>}
              </li>
            ))}
          </ul>
          <a href="/documents" className="text-blue-600 hover:underline mt-2 block">View All Documents</a>
        </CardContent>
      </Card>

      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Notifications Panel</CardTitle>
        </CardHeader>
        <CardContent>
          {notifs.map((notif, index) => (
            <div key={index} className={`flex items-center ${notif.type === 'critical' ? 'text-red-600' : notif.type === 'important' ? 'text-orange-600' : 'text-blue-600'}`}>
              {notif.message}
              <button className="ml-auto text-gray-500 hover:text-gray-700" onClick={() => dismissNotification(index)}>Dismiss</button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex space-x-6 mt-10">
        <Button title="Create a new compliance-related task for your team to complete." onClick={() => router.push('/tasks')} className="bg-blue-600 hover:bg-blue-700 text-white">Add a Task</Button>
        <Button title="Upload compliance documentation such as policies or certificates." onClick={() => router.push('/documents')} className="bg-blue-600 hover:bg-blue-700 text-white">Upload a Document</Button>
        <Button title="Create a summary report for audits, internal reviews, or stakeholder updates." onClick={() => router.push('/reports')} className="bg-blue-600 hover:bg-blue-700 text-white">Generate Report</Button>
      </div>

      <Card className="mt-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-base space-y-2">
          <p>Overdue Tasks: 2</p>
          <p>Expiring Documents: 3</p>
          <p>Compliance Framework Summary:</p>
          <p>HIPAA: 90% Complete</p>
          <p>GDPR: 70% Complete</p>
        </CardContent>
      </Card>

      <Card className="mt-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Generate Report</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">View All Tasks</Button>
        </CardContent>
      </Card>

      <Card className="mt-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Compliance Insights</CardTitle>
        </CardHeader>
        <CardContent className="text-base">
          <p>Your GDPR compliance improved by 15% last quarter.</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
