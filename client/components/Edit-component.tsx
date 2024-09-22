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
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Task {
    _id: string;
    title: string;
    description: string | null;
    priority: string;
    dueDate: string;
    status: string;
}

interface EditComponentProps {
    task: Task;
    setResult: React.Dispatch<React.SetStateAction<Task[]>>;
}

const EditComponent = ({ task  , setResult}: EditComponentProps) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [ status, setStatus ] = useState(task.status);
    const [open, setOpen] = useState(false); // Add open state for modal control

    const handleSaveTask = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/edit/${task._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, priority, dueDate }),
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setResult((prev) => {
                    const index = prev.findIndex((t) => t._id === task._id);
                    if (index === -1) return prev;
                    const updatedTask = { ...prev[index], title, description, priority, dueDate, status };
                    prev.splice(index, 1, updatedTask);
                    return [...prev];
                });
                toast({
                    title: "Success",
                    description: "Task updated successfully.",
                });
                console.log("Task updated successfully.");
                setOpen(false); // Close the modal after success
                setTitle("");
                setDescription("");
                setPriority("");
                setDueDate("");
            } else {
                toast({
                    title: "Failed",
                    description: data.errors[0]?.msg || "Failed to update",
                });
                console.error("Error updating task:", data.message);
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error("Error updating task:", err.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}> {/* Control modal open/close state */}
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-w-md w-full">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
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
                                <SelectValue>{priority}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={status} onValueChange={(value) => setStatus(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue>{status}</SelectValue>
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
                            Save
                        </Button>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};
export default EditComponent;
