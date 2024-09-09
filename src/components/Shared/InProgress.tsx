import React, { useState, MouseEvent } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Timestamp } from "firebase/firestore"; 
import { Calendar as CalendarIcon } from 'lucide-react';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { db } from '@/components/FireBase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Task {
  id: string;
  title: string;
  message?: string;
  status: string;
  priority?: 'High' | 'Medium' | 'Low';
  date?: Timestamp | null;
}

interface InProgressProps {
  task: Task;
  onStatusChange: (id: string, newStatus: string) => void;
  onTaskEdit: (id: string, newTitle: string, newMessage?: string) => void;
  onTaskDelete: (id: string) => void;
}

const InProgress: React.FC<InProgressProps> = ({ task, onStatusChange, onTaskEdit, onTaskDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedMessage, setEditedMessage] = useState(task.message || '');
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number } | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { status: newStatus });
      onStatusChange(task.id, newStatus);
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  const handleEdit = async () => {
    if (isEditing) {
      try {
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, { title: editedTitle, message: editedMessage });
        onTaskEdit(task.id, editedTitle, editedMessage);
        setIsEditing(false);
        setContextMenuPosition(null); // Hide context menu after save
      } catch (error) {
        console.error('Error updating task: ', error);
      }
    } else {
      setIsEditing(true); // Enter editing mode
    }
  };

  const handleDelete = async () => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await deleteDoc(taskRef);
      onTaskDelete(task.id);
      setContextMenuPosition(null); // Hide context menu after delete
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault(); // Prevent default context menu
    const { clientX: x, clientY: y } = event;
    setContextMenuPosition({ x, y });
  };

  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
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

  const formattedCreationDate =
    task.date instanceof Timestamp
      ? format(task.date.toDate(), "dd/MM/yyyy")
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
            <CardTitle
              className="text-3xl font-bold flex-grow"
              onContextMenu={handleContextMenu}
            >
              {isEditing ? (
                <input 
                  type="text" 
                  value={editedTitle} 
                  onChange={(e) => setEditedTitle(e.target.value)} 
                  className="text-3xl font-bold w-full bg-transparent border-none outline-none"
                />
              ) : (
                task.title
              )}
            </CardTitle>
            {/* Status Dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="inline-flex w-full justify-left gap-x-1.5 bg-white flex items-center">
                <span className="text-gray-700">Change Status</span>
                <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <DropdownMenuLabel className="px-4 py-2 font-semibold text-gray-900 bg-gray-100 rounded-t-md">
                  Change Status
                </DropdownMenuLabel>
                <div className="py-1">
                  <MenuItem
                    as="button"
                    onClick={() => handleStatusChange('ToDo')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    aria-label="Change status to ToDo"
                  >
                    ToDo
                  </MenuItem>
                  <MenuItem
                    as="button"
                    onClick={() => handleStatusChange('InProgress')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    aria-label="Change status to In Progress"
                  >
                    In Progress
                  </MenuItem>
                  <MenuItem
                    as="button"
                    onClick={() => handleStatusChange('Completed')}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    aria-label="Change status to Completed"
                  >
                    Completed
                  </MenuItem>
                </div>
              </MenuItems>
            </Menu>
          </div>
        </CardHeader>

        <CardContent>
          {/* Description / Message */}
          {isEditing ? (
            <textarea 
              value={editedMessage} 
              onChange={(e) => setEditedMessage(e.target.value)} 
              className="w-full bg-transparent border-none outline-none mt-2"
            />
          ) : (
            task.message && <p className="font-normal mt-2">{task.message}</p>
          )}
          {/* Save Button */}
          {isEditing && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleEdit} 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          )}
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

      {/* Context Menu */}
      {contextMenuPosition && (
        <div
          className="absolute z-20 bg-white border rounded shadow-lg"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
          onMouseLeave={handleCloseContextMenu}
        >
          {isEditing ? (
            <button
              onClick={handleEdit}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Save
            </button>
          ) : (
            <>
              <button
                onClick={() => { handleEdit(); handleCloseContextMenu(); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => { handleDelete(); handleCloseContextMenu(); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
        
    </div>
  );
};

export default InProgress;
