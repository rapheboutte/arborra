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
import { ChevronUp, ChevronDown } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multiselect';

// Mock data
const tasks = [
  { id: 1, name: "Update privacy policy", deadline: "2023-07-15", recurrence: "Monthly", status: "In Progress", priority: "High", description: "", createdAt: "2023-07-01" },
  { id: 2, name: "Conduct security audit", deadline: "2023-08-01", recurrence: "Quarterly", status: "Not Started", priority: "Medium", description: "", createdAt: "2023-06-15" },
  { id: 3, name: "Review data retention policies", deadline: "2023-06-30", recurrence: "Annually", status: "Completed", priority: "Low", description: "", createdAt: "2023-06-01" },
  { id: 4, name: "GDPR compliance check", deadline: "2023-07-20", recurrence: "Annually", status: "Not Started", priority: "High", description: "Ensure all data handling is compliant.", createdAt: "2023-06-10" },
  { id: 5, name: "Employee training on data protection", deadline: "2023-07-25", recurrence: "Bi-annually", status: "In Progress", priority: "Medium", description: "Training sessions scheduled.", createdAt: "2023-06-12" },
  { id: 6, name: "Third-party vendor compliance review", deadline: "2023-08-10", recurrence: "Quarterly", status: "Not Started", priority: "High", description: "Review contracts and compliance.", createdAt: "2023-06-20" },
  { id: 7, name: "Update incident response plan", deadline: "2023-09-01", recurrence: "Annually", status: "In Progress", priority: "High", description: "Plan updates needed.", createdAt: "2023-06-25" },
  { id: 8, name: "Internal compliance audit", deadline: "2023-10-05", recurrence: "Quarterly", status: "Not Started", priority: "Medium", description: "Schedule audit with internal team.", createdAt: "2023-07-01" },
  { id: 9, name: "Update access control policies", deadline: "2023-11-15", recurrence: "Annually", status: "Completed", priority: "Low", description: "Policies updated.", createdAt: "2023-07-10" },
  { id: 10, name: "Conduct risk assessment", deadline: "2023-12-20", recurrence: "Annually", status: "Not Started", priority: "High", description: "Assess potential risks.", createdAt: "2023-07-15" },
  { id: 11, name: "Data encryption review", deadline: "2024-01-15", recurrence: "Annually", status: "Not Started", priority: "High", description: "Ensure all data is encrypted.", createdAt: "2023-07-20" },
  { id: 12, name: "Compliance software update", deadline: "2024-02-01", recurrence: "Monthly", status: "In Progress", priority: "Medium", description: "Update to latest version.", createdAt: "2023-07-25" },
  { id: 13, name: "Network security assessment", deadline: "2024-03-10", recurrence: "Quarterly", status: "Not Started", priority: "High", description: "Assess network vulnerabilities.", createdAt: "2023-08-01" },
  { id: 14, name: "Privacy impact assessment", deadline: "2024-04-05", recurrence: "Annually", status: "Not Started", priority: "Medium", description: "Evaluate privacy risks.", createdAt: "2023-08-10" },
  { id: 15, name: "Compliance report generation", deadline: "2024-05-15", recurrence: "Monthly", status: "Completed", priority: "Low", description: "Generate monthly reports.", createdAt: "2023-08-15" },
  { id: 16, name: "User access review", deadline: "2024-06-20", recurrence: "Quarterly", status: "In Progress", priority: "High", description: "Review user access rights.", createdAt: "2023-08-20" },
  { id: 17, name: "Firewall configuration audit", deadline: "2024-07-25", recurrence: "Annually", status: "Not Started", priority: "Medium", description: "Audit firewall settings.", createdAt: "2023-09-01" },
  { id: 18, name: "Data breach response drill", deadline: "2024-08-30", recurrence: "Bi-annually", status: "In Progress", priority: "High", description: "Conduct breach response test.", createdAt: "2023-09-10" },
  { id: 19, name: "Compliance training for new hires", deadline: "2024-09-15", recurrence: "Monthly", status: "Not Started", priority: "Medium", description: "Train new employees.", createdAt: "2023-09-20" },
  { id: 20, name: "Vendor risk management", deadline: "2024-10-05", recurrence: "Quarterly", status: "Completed", priority: "Low", description: "Assess vendor risks.", createdAt: "2023-10-01" },
  { id: 21, name: "Cloud service compliance check", deadline: "2024-11-10", recurrence: "Annually", status: "Not Started", priority: "High", description: "Ensure cloud services are compliant.", createdAt: "2023-10-15" },
  { id: 22, name: "Policy review and update", deadline: "2024-12-15", recurrence: "Annually", status: "In Progress", priority: "Medium", description: "Update company policies.", createdAt: "2023-11-01" },
  { id: 23, name: "Data classification review", deadline: "2025-01-20", recurrence: "Annually", status: "Not Started", priority: "High", description: "Review data classification.", createdAt: "2023-11-10" },
  { id: 24, name: "Incident management training", deadline: "2025-02-05", recurrence: "Bi-annually", status: "In Progress", priority: "Medium", description: "Train staff on incident management.", createdAt: "2023-11-15" },
  { id: 25, name: "Compliance dashboard update", deadline: "2025-03-15", recurrence: "Monthly", status: "Completed", priority: "Low", description: "Update dashboard features.", createdAt: "2023-12-01" },
  { id: 26, name: "Regulatory change monitoring", deadline: "2025-04-20", recurrence: "Monthly", status: "Not Started", priority: "High", description: "Monitor regulatory changes.", createdAt: "2023-12-10" },
  { id: 27, name: "Access log review", deadline: "2025-05-10", recurrence: "Quarterly", status: "In Progress", priority: "Medium", description: "Review system access logs.", createdAt: "2023-12-15" },
  { id: 28, name: "Security awareness campaign", deadline: "2025-06-25", recurrence: "Annually", status: "Not Started", priority: "High", description: "Launch awareness campaign.", createdAt: "2024-01-01" },
  { id: 29, name: "Data backup verification", deadline: "2025-07-30", recurrence: "Quarterly", status: "Completed", priority: "Low", description: "Verify backup integrity.", createdAt: "2024-01-10" },
  { id: 30, name: "Compliance policy dissemination", deadline: "2025-08-15", recurrence: "Monthly", status: "Not Started", priority: "Medium", description: "Disseminate updated policies.", createdAt: "2024-01-20" }
];

