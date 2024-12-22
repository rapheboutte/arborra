"use client";
import React, { useState, useEffect } from 'react';
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { saveAs } from 'file-saver';

// Mock data
const tasks = [
  { id: 1, name: "Update privacy policy", deadline: "2023-07-15", recurrence: "Monthly", status: "In Progress", priority: "High", description: "", createdAt: "2023-07-01", regulation: "GDPR", type: "Review", assignedUser: "", progress: 50, nextStep: "Review and approve policy updates", nextRecurrence: "2023-08-15", missedDeadline: false },
  { id: 2, name: "Conduct security audit", deadline: "2023-08-01", recurrence: "Quarterly", status: "Not Started", priority: "Medium", description: "", createdAt: "2023-06-15", regulation: "HIPAA", type: "Audit", assignedUser: "", progress: 0, nextStep: "Schedule audit with internal team", nextRecurrence: "2023-11-01", missedDeadline: false },
  { id: 3, name: "Review data retention policies", deadline: "2023-06-30", recurrence: "Annually", status: "Completed", priority: "Low", description: "", createdAt: "2023-06-01", regulation: "SOX", type: "Review", assignedUser: "", progress: 100, nextStep: "No next step available", nextRecurrence: "N/A", missedDeadline: false },
  { id: 4, name: "GDPR compliance check", deadline: "2023-07-20", recurrence: "Annually", status: "Not Started", priority: "High", description: "Ensure all data handling is compliant.", createdAt: "2023-06-10", regulation: "GDPR", type: "Training", assignedUser: "", progress: 0, nextStep: "Conduct compliance check", nextRecurrence: "2024-07-20", missedDeadline: false },
  { id: 5, name: "Employee training on data protection", deadline: "2023-07-25", recurrence: "Bi-annually", status: "In Progress", priority: "Medium", description: "Training sessions scheduled.", createdAt: "2023-06-12", regulation: "HIPAA", type: "Training", assignedUser: "", progress: 75, nextStep: "Complete training sessions", nextRecurrence: "2024-01-25", missedDeadline: false },
  { id: 6, name: "Third-party vendor compliance review", deadline: "2023-08-10", recurrence: "Quarterly", status: "Not Started", priority: "High", description: "Review contracts and compliance.", createdAt: "2023-06-20", regulation: "SOX", type: "Review", assignedUser: "", progress: 0, nextStep: "Schedule review with vendors", nextRecurrence: "2023-11-10", missedDeadline: false },
  { id: 7, name: "Update incident response plan", deadline: "2023-09-01", recurrence: "Annually", status: "In Progress", priority: "High", description: "Plan updates needed.", createdAt: "2023-06-25", regulation: "GDPR", type: "Review", assignedUser: "", progress: 25, nextStep: "Review and update plan", nextRecurrence: "2024-09-01", missedDeadline: false },
  { id: 8, name: "Internal compliance audit", deadline: "2023-10-05", recurrence: "Quarterly", status: "Not Started", priority: "Medium", description: "Schedule audit with internal team.", createdAt: "2023-07-01", regulation: "HIPAA", type: "Audit", assignedUser: "", progress: 0, nextStep: "Schedule audit", nextRecurrence: "2024-01-05", missedDeadline: false },
  { id: 9, name: "Update access control policies", deadline: "2023-11-15", recurrence: "Annually", status: "Completed", priority: "Low", description: "Policies updated.", createdAt: "2023-07-10", regulation: "SOX", type: "Review", assignedUser: "", progress: 100, nextStep: "No next step available", nextRecurrence: "N/A", missedDeadline: false },
  { id: 10, name: "Conduct risk assessment", deadline: "2023-12-20", recurrence: "Annually", status: "Not Started", priority: "High", description: "Assess potential risks.", createdAt: "2023-07-15", regulation: "GDPR", type: "Audit", assignedUser: "", progress: 0, nextStep: "Conduct risk assessment", nextRecurrence: "2024-12-20", missedDeadline: false },
  { id: 11, name: "Data encryption review", deadline: "2024-01-15", recurrence: "Annually", status: "Not Started", priority: "High", description: "Ensure all data is encrypted.", createdAt: "2023-07-20", regulation: "HIPAA", type: "Review", assignedUser: "", progress: 0, nextStep: "Review encryption", nextRecurrence: "2025-01-15", missedDeadline: false },
  { id: 12, name: "Compliance software update", deadline: "2024-02-01", recurrence: "Monthly", status: "In Progress", priority: "Medium", description: "Update to latest version.", createdAt: "2023-07-25", regulation: "SOX", type: "Training", assignedUser: "", progress: 50, nextStep: "Complete update", nextRecurrence: "2024-03-01", missedDeadline: false },
  { id: 13, name: "Network security assessment", deadline: "2024-03-10", recurrence: "Quarterly", status: "Not Started", priority: "High", description: "Assess network vulnerabilities.", createdAt: "2023-08-01", regulation: "GDPR", type: "Audit", assignedUser: "", progress: 0, nextStep: "Schedule assessment", nextRecurrence: "2024-06-10", missedDeadline: false },
  { id: 14, name: "Privacy impact assessment", deadline: "2024-04-05", recurrence: "Annually", status: "Not Started", priority: "Medium", description: "Evaluate privacy risks.", createdAt: "2023-08-10", regulation: "HIPAA", type: "Review", assignedUser: "", progress: 0, nextStep: "Conduct assessment", nextRecurrence: "2025-04-05", missedDeadline: false },
  { id: 15, name: "Compliance report generation", deadline: "2024-05-15", recurrence: "Monthly", status: "Completed", priority: "Low", description: "Generate monthly reports.", createdAt: "2023-08-15", regulation: "SOX", type: "Training", assignedUser: "", progress: 100, nextStep: "No next step available", nextRecurrence: "N/A", missedDeadline: false },
  { id: 16, name: "User access review", deadline: "2024-06-20", recurrence: "Quarterly", status: "In Progress", priority: "High", description: "Review user access rights.", createdAt: "2023-08-20", regulation: "GDPR", type: "Review", assignedUser: "", progress: 75, nextStep: "Complete review", nextRecurrence: "2024-09-20", missedDeadline: false },
  { id: 17, name: "Firewall configuration audit", deadline: "2024-07-25", recurrence: "Annually", status: "Not Started", priority: "Medium", description: "Audit firewall settings.", createdAt: "2023-09-01", regulation: "HIPAA", type: "Audit", assignedUser: "", progress: 0, nextStep: "Schedule audit", nextRecurrence: "2025-07-25", missedDeadline: false },
  { id: 18, name: "Data breach response drill", deadline: "2024-08-30", recurrence: "Bi-annually", status: "In Progress", priority: "High", description: "Conduct breach response test.", createdAt: "2023-09-10", regulation: "SOX", type: "Training", assignedUser: "", progress: 50, nextStep: "Complete drill", nextRecurrence: "2025-02-28", missedDeadline: false },
  { id: 19, name: "Compliance training for new hires", deadline: "2024-09-15", recurrence: "Monthly", status: "Not Started", priority: "Medium", description: "Train new employees.", createdAt: "2023-09-20", regulation: "GDPR", type: "Training", assignedUser: "", progress: 0, nextStep: "Schedule training", nextRecurrence: "2024-10-15", missedDeadline: false },
  { id: 20, name: "Vendor risk management", deadline: "2024-10-05", recurrence: "Quarterly", status: "Completed", priority: "Low", description: "Assess vendor risks.", createdAt: "2023-10-01", regulation: "HIPAA", type: "Review", assignedUser: "", progress: 100, nextStep: "No next step available", nextRecurrence: "N/A", missedDeadline: false },
  { id: 21, name: "Cloud service compliance check", deadline: "2024-11-10", recurrence: "Annually", status: "Not Started", priority: "High", description: "Ensure cloud services are compliant.", createdAt: "2023-10-15", regulation: "SOX", type: "Audit", assignedUser: "", progress: 0, nextStep: "Conduct compliance check", nextRecurrence: "2025-11-10", missedDeadline: false },
  { id: 22, name: "Policy review and update", deadline: "2024-12-15", recurrence: "Annually", status: "In Progress", priority: "Medium", description: "Update company policies.", createdAt: "2023-11-01", regulation: "GDPR", type: "Review", assignedUser: "", progress: 25, nextStep: "Review and update policies", nextRecurrence: "2025-12-15", missedDeadline: false },
  { id: 23, name: "Data classification review", deadline: "2025-01-20", recurrence: "Annually", status: "Not Started", priority: "High", description: "Review data classification.", createdAt: "2023-11-10", regulation: "HIPAA", type: "Review", assignedUser: "", progress: 0, nextStep: "Conduct review", nextRecurrence: "2026-01-20", missedDeadline: false },
  { id: 24, name: "Incident management training", deadline: "2025-02-05", recurrence: "Bi-annually", status: "In Progress", priority: "Medium", description: "Train staff on incident management.", createdAt: "2023-11-15", regulation: "SOX", type: "Training", assignedUser: "", progress: 50, nextStep: "Complete training", nextRecurrence: "2026-02-05", missedDeadline: false },
  { id: 25, name: "Compliance dashboard update", deadline: "2025-03-15", recurrence: "Monthly", status: "Completed", priority: "Low", description: "Update dashboard features.", createdAt: "2023-12-01", regulation: "GDPR", type: "Training", assignedUser: "", progress: 100, nextStep: "No next step available", nextRecurrence: "N/A", missedDeadline: false },
  { id: 26, name: "Regulatory change monitoring", deadline: "2025-04-20", recurrence: "Monthly", status: "Not Started", priority: "High", description: "Monitor regulatory changes.", createdAt: "2023-12-10", regulation: "HIPAA", type: "Review", assignedUser: "", progress: 0, nextStep: "Monitor changes", nextRecurrence: "2025-05-20", missedDeadline: false },
  { id: 27, name: "Access log review", deadline: "2025-05-10", recurrence: "Quarterly", status: "In Progress", priority: "Medium", description: "Review system access logs.", createdAt: "2023-12-15", regulation: "SOX", type: "Audit", assignedUser: "", progress: 75, nextStep: "Complete review", nextRecurrence: "2025-08-10", missedDeadline: false },
  { id: 28, name: "Security awareness campaign", deadline: "2025-06-25", recurrence: "Annually", status: "Not Started", priority: "High", description: "Launch awareness campaign.", createdAt: "2024-01-01", regulation: "GDPR", type: "Training", assignedUser: "", progress: 0, nextStep: "Launch campaign", nextRecurrence: "2026-06-25", missedDeadline: false },
  { id: 29, name: "Data backup verification", deadline: "2025-07-30", recurrence: "Quarterly", status: "Completed", priority: "Low", description: "Verify backup integrity.", createdAt: "2024-01-10", regulation: "HIPAA", type: "Review", assignedUser: "", progress: 100, nextStep: "No next step available", nextRecurrence: "N/A", missedDeadline: false },
  { id: 30, name: "Compliance policy dissemination", deadline: "2025-08-15", recurrence: "Monthly", status: "Not Started", priority: "Medium", description: "Disseminate updated policies.", createdAt: "2024-01-20", regulation: "SOX", type: "Training", assignedUser: "", progress: 0, nextStep: "Disseminate policies", nextRecurrence: "2025-09-15", missedDeadline: false }
];

