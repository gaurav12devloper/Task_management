import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Task } from "@/lib/task-type";

interface ICreateTask {
    setResult: React.Dispatch<React.SetStateAction<Task[]>>
}

const CreateTask = ({ setResult }: ICreateTask) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("");
    const [open, setOpen] = useState(false); // Add open state for modal control

    const handleSaveTask = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, priority, dueDate }),
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setResult((prev) => [...prev, { 
                        _id: data.task._id, 
                        title, 
                        description, 
                        priority, 
                        dueDate,
                        status
                    }]);
                toast({
                    title: "Success",
                    description: "Task Created successfully.",
                });
                setTitle("");
                setDescription("");
                setPriority("");
                setDueDate("");
                setOpen(false); // Close the modal after success
            } else {
                toast({
                    title: "Failed",
                    description: data.errors[0].msg || "Task not created.",
                });
                console.error("Erro task not created:", data.message);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Error Task not created:", err.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}> {/* Control modal open/close state */}
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
                    Create Task
                </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-w-md w-full">
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full"
                        />
                        <Textarea
                            placeholder="Type your description here."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full"
                            rows={8}
                        />
                        <Select value={priority} onValueChange={(value) => setPriority(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={status} onValueChange={(value) => setStatus(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Progress" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="TODO">TODO</SelectItem>
                                <SelectItem value="INPROGRESS">INPROGRESS</SelectItem>
                                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={handleSaveTask}>
                            Create
                        </Button>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};
export default CreateTask;
