import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { db } from '@/components/FireBase';
import { doc, updateDoc } from 'firebase/firestore';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // Ensure status is included
}

interface ToDoProps {
  task: Task;
  onStatusChange: (id: string, newStatus: string) => void;
}

const InProgress: React.FC<ToDoProps> = ({ task, onStatusChange }) => {
  const [date, setDate] = React.useState<Date | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { status: newStatus });
      onStatusChange(task.id, newStatus);
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  return (
    <div className="bg-white border-l-4 border-violet-500 rounded-xl cursor-pointer mb-4">
      <Card>
        <CardHeader className="relative">
          <div className="m-2 ml-0.5">
            <p className="bg-red-300 text-red-600 font-semibold pt-3 pl-5 pr-5 pb-3 rounded-xl inline">
              Medium
            </p>
          </div>
          <div className="flex items-center">
            <CardTitle className="text-3xl font-bold flex-grow">{task.title}</CardTitle>
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
                  <MenuItem onClick={() => handleStatusChange('ToDo')}>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ToDo</a>
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusChange('InProgress')}>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">InProgress</a>
                  </MenuItem>
                  <MenuItem onClick={() => handleStatusChange('Completed')}>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Completed</a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="font-normal">{task.description}</p>
        </CardContent>
        <div className="flex justify-center mb-4">
          <hr className="border-t border-gray-400 w-11/12" />
        </div>
        <CardFooter>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  'w-[150px] justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-3 h-6 w-5" />
                {date ? format(date, 'dd/MM/yyyy') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-none bg-white">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InProgress;
