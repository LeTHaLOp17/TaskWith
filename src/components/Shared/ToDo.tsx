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
import { useDrag } from 'react-dnd';

interface Task {
  id: string;
  title: string;
  message?: string;
  status: string;
  priority?: 'High' | 'Medium' | 'Low';
  date?: Timestamp | null;
}

interface ToDoProps {
  task: Task;
  onStatusChange: (id: string, newStatus: string) => void;
  onTaskDelete: (id: string) => void;
}

const ToDo: React.FC<ToDoProps> = ({ task, onStatusChange, onTaskDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedMessage, setEditedMessage] = useState(task.message || '');
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { status: newStatus });
      onStatusChange(task.id, newStatus);
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, currentStatus: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });


  const handleDelete = async () => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await deleteDoc(taskRef);

      onTaskDelete(task.id);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const handleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, { title: editedTitle, message: editedMessage });

      task.title = editedTitle;
      task.message = editedMessage;
      setIsEditing(false);
      setShowContextMenu(false); // Hide context menu after edit
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleContextMenuAction = (action: 'edit' | 'delete') => {
    setShowContextMenu(false);
    if (action === 'edit') {
      setIsEditing(true);
    } else if (action === 'delete') {
      handleDelete();
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

  const formattedCreationDate =
    task.date instanceof Timestamp
      ? format(task.date.toDate(), "dd/MM/yyyy")
      : 'N/A';

  return (
    <div
      ref={drag}
      className={`bg-white border-l-4 rounded-xl cursor-pointer mb-4 ${statusColors[task.status]} ${isDragging ? 'opacity-50' : ''}`}
      onContextMenu={handleContextMenu}
    >
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
              onContextMenu={handleContextMenu} // Attach context menu handler
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
              <MenuButton className="inline-flex w-full justify-left gap-x-1.5 bg-white items-center">
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

        {/* for dividingi used horizontal Line  */}
        <div className="flex justify-center mb-4">
          <hr className="border-t border-gray-400 w-11/12" />
        </div>

        <CardFooter>
          
          {/* Display date */}
          <div className="text-gray-500">
            <CalendarIcon className="mr-2 inline h-5 w-5 -mt-2" />
            {`${formattedCreationDate}`}
          </div>
        </CardFooter>
      </Card>

      {/* Context Menu */}
      {showContextMenu && (
        <div 
          className="absolute bg-white border border-gray-300 rounded shadow-lg"
          style={{ top: contextMenuPosition?.y, left: contextMenuPosition?.x }}
        >
          <button 
            onClick={() => handleContextMenuAction('edit')} 
            className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
          >
            Edit
          </button>
          <button 
            onClick={() => handleContextMenuAction('delete')} 
            className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
          >
            Delete
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default ToDo;
