import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ComplianceOverview() {
  // This would typically come from an API or database
  const complianceScore = 75
  const tasksCompleted = 15
  const totalTasks = 20

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Compliance Score</p>
            <p className="text-3xl font-bold">{complianceScore}%</p>
            <Progress value={complianceScore} className="mt-2" />
          </div>
          <div>
            <p className="text-sm font-medium">Tasks Completed</p>
            <p className="text-3xl font-bold">{tasksCompleted}/{totalTasks}</p>
            <Progress value={(tasksCompleted / totalTasks) * 100} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

