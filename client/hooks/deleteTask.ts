import { useState } from 'react';

type Task ={
  _id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  dueDate: string;
};
const useDeleteTask = () => {
  const [error, setError] = useState<string | null>(null);
  
  const deleteTask = async (taskId: string, setResult: React.Dispatch<React.SetStateAction<Task[]>>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/delete/${taskId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Remove the deleted task from the state
      setResult((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setError(null); // Clear any previous errors
    } catch (err: unknown) {
      console.error("Failed to delete task", err);
      setError('Failed to delete task');
    }
  };

  return { deleteTask, error };
};
export default useDeleteTask;