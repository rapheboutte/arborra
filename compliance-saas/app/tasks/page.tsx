"use client";

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { MoreVertical, Filter, Download } from 'lucide-react';
import { ProtectedComponent } from "@/components/auth/ProtectedComponent";
import { Permissions } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function getPriorityVariant(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return "destructive";
    case "medium":
      return "warning";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function TasksPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Data Protection Impact Assessment",
      deadline: "2025-01-01",
      priority: "High",
      status: "In Progress",
      progress: 50,
      regulation: "GDPR",
      type: "Review"
    },
    {
      id: 2,
      title: "Data Processing Records Update",
      deadline: "2025-02-14",
      priority: "Medium",
      status: "Not Started",
      progress: 0,
      regulation: "GDPR",
      type: "Review"
    },
    // Add other tasks as shown in the image
  ]);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    deadline: "",
    priority: "Medium",
    regulation: "GDPR",
    type: "Review",
    status: "Not Started",
    progress: 0
  });

  const [selectedRegulation, setSelectedRegulation] = useState("All Regulations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");

  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
  const overdueTasks = tasks.filter(t => new Date(t.deadline) < new Date()).length;

  const handleAddTask = () => {
    if (!session) return;
    
    setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
    setNewTask({
      title: "",
      deadline: "",
      priority: "Medium",
      regulation: "GDPR",
      type: "Review",
      status: "Not Started",
      progress: 0
    });
    setIsAddTaskOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Task Management</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Save Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <ProtectedComponent requiredPermission={Permissions.CREATE_TASKS}>
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="bg-blue-600">Add Task</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[475px]">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>
                    Create a new compliance task with the details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                    >
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
                  <div className="grid gap-2">
                    <Label htmlFor="regulation">Regulation</Label>
                    <Select
                      value={newTask.regulation}
                      onValueChange={(value) => setNewTask({ ...newTask, regulation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select regulation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GDPR">GDPR</SelectItem>
                        <SelectItem value="HIPAA">HIPAA</SelectItem>
                        <SelectItem value="SOX">SOX</SelectItem>
                        <SelectItem value="CCPA">CCPA</SelectItem>
                        <SelectItem value="OSHA">OSHA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask}>Add Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </ProtectedComponent>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Total Tasks</div>
          <div className="text-2xl font-semibold">{tasks.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-2xl font-semibold text-green-600">{completedTasks}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-2xl font-semibold text-blue-600">{inProgressTasks}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500">Overdue</div>
          <div className="text-2xl font-semibold text-red-600">{overdueTasks}</div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Select value={selectedRegulation} onValueChange={setSelectedRegulation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Regulations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Regulations</SelectItem>
            <SelectItem value="GDPR">GDPR</SelectItem>
            <SelectItem value="HIPAA">HIPAA</SelectItem>
            <SelectItem value="SOX">SOX</SelectItem>
            <SelectItem value="CCPA">CCPA</SelectItem>
            <SelectItem value="OSHA">OSHA</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
            <SelectItem value="Update">Update</SelectItem>
            <SelectItem value="Implementation">Implementation</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 flex gap-4 border-b">
          <Input placeholder="Search tasks..." className="max-w-sm" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Task</TableHead>
              <TableHead className="w-[120px]">Deadline</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[200px]">Progress</TableHead>
              <TableHead className="w-[120px]">Regulation</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{formatDate(task.deadline)}</TableCell>
                <TableCell>
                  <Badge
                    variant={getPriorityVariant(task.priority)}
                    className="capitalize"
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${
                        task.status === "In Progress"
                          ? "bg-blue-500"
                          : task.status === "Completed"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    {task.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-[150px]">
                    <Progress value={task.progress} className="h-2" />
                  </div>
                </TableCell>
                <TableCell>{task.regulation}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell className="text-right">
                  <ProtectedComponent requiredPermission={Permissions.EDIT_TASKS}>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </ProtectedComponent>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
