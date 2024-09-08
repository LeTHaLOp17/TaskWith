export interface Task {
    id?: string;
    title: string;
    message?: string;
    date: Date | undefined;
    status: 'ToDo' | 'In Progress' | 'Completed';
    priority: 'High' | 'Medium' | 'Low';
  }