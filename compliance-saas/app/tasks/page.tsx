"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data
const tasks = [
  { id: 1, name: "Update privacy policy", deadline: "2023-07-15", recurrence: "Monthly", status: "In Progress", priority: "High" },
  { id: 2, name: "Conduct security audit", deadline: "2023-08-01", recurrence: "Quarterly", status: "Not Started", priority: "Medium" },
  { id: 3, name: "Review data retention policies", deadline: "2023-06-30", recurrence: "Annually", status: "Completed", priority: "Low" },
]

export default function TaskManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')
  const [taskRecurrence, setTaskRecurrence] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskList, setTaskList] = useState(tasks)
  const [filter, setFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTask = {
      id: taskList.length + 1,
      name: taskName,
      deadline: taskDeadline,
      recurrence: taskRecurrence,
      status: "Not Started",
      description: taskDescription,
      priority: "Medium",
    }
    setTaskList([...taskList, newTask])
    setIsDialogOpen(false)
    setTaskName('')
    setTaskDeadline('')
    setTaskRecurrence('')
    setTaskDescription('')
  }

  const handleEdit = (id: number) => {
    // Implement edit logic here
    console.log('Edit task with id:', id)
  }

  const handleComplete = (id: number) => {
    // Implement complete task logic here
    console.log('Complete task with id:', id)
  }

  const handleAddNotes = (id: number) => {
    // Implement add notes logic here
    console.log('Add notes to task with id:', id)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 p-6">
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add New Task</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>
                    Create a new compliance task. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="task-name" className="text-right">
                        Task Name
                      </Label>
                      <Input
                        id="task-name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="deadline" className="text-right">
                        Deadline
                      </Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={taskDeadline}
                        onChange={(e) => setTaskDeadline(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="recurrence" className="text-right">
                        Recurrence
                      </Label>
                      <Select onValueChange={setTaskRecurrence} className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select recurrence" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Daily">Daily</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Quarterly">Quarterly</SelectItem>
                          <SelectItem value="Annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-4 flex space-x-4">
            <Select onValueChange={setFilter} className="mr-4">
              <SelectTrigger>
                <SelectValue placeholder="Filter by Regulation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="GDPR">GDPR</SelectItem>
                <SelectItem value="HIPAA">HIPAA</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Audits">Audits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Name</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskList.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell className="space-x-2">
                    <Button onClick={() => handleEdit(task.id)}>Edit</Button>
                    <Button onClick={() => handleComplete(task.id)}>Complete Task</Button>
                    <Button onClick={() => handleAddNotes(task.id)}>Add Notes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
