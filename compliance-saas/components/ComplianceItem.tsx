import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ComplianceTask {
  id: number
  title: string
  status: "Not Started" | "In Progress" | "Completed"
  dueDate: string
}

interface ComplianceItemProps {
  task: ComplianceTask
}

export function ComplianceItem({ task }: ComplianceItemProps) {
  const getStatusColor = (status: ComplianceTask["status"]) => {
    switch (status) {
      case "Not Started":
        return "bg-red-100 text-red-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
      </CardContent>
    </Card>
  )
}