const recurrenceOrder = {
  "Daily": 1,
  "Weekly": 2,
  "Monthly": 3,
  "Quarterly": 4,
  "Bi-annually": 5,
  "Annually": 6
};

export default function TaskManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')
  const [taskRecurrence, setTaskRecurrence] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskPriority, setTaskPriority] = useState('')
  const [taskStatus, setTaskStatus] = useState('')
  const [taskList, setTaskList] = useState(tasks)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' })
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const statusOptions = ['In Progress', 'Not Started', 'Completed', 'Overdue'];

  const cycleStatusFilter = () => {
    const currentIndex = statusOptions.indexOf(selectedStatus);
    const nextIndex = (currentIndex + 1) % (statusOptions.length + 1);
    setSelectedStatus(nextIndex === statusOptions.length ? 'All' : statusOptions[nextIndex]);
  };

  const sortedTasks = [...taskList].sort((a, b) => {
    if (sortConfig.key === 'name') {
      if (a.name < b.name) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a.name > b.name) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    if (sortConfig.key === 'deadline') {
      if (a.deadline < b.deadline) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a.deadline > b.deadline) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    if (sortConfig.key === 'recurrence') {
      if (recurrenceOrder[a.recurrence] < recurrenceOrder[b.recurrence]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (recurrenceOrder[a.recurrence] > recurrenceOrder[b.recurrence]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    if (sortConfig.key === 'priority') {
      if (a.priority < b.priority) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a.priority > b.priority) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  const filteredTasks = selectedStatus === 'All' ? sortedTasks : sortedTasks.filter(task => task.status === selectedStatus);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        setSortConfig({ key: '', direction: 'descending' }); // Reset to default
        return;
      }
    }
    setSortConfig({ key, direction });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTaskId !== null) {
      setTaskList(taskList.map(task => task.id === editingTaskId ? { ...task, name: taskName, deadline: taskDeadline, recurrence: taskRecurrence, status: taskStatus, description: taskDescription, priority: taskPriority } : task));
      setEditingTaskId(null);
    } else {
      const newTask = {
        id: taskList.length + 1,
        name: taskName,
        deadline: taskDeadline,
        recurrence: taskRecurrence,
        status: taskStatus,
        description: taskDescription,
        priority: taskPriority,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTaskList([...taskList, newTask]);
    }
    setIsDialogOpen(false)
    setTaskName('')
    setTaskDeadline('')
    setTaskRecurrence('')
    setTaskDescription('')
    setTaskPriority('')
    setTaskStatus('')
  }

  const handleEdit = (id) => {
    const taskToEdit = taskList.find(task => task.id === id);
    setTaskName(taskToEdit.name);
    setTaskDeadline(taskToEdit.deadline);
    setTaskRecurrence(taskToEdit.recurrence);
    setTaskDescription(taskToEdit.description);
    setTaskPriority(taskToEdit.priority);
    setTaskStatus(taskToEdit.status);
    setEditingTaskId(id);
    setIsDialogOpen(true);
  };

  const handleComplete = (id) => {
    if (window.confirm('Are you sure you want to mark this task as complete?')) {
      setTaskList(taskList.map(task =>
        task.id === id ? { ...task, status: 'Completed' } : task
      ));
    }
  };

  const handleAddNotes = (id) => {
    const notes = prompt('Enter notes:');
    setTaskList(taskList.map(task =>
      task.id === id ? { ...task, description: notes } : task
    ));
  };

  const handleNewTask = () => {
    setTaskName('');
    setTaskDeadline('');
    setTaskRecurrence('');
    setTaskDescription('');
    setTaskPriority('');
    setTaskStatus('');
    setEditingTaskId(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{ userSelect: 'none' }}>
      <Card className="mb-8 p-6 min-h-[600px] overflow-visible">
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild onClick={handleNewTask}>
                <Button>Add New Task</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingTaskId !== null ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                  <DialogDescription>
                    {editingTaskId !== null ? 'Update the task details.' : 'Create a new compliance task. Click save when you\'re done.'}
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
                          <SelectItem value="Bi-annually">Bi-annually</SelectItem>
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priority
                      </Label>
                      <Select onValueChange={setTaskPriority} className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select onValueChange={setTaskStatus} className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingTaskId !== null ? 'Update Task' : 'Save'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort('name')} className="cursor-pointer">
                  Task Name <span className="inline-block ml-1">{sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? <ChevronUp /> : <ChevronDown />)}</span>
                </TableHead>
                <TableHead onClick={() => requestSort('recurrence')} className="cursor-pointer">
                  Recurrence <span className="inline-block ml-1">{sortConfig.key === 'recurrence' && (sortConfig.direction === 'ascending' ? <ChevronUp /> : <ChevronDown />)}</span>
                </TableHead>
                <TableHead className="text-left">Description</TableHead>
                <TableHead onClick={() => requestSort('deadline')} className="cursor-pointer">
                  Deadline <span className="inline-block ml-1">{sortConfig.key === 'deadline' && (sortConfig.direction === 'ascending' ? <ChevronUp /> : <ChevronDown />)}</span>
                </TableHead>
                <TableHead onClick={() => requestSort('priority')} className="cursor-pointer">
                  Priority <span className="inline-block ml-1">{sortConfig.key === 'priority' && (sortConfig.direction === 'ascending' ? <ChevronUp /> : <ChevronDown />)}</span>
                </TableHead>
                <TableHead onClick={cycleStatusFilter} className="cursor-pointer">
                  Status: {selectedStatus}
                </TableHead>
                <TableHead className="text-center w-1/6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map(task => (
                <TableRow key={task.id} className={task.status === 'Completed' ? 'bg-gray-200' : ''}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{task.recurrence}</TableCell>
                  <TableCell>{task.description || 'No description'}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell className="flex justify-center space-x-4 items-center">
                    <Button onClick={() => handleEdit(task.id)} style={{ minWidth: '80px' }}>Edit</Button>
                    {task.status === 'Completed' ? (
                      <span className="text-green-500" style={{ minWidth: '80px', textAlign: 'center' }}>✔</span>
                    ) : (
                      <Button onClick={() => handleComplete(task.id)} style={{ minWidth: '80px' }}>Complete</Button>
                    )}
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
