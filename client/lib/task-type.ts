export interface Task {
    _id: string;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    dueDate: string;
  }