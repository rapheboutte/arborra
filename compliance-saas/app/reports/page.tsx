"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data for the chart
const data = [
  { name: 'Jan', completed: 4, pending: 2, overdue: 1 },
  { name: 'Feb', completed: 3, pending: 3, overdue: 2 },
  { name: 'Mar', completed: 5, pending: 1, overdue: 0 },
  { name: 'Apr', completed: 4, pending: 2, overdue: 1 },
  { name: 'May', completed: 6, pending: 1, overdue: 0 },
  { name: 'Jun', completed: 5, pending: 2, overdue: 1 },
]

export default function ComplianceReporting() {
  const [category, setCategory] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('GDPR Audit Report')
  const [sections, setSections] = useState([])

  const templates = [
    'GDPR Audit Report',
    'HIPAA Compliance Summary',
    'OSHA Safety Audit',
  ];

  const generateTemplateReport = () => {
    alert(`Generating ${selectedTemplate}...`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Compliance Reporting</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="privacy">Privacy</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="date-range">Date Range</Label>
            <Select onValueChange={setDateRange}>
              <SelectTrigger id="date-range">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="last-90-days">Last 90 days</SelectItem>
                <SelectItem value="last-6-months">Last 6 months</SelectItem>
                <SelectItem value="last-year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Customization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="templateType">Select Report Template</Label>
              <Select onValueChange={setSelectedTemplate}>
                <SelectTrigger id="templateType">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template} value={template}>{template}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="sections">Include Sections</Label>
              <Select multiple onValueChange={setSections}>
                <SelectTrigger id="sections">
                  <SelectValue placeholder="Select sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="training">Training Records</SelectItem>
                  <SelectItem value="policy">Policy Updates</SelectItem>
                  <SelectItem value="audit">Audit Logs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-4" onClick={generateTemplateReport}>Run Report</Button>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Real-time preview of the report will be displayed here...</p>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Export as PDF
        </Button>
        <Button variant="outline">
          Export as Excel
        </Button>
        <Button>
          Email Report
        </Button>
      </div>
    </div>
  )
}
