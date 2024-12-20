import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ComplianceItem } from "./ComplianceItem"

// Mock data - in a real application, this would come from an API or database
const complianceTasks = [
  { id: 1, title: "Update privacy policy", status: "In Progress", dueDate: "2023-07-15" },
  { id: 2, title: "Conduct security audit", status: "Not Started", dueDate: "2023-08-01" },
  { id: 3, title: "Review data retention policies", status: "Completed", dueDate: "2023-06-30" },
]

export function ComplianceList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complianceTasks.map((task) => (
            <ComplianceItem key={task.id} task={task} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