// Ensure unique task IDs
const uniqueTasks = tasks.map((task, index) => ({ ...task, id: index + 1 }));

const recurrenceOrder = {
  "Daily": 1,
  "Weekly": 2,
  "Monthly": 3,
  "Quarterly": 4,
  "Bi-annually": 5,
  "Annually": 6
};

const priorityOrder = ['High', 'Medium', 'Low'];

// Function to calculate the next deadline based on recurrence
const calculateNextDeadline = (currentDeadline: string, recurrence: string): string => {
  const date = new Date(currentDeadline);
  switch (recurrence) {
    case 'Daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'Weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'Monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'Quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'Bi-annually':
      date.setMonth(date.getMonth() + 6);
      break;
    case 'Annually':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      break;
  }
  return date.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
};

// Function to add recurring tasks
const addRecurringTasks = (taskList: any[]) => {
  const currentDate = new Date();
  const newTasks = taskList.map(task => {
    const taskDeadline = new Date(task.deadline);
    if (taskDeadline <= currentDate && task.recurrence) {
      const newDeadline = calculateNextDeadline(task.deadline, task.recurrence);
      return {
        ...task,
        id: taskList.length + 1, // Assign a new ID
        deadline: newDeadline,
        status: 'Not Started', // Reset status for new task
        createdAt: currentDate.toISOString().split('T')[0]
      };
    }
    return null;
  }).filter(task => task !== null);

  if (newTasks.length > 0) {
    return [...taskList, ...newTasks];
  }
  return taskList;
};

