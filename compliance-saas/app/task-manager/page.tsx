'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Plus, Download, Filter } from 'lucide-react';
import { mockComplianceData } from '@/lib/mocks/gdpr';

interface Task {
  id: string;
  name: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: number;
  assignedTo: string;
  regulation: string;
  type: string;
}

const regulations = ['GDPR', 'HIPAA', 'SOX', 'CCPA', 'OSHA'];
const taskTypes = ['Review', 'Audit', 'Training', 'Documentation', 'Implementation'];
const priorities = ['High', 'Medium', 'Low'];

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filterRegulation, setFilterRegulation] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedFilter, setSavedFilter] = useState<string>('');

  // Initialize tasks from compliance data
  useEffect(() => {
    const allTasks: Task[] = [];
    Object.entries(mockComplianceData).forEach(([regulation, data]) => {
      data.requirements.forEach((req: any) => {
        allTasks.push({
          id: req.id,
          name: req.title,
          deadline: req.dueDate,
          priority: req.priority === 'high' ? 'High' : req.priority === 'medium' ? 'Medium' : 'Low',
          status: req.status === 'compliant' ? 100 : req.status === 'in_progress' ? 50 : 0,
          assignedTo: 'Unassigned',
          regulation: regulation.toUpperCase(),
          type: req.type || 'Review'
        });
      });
    });
    setTasks(allTasks);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesRegulation = !filterRegulation || task.regulation === filterRegulation;
    const matchesType = !filterType || task.type === filterType;
    const matchesSearch = !searchQuery || 
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.regulation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegulation && matchesType && matchesSearch;
  });

  const completedTasks = tasks.filter(task => task.status === 100).length;
  const inProgressTasks = tasks.filter(task => task.status > 0 && task.status < 100).length;
  const notStartedTasks = tasks.filter(task => task.status === 0).length;
  const completionPercentage = (completedTasks / tasks.length) * 100;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(filteredTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleTaskSelect = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Filter className="w-4 h-4 mr-2" />
            Save Filter
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Task
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">
          Progress: {completedTasks} of {tasks.length} tasks completed ({completionPercentage.toFixed(1)}%)
        </div>
        <Progress value={completionPercentage} className="h-2" />
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Completed: {completedTasks}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm">In Progress: {inProgressTasks}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-sm">Not Started: {notStartedTasks}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={filterRegulation} onValueChange={setFilterRegulation}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Regulation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Regulations</SelectItem>
            {regulations.map(reg => (
              <SelectItem key={reg} value={reg}>{reg}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {taskTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by task name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[300px]"
        />
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedTasks.length === filteredTasks.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Task Name</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Regulation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={(checked) => handleTaskSelect(task.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>{new Date(task.deadline).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <Progress value={task.status} className="h-2 flex-1" />
                      <span className="text-sm text-gray-500">{task.status}%</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{task.assignedTo}</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      Assign
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{task.regulation}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
