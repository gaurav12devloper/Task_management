"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Adjust the import based on your project structure
import { useState, useEffect } from "react";
import useDeleteTask from "@/hooks/deleteTask";
import EditComponent from "@/components/Edit-component";
import { filterTasks } from "@/lib/utils";

import { Task } from "@/lib/task-type";
import { Button } from "@/components/ui/button";
import CreateTask from "@/components/Createtask";

const priorityOrder = {
  Low: 1,
  Medium: 2,
  High: 3,
};

interface TasksProps {
  sortBy: string;
  filterPriority: string;
  filterStatus: string;
  filterDueDate: string;
}


const Tasks = ({ sortBy, filterPriority, filterStatus, filterDueDate }: TasksProps) => {
  console.log({ sortBy, filterPriority, filterStatus, filterDueDate });
  const [result, setResult] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"low-medium-high" | "high-medium-low">("low-medium-high");
  const { deleteTask } = useDeleteTask(); // Use the custom hook
  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          const filtered = filterTasks(data, filterPriority, filterStatus, filterDueDate, sortBy);
          console.log(filtered);
          setResult(filtered);
        } else {
          throw new Error('Unexpected data format');
        }

        setLoading(false);
      } catch (err: unknown) {
        console.error("Failed to fetch tasks", err);
        setError('Failed to fetch tasks');
        setLoading(false);
      }
    };

    getTasks();
  }, [sortBy, filterPriority, filterStatus, filterDueDate]);

  const sortedTasks = [...result].sort((a, b) => {
    const priorityA = priorityOrder[a.priority];
    const priorityB = priorityOrder[b.priority];

    if (sortOrder === "low-medium-high") {
      return priorityA - priorityB;
    } else {
      return priorityB - priorityA;
    }
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <>
      <div className="right-[10%] top-[11%] absolute">
        <CreateTask setResult={setResult} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Task Description</TableHead>
            <div className="flex flex-row gap-0 mb-0 pt-5 pb-0">
              <TableHead className="mt-1">Priority</TableHead>
              <Select onValueChange={(value) => setSortOrder(value as "low-medium-high" | "high-medium-low")}>
                <SelectTrigger className="w-[10rm] h-[4vh] mt-1">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low-medium-high">ASC</SelectItem>
                  <SelectItem value="high-medium-low">DEC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.length > 0 ? (
            sortedTasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell className="font-medium">{task.description}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      task.priority === 'Low' ? 'default' :
                        task.priority === 'Medium' ? 'secondary' :
                          'destructive'
                    }
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell className="flex flex-row gap-1">

                  <EditComponent task={task} setResult={setResult} />

                  <Button onClick={() => deleteTask(task._id, setResult)}>Delete</Button>
                  <Button>View</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No tasks found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
export default Tasks;