export default function TaskManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskDeadline, setTaskDeadline] = useState('')
  const [taskRecurrence, setTaskRecurrence] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskPriority, setTaskPriority] = useState('')
  const [taskStatus, setTaskStatus] = useState('')
  const [taskRegulation, setTaskRegulation] = useState('')
  const [taskType, setTaskType] = useState('')
  const [assignedUser, setAssignedUser] = useState('')
  const [taskList, setTaskList] = useState(uniqueTasks)
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' })
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isRecurrenceDialogOpen, setIsRecurrenceDialogOpen] = useState(false);

  const [recurrenceInterval, setRecurrenceInterval] = useState('Monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [occurrences, setOccurrences] = useState(0);
  const [excludedDates, setExcludedDates] = useState<string[]>([]);
  const [defaultPriority, setDefaultPriority] = useState('Medium');
  const [defaultStatus, setDefaultStatus] = useState('Not Started');

  const [selectedRegulation, setSelectedRegulation] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const [expandedTaskIds, setExpandedTaskIds] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedFilters, setSelectedFilters] = useState([]);

  const [savedFilters, setSavedFilters] = useState([]);

  const filterOptions = [
    'GDPR', 'HIPAA', 'SOX',
    'Review', 'Audit', 'Training',
    'Overdue', 'High Priority', 'Completed'
  ];

  const statusOptions = ['In Progress', 'Not Started', 'Completed', 'Overdue'];

  const cycleStatusFilter = () => {
    const currentIndex = statusOptions.indexOf(selectedStatus);
    const nextIndex = (currentIndex + 1) % (statusOptions.length + 1);
    setSelectedStatus(nextIndex === statusOptions.length ? 'All' : statusOptions[nextIndex]);
  };

  const requestSort = (key) => {
    let direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key, direction });
  };

  const sortedTasks = [...taskList].sort((a, b) => {
    if (sortConfig.key) {
      if (sortConfig.key === 'priority') {
        const priorityOrder = ['High', 'Medium', 'Low'];
        return (priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)) * (sortConfig.direction === 'ascending' ? 1 : -1);
      }
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
    return new Date(b.createdAt) - new Date(a.createdAt); // Default: most recent first
  });

  const filteredTasks = selectedStatus === 'All' && selectedPriority === 'All' ? sortedTasks : selectedStatus !== 'All' && selectedPriority === 'All' ? sortedTasks.filter(task => task.status === selectedStatus) : selectedStatus === 'All' && selectedPriority !== 'All' ? sortedTasks.filter(task => task.priority === selectedPriority) : sortedTasks.filter(task => task.status === selectedStatus && task.priority === selectedPriority);

  const filteredTasksByRegulationAndType = filteredTasks.filter(task =>
    (selectedRegulation === 'All' || task.regulation === selectedRegulation) &&
    (selectedType === 'All' || task.type === selectedType)
  );

  const filteredTasksBySearchQuery = filteredTasksByRegulationAndType.filter(task =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasksByFilters = filteredTasksBySearchQuery.filter(task =>
    selectedFilters.every(filter => {
      if (filter === 'GDPR' || filter === 'HIPAA' || filter === 'SOX') {
        return task.regulation === filter;
      }
      if (filter === 'Review' || filter === 'Audit' || filter === 'Training') {
        return task.type === filter;
      }
      if (filter === 'Overdue') {
        return new Date(task.deadline) < new Date() && task.status !== 'Completed';
      }
      if (filter === 'High Priority') {
        return task.priority === 'High';
      }
      if (filter === 'Completed') {
        return task.status === 'Completed';
      }
      return true;
    })
  );

  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  const toggleTaskSelection = (taskId) => {
    setSelectedTaskIds(prevIds =>
      prevIds.includes(taskId)
        ? prevIds.filter(id => id !== taskId)
        : [...prevIds, taskId]
    );
  };

  const bulkAction = (action) => {
    switch (action) {
      case 'complete':
        selectedTaskIds.forEach(id => markComplete(id));
        break;
      case 'reassign':
        const newAssignee = prompt('Enter the name of the new assignee:');
        if (newAssignee) {
          selectedTaskIds.forEach(id => reassignTask(id, newAssignee));
        }
        break;
      case 'changeDeadline':
        const newDeadline = prompt('Enter the new deadline (YYYY-MM-DD):');
        if (newDeadline) {
          selectedTaskIds.forEach(id => changeDeadline(id, newDeadline));
        }
        break;
      default:
        break;
    }
    setSelectedTaskIds([]); // Clear selection after action
  };

  const calculateProgress = () => {
    const completedTasks = taskList.filter(task => task.status === 'Completed').length;
    // Round progress to the nearest integer
    return Math.round((completedTasks / taskList.length) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTaskId !== null) {
      setTaskList(taskList.map(task => task.id === editingTaskId ? { ...task, name: taskName, deadline: taskDeadline, recurrence: taskRecurrence, status: taskStatus, description: taskDescription, priority: taskPriority, regulation: taskRegulation, type: taskType, assignedUser: assignedUser } : task));
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
        regulation: taskRegulation,
        type: taskType,
        assignedUser: assignedUser,
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
    setTaskRegulation('')
    setTaskType('')
    setAssignedUser('')
  }

  const handleEdit = (taskId) => {
    const taskToEdit = taskList.find(task => task.id === taskId);
    if (taskToEdit) {
      setTaskName(taskToEdit.name);
      setTaskRecurrence(taskToEdit.recurrence);
      setTaskDescription(taskToEdit.description);
      setTaskDeadline(taskToEdit.deadline);
      setTaskPriority(taskToEdit.priority);
      setTaskStatus(taskToEdit.status);
      setTaskRegulation(taskToEdit.regulation);
      setTaskType(taskToEdit.type);
      setAssignedUser(taskToEdit.assignedUser);
    }
    setEditingTaskId(taskId);
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
    setTaskRegulation('');
    setTaskType('');
    setAssignedUser('');
    setEditingTaskId(null);
    setIsDialogOpen(true);
  };

  const handleRecurrenceCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      recurrenceInterval,
      startDate,
      endDate,
      occurrences,
      excludedDates,
      defaultPriority,
      defaultStatus
    });
    setIsRecurrenceDialogOpen(false);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log('Uploaded files:', files);
      // Logic to handle file upload
    }
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTaskIds(prevIds =>
      prevIds.includes(taskId)
        ? prevIds.filter(id => id !== taskId)
        : [...prevIds, taskId]
    );
  };

  useEffect(() => {
    setTaskList(addRecurringTasks(taskList));
  }, []);

  useEffect(() => {
    if (editingTaskId !== null) {
      const taskToEdit = taskList.find(task => task.id === editingTaskId);
      if (taskToEdit) {
        setTaskName(taskToEdit.name);
        setTaskRecurrence(taskToEdit.recurrence);
        setTaskDescription(taskToEdit.description);
        setTaskDeadline(taskToEdit.deadline);
        setTaskPriority(taskToEdit.priority);
        setTaskStatus(taskToEdit.status);
        setTaskRegulation(taskToEdit.regulation);
        setTaskType(taskToEdit.type);
        setAssignedUser(taskToEdit.assignedUser);
      }
    }
  }, [editingTaskId, taskList]);

  const regulations = ['GDPR', 'HIPAA', 'SOX'];
  const taskTypes = ['Training', 'Audit', 'Review'];

  const handleRegulationChange = (taskId, newRegulation) => {
    setTaskList(prevTaskList =>
      prevTaskList.map(task =>
        task.id === taskId ? { ...task, regulation: newRegulation } : task
      )
    );
  };

  const handleRegulationFilterChange = (newRegulation) => {
    setSelectedRegulation(newRegulation);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const saveCurrentFilters = () => {
    if (selectedFilters.length > 0) {
      const filterName = prompt('Enter a name for this filter configuration:');
      if (filterName) {
        setSavedFilters([...savedFilters, { name: filterName, filters: selectedFilters }]);
      }
    }
  };

  const applySavedFilter = (filters) => {
    setSelectedFilters(filters);
  };

  const teamMembers = [
    { name: 'John Doe', online: true },
    { name: 'Jane Smith', online: false },
    { name: 'Emily Johnson', online: true },
  ];

  const markComplete = (taskId) => {
    setTaskList(taskList.map(task =>
      task.id === taskId ? { ...task, status: 'Completed' } : task
    ));
  };

  const renderTaskRows = filteredTasksByFilters.map((task) => (
    <React.Fragment key={task.id}>
      <TableRow
        className="bg-gray-100"
        onClick={() => toggleTaskExpansion(task.id)}
        style={{ cursor: 'pointer' }}
      >
        <TableCell>
          <input
            type="checkbox"
            checked={selectedTaskIds.includes(task.id)}
            onChange={() => toggleTaskSelection(task.id)}
          />
        </TableCell>
        <TableCell>{task.name || 'Unnamed Task'}</TableCell>
        <TableCell className={new Date(task.deadline) < new Date() ? 'text-red-600' : new Date(task.deadline) < new Date(Date.now() + 7*24*60*60*1000) ? 'text-orange-600' : ''} title={`Next Due: ${task.nextRecurrence || 'N/A'}`}>
          📅 {task.deadline}
        </TableCell>
        <TableCell>
          {task.priority === 'High' && <span className="text-red-600">🔴 High</span>}
          {task.priority === 'Medium' && <span className="text-orange-600">🟠 Medium</span>}
          {task.priority === 'Low' && <span className="text-green-600">🟢 Low</span>}
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-full h-2 w-20 mr-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${task.progress || 0}%` }}></div>
            </div>
            <span className="tooltip" title={task.nextStep || 'No next step available'}>
              {task.status === 'Completed' ? '✅' : `${task.progress || 0}%`}
            </span>
          </div>
        </TableCell>
        <TableCell>
          {task.assignedUser ? (
            <div className="flex items-center">
              <span className="mr-2">{task.assignedUser}</span>
              <Button className="ml-2" onClick={() => reassignTask(task.id)}>Reassign</Button>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <span>Unassigned ⚠️</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="ml-2 cursor-pointer">Assign</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {teamMembers.map((member, index) => (
                    <DropdownMenuItem key={index} onClick={() => assignTask(task.id, member.name)}>
                      {member.name} {member.online ? '🟢' : '🔴'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            {task.recurrence && (
              <span className="cursor-pointer" onClick={() => openRecurrenceModal(task.id)}>🔄</span>
            )}
            <span className="ml-2">{task.type || 'N/A'}</span>
          </div>
          {task.missedDeadline && (
            <span className="text-red-600 text-sm">Last month's task was not completed</span>
          )}
        </TableCell>
        <TableCell>
          <Select
            value={task.regulation}
            onValueChange={(value) => handleRegulationChange(task.id, value)}
            placeholder="Select Regulation"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Regulation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GDPR">GDPR</SelectItem>
              <SelectItem value="HIPAA">HIPAA</SelectItem>
              <SelectItem value="SOX">SOX</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>{task.type || 'N/A'}</TableCell>
        <TableCell className="flex justify-center space-x-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleEdit(task.id)}>Edit Task</DropdownMenuItem>
              {task.status !== 'Completed' && (
                <DropdownMenuItem onClick={() => handleComplete(task.id)}>Mark as Complete</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleDocumentUpload}>Upload Supporting Document</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {task.status === 'Completed' && <span className="text-green-600 ml-2">✅ Completed</span>}
        </TableCell>
      </TableRow>
      {expandedTaskIds.includes(task.id) && (
        <TableRow>
          <TableCell colSpan={9}>
            <div className="p-4">
              <p>{task.description || 'No description available.'}</p>
              <Button onClick={() => handleAddNotes(task.id)}>Add Notes</Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  ));

  // Calculate task breakdown
  const taskBreakdown = {
    completed: filteredTasksByFilters.filter(task => task.status === 'Completed').length,
    inProgress: filteredTasksByFilters.filter(task => task.status === 'In Progress').length,
    notStarted: filteredTasksByFilters.filter(task => task.status === 'Not Started').length,
  };

  const totalTasks = taskBreakdown.completed + taskBreakdown.inProgress + taskBreakdown.notStarted;
  const progressPercentage = ((taskBreakdown.completed / totalTasks) * 100).toFixed(2);

  // Calculate overdue tasks
  const overdueTasksCount = filteredTasksByFilters.filter(task => new Date(task.deadline) < new Date() && task.status !== 'Completed').length;

  // Add banner for overdue tasks
  {overdueTasksCount > 0 && (
    <div className="bg-red-100 text-red-800 p-3 rounded mb-4 cursor-pointer" onClick={() => setSelectedFilters(['Overdue'])}>
      🔴 {overdueTasksCount} tasks are overdue. Click here to view them.
    </div>
  )}

  // Add Clear Filters button functionality
  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const handleSort = (column) => {
    const direction = sortConfig.key === column && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    setSortConfig({ key: column, direction });
  };

  const exportTasks = (filtered = false) => {
    const dataToExport = filtered ? filteredTasksByFilters : taskList;
    const csvContent = dataToExport.map(task => `${task.id},${task.name},${task.deadline},${task.status},${task.priority}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `tasks_${filtered ? 'filtered' : 'full'}.csv`);
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{ userSelect: 'none' }}>
      <Button className="absolute top-4 right-4" onClick={() => setIsRecurrenceDialogOpen(true)}>
        Customize Recurrence
      </Button>
      <Dialog open={isRecurrenceDialogOpen} onOpenChange={setIsRecurrenceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Task Recurrence</DialogTitle>
            <DialogDescription>
              Adjust the recurrence settings for your tasks.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRecurrenceCustomization} className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recurrence-interval" className="text-right">Recurrence Interval</Label>
              <Select onValueChange={setRecurrenceInterval} className="col-span-3">
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
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
              <Label htmlFor="start-date" className="text-right">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-date" className="text-right">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="occurrences" className="text-right">Occurrences</Label>
              <Input
                id="occurrences"
                type="number"
                value={occurrences}
                onChange={(e) => setOccurrences(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="excluded-dates" className="text-right">Excluded Dates</Label>
              <Input
                id="excluded-dates"
                type="text"
                value={excludedDates.join(', ')}
                onChange={(e) => setExcludedDates(e.target.value.split(',').map(date => date.trim()))}
                placeholder="YYYY-MM-DD, YYYY-MM-DD"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="default-priority" className="text-right">Default Priority</Label>
              <Select onValueChange={setDefaultPriority} className="col-span-3">
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
              <Label htmlFor="default-status" className="text-right">Default Status</Label>
              <Select onValueChange={setDefaultStatus} className="col-span-3">
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
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
              <Button type="button" onClick={() => setIsRecurrenceDialogOpen(false)}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex items-center space-x-4 mb-4">
        <MultiSelect
          options={filterOptions}
          selected={selectedFilters}
          onChange={setSelectedFilters}
          placeholder="Select Filters"
        />
        <div className="flex space-x-2">
          {selectedFilters.map((filter) => (
            <span key={filter} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {filter} <button onClick={() => removeFilter(filter)} className="ml-1">&times;</button>
            </span>
          ))}
        </div>
        {selectedFilters.length > 1 && (
          <Button onClick={clearFilters} className="bg-red-600 hover:bg-red-700 text-white ml-4">Clear Filters</Button>
        )}
        <Button onClick={saveCurrentFilters} className="bg-blue-600 hover:bg-blue-700 text-white">Save Filter</Button>
        <Select onValueChange={applySavedFilter} placeholder="Saved Filters" className="w-1/3">
          <SelectTrigger>
            <SelectValue placeholder="Select Saved Filter" />
          </SelectTrigger>
          <SelectContent>
            {savedFilters.map((savedFilter, index) => (
              <SelectItem key={index} value={savedFilter.filters}>{savedFilter.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <Select onValueChange={handleRegulationFilterChange} className="w-1/3">
          <SelectTrigger>
            <SelectValue placeholder="Filter by Regulation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Regulations</SelectItem>
            {regulations.map(reg => <SelectItem key={reg} value={reg}>{reg}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedType} className="w-1/3">
          <SelectTrigger>
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {taskTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="Search by task name" onChange={handleSearchChange} className="w-1/3" />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedTaskIds.length === filteredTasksByFilters.length}
            onChange={(e) => {
              setSelectedTaskIds(e.target.checked ? filteredTasksByFilters.map(task => task.id) : []);
            }}
          />
          <span className="ml-2">Select All</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button>Bulk Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => bulkAction('complete')}>Mark as Complete</DropdownMenuItem>
            <DropdownMenuItem onClick={() => bulkAction('reassign')}>Reassign Tasks</DropdownMenuItem>
            <DropdownMenuItem onClick={() => bulkAction('changeDeadline')}>Change Deadline</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>Add New Task</Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="ml-2">Export</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => exportTasks(false)}>Export Full Task List (CSV)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => exportTasks(true)}>Export Filtered Tasks Only (CSV)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="mb-8 p-6 min-h-[600px] overflow-visible">
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-right">
              <span>Progress: {taskBreakdown.completed} of {totalTasks} tasks completed ({progressPercentage}%)</span>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-1 cursor-pointer" onClick={() => setSelectedFilters(['In Progress', 'Not Started'])}>
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>
          <div className="text-sm mt-2">
            <span>✅ Completed: {taskBreakdown.completed}</span>
            <span className="ml-4">🔄 In Progress: {taskBreakdown.inProgress}</span>
            <span className="ml-4">❌ Not Started: {taskBreakdown.notStarted}</span>
          </div>
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
                      <Select value={taskRecurrence} onValueChange={setTaskRecurrence} className="col-span-3">
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
                      <Select value={taskPriority} onValueChange={setTaskPriority} className="col-span-3">
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
                      <Select value={taskStatus} onValueChange={setTaskStatus} className="col-span-3">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="regulation" className="text-right">
                        Regulation
                      </Label>
                      <Select value={taskRegulation} onValueChange={setTaskRegulation} className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select regulation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GDPR">GDPR</SelectItem>
                          <SelectItem value="HIPAA">HIPAA</SelectItem>
                          <SelectItem value="SOX">SOX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select value={taskType} onValueChange={setTaskType} className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Training">Training</SelectItem>
                          <SelectItem value="Audit">Audit</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="assigned-user" className="text-right">
                        Assigned User
                      </Label>
                      <Input
                        id="assigned-user"
                        value={assignedUser}
                        onChange={(e) => setAssignedUser(e.target.value)}
                        className="col-span-3"
                      />
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
              <TableRow onClick={() => handleSort('name')} className="cursor-pointer">
                <TableCell className="w-1/12 text-center">Select</TableCell>
                <TableCell className="w-2/12">Task Name <span className="inline-block ml-1">{sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}</span></TableCell>
                <TableCell className="w-2/12">Deadline</TableCell>
                <TableCell className="w-1/12">Priority</TableCell>
                <TableCell className="w-2/12">Status</TableCell>
                <TableCell className="w-2/12">Assigned To</TableCell>
                <TableCell className="w-1/12">Regulation</TableCell>
                <TableCell className="w-1/12">Type</TableCell>
                <TableCell className="w-1/12 text-center">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTaskRows}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
