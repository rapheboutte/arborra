"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker"
import { AlertTriangle, CheckCircle, Download, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-24">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Compliance Analytics</h2>
        <div className="flex items-center gap-4">
          <CalendarDateRangePicker />
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <Button>
              Schedule Report
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TabsList className="ml-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="tasks">Tasks & Actions</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <Progress value={78} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents Requiring Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground mt-2">Due within 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-2">4 high priority</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Framework Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3/4</div>
                <p className="text-xs text-muted-foreground mt-2">GDPR, HIPAA, SOX active</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Critical Findings</CardTitle>
                <CardDescription>Issues requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="rounded-md bg-destructive/15 p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">HIPAA Compliance Gap</p>
                      <p className="text-sm text-destructive/90">Missing data encryption policy documentation</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-md bg-yellow-100 p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">GDPR Review Required</p>
                      <p className="text-sm text-yellow-800/90">Privacy policy needs update for new data processing activities</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Completed compliance milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">SOX Documentation Complete</p>
                      <p className="text-sm text-green-800/90">All required financial controls documented</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">ISO 27001 Audit Ready</p>
                      <p className="text-sm text-green-800/90">Information security policies updated</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>GDPR Compliance</CardTitle>
                  <Progress value={85} className="w-[60px]" />
                </div>
                <CardDescription>Last updated: 2 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Data Processing Records</TableCell>
                      <TableCell className="text-right text-green-600">Complete</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Privacy Notices</TableCell>
                      <TableCell className="text-right text-yellow-600">Review Needed</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Subject Rights Procedures</TableCell>
                      <TableCell className="text-right text-green-600">Complete</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>HIPAA Compliance</CardTitle>
                  <Progress value={72} className="w-[60px]" />
                </div>
                <CardDescription>Last updated: 5 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Security Risk Assessment</TableCell>
                      <TableCell className="text-right text-green-600">Complete</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Privacy Policies</TableCell>
                      <TableCell className="text-right text-red-600">Incomplete</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Training Records</TableCell>
                      <TableCell className="text-right text-green-600">Complete</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Review Status</CardTitle>
              <CardDescription>Documents requiring attention or review</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Framework</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Data Processing Agreement
                    </TableCell>
                    <TableCell>GDPR</TableCell>
                    <TableCell>
                      <span className="text-yellow-600">Review Needed</span>
                    </TableCell>
                    <TableCell>Jan 15, 2025</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Encryption Policy
                    </TableCell>
                    <TableCell>HIPAA</TableCell>
                    <TableCell>
                      <span className="text-red-600">Missing</span>
                    </TableCell>
                    <TableCell>Jan 10, 2025</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Tasks</CardTitle>
              <CardDescription>Action items and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Framework</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Update data encryption policy</TableCell>
                    <TableCell>HIPAA</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">High</span>
                    </TableCell>
                    <TableCell>Jan 10, 2025</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Review privacy notices</TableCell>
                    <TableCell>GDPR</TableCell>
                    <TableCell>
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">Medium</span>
                    </TableCell>
                    <TableCell>Jan 15, 2025</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
