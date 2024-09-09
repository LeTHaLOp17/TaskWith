import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

import { Timestamp } from "firebase/firestore"; 
import { Calendar as CalendarIcon } from 'lucide-react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { db } from '@/components/FireBase';
import { doc, updateDoc } from 'firebase/firestore';

interface Task {
  id: string;
  title: string;
  message?: string; // Optional field for task description
  status: string;
  priority?: 'High' | 'Medium' | 'Low'; // Priority levels with specific values
  date?: Date | null; // Date when the task was created
}

interface ToDoProps {
  task: Task;
  onStatusChange: (id: string, newStatus: string) => void;
}

const ToDo: React.FC<ToDoProps> = ({ task, onStatusChange }) => {
  const handleStatusChange = async (newStatus: string) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { status: newStatus });

      // Call the onStatusChange prop to update the parent component's state
      onStatusChange(task.id, newStatus);
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  const statusColors: Record<string, string> = {
    ToDo: 'border-blue-500',
    InProgress: 'border-yellow-500',
    Completed: 'border-green-500',
  };
  

  const priorityColors: Record<string, string> = {
    High: "bg-red-300 text-red-600 font-semibold pt-3 pl-5 pr-5 pb-3 rounded-xl inline text-red-800",
    Medium: "bg-yellow-200 font-semibold pt-3 pl-5 pr-5 pb-3 rounded-xl inline text-yellow-600",
    Low: "bg-green-300 text-white font-semibold pt-3 pl-5 pr-5 pb-3 rounded-xl inline text-green-600", 
  };

  // Safely handle the formatting of the creation date
  const formattedCreationDate =
  task.date instanceof Timestamp
    ? format(task.date.toDate(), "dd/MM/yyyy")  // Firebase Timestamp to Date conversion
    : 'N/A';
  return (
    <div className={`bg-white border-l-4 rounded-xl cursor-pointer mb-4 ${statusColors[task.status]}`}>
      <Card>
        <CardHeader className="relative">
          {/* Priority Badge */}
          {task.priority && (
            <div className={`font-semibold pt-3 pl-5 pr-5 pb-3 rounded-xl inline ${priorityColors[task.priority]}`}>
              {task.priority}
            </div>
          )}
          <div className="flex items-center mt-2">
            <CardTitle className="text-3xl font-bold flex-grow">{task.title}</CardTitle>
            {/* Status Dropdown */}
            <Menu as="div" className="relative">
              <div>
                <MenuButton className="inline-flex w-full justify-left gap-x-1.5 bg-white">
                  <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none"
              >
                <DropdownMenuLabel className="ml-3 mt-3 font-semibold">Change Status</DropdownMenuLabel>
                <div className="flex justify-center m-2 -mb-1">
                  <hr className="border-t border-gray-400 w-11/12" />
                </div>
                <div className="py-1">
                  <MenuItem onClick={() => handleStatusChange('ToDo')} aria-label="Change status to ToDo">
                    ToDo
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusChange('InProgress')} aria-label="Change status to In Progress">
                    In Progress
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusChange('Completed')} aria-label="Change status to Completed">
                    Completed
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </CardHeader>

        <CardContent>
          {/* Description / Message */}
          {task.message && <p className="font-normal mt-2">{task.message}</p>}
        </CardContent>

        {/* Horizontal Line */}
        <div className="flex justify-center mb-4">
          <hr className="border-t border-gray-400 w-11/12" />
        </div>

        <CardFooter>
          {/* Display Creation Date */}
          <div className="text-gray-500">
            <CalendarIcon className="mr-2 inline h-5 w-5 -mt-2" />
            {`${formattedCreationDate}`}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ToDo;
