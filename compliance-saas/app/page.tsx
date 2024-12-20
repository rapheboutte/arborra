import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Activity, CheckCircle, Clock } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
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

      {/* Calendar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Task Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
              <span>Document "Q2 Report" uploaded by John Doe</span>
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-green-500 mr-2"></span>
              <span>Task "Update Privacy Policy" completed</span>
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
              <span>New compliance requirement added: "GDPR Update"</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

