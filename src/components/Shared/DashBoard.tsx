import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/components/FireBase';
import ToDo from './ToDo';
import InProgress from './InProgress';
import Completed from './Completed';
import CreateFile from './CreateFile';

interface Task {
  id: string;
  title: string;
  message?: string;
  priority?: string;
  date?: string;
  status: string;
}

const DashBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        const tasksList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Task, 'id'>),
        }));
        setTasks(tasksList);
      } catch (error) {
        console.error('Error fetching tasks: ', error);
      }
    };

    fetchTasks();
  }, []);

  const toDoTasks = tasks.filter(task => task.status === 'ToDo');
  const inProgressTasks = tasks.filter(task => task.status === 'InProgress');
  const completedTasks = tasks.filter(task => task.status === 'Completed');

  return (
    <>
      <div className="flex items-center justify-between mb-4 bg-slate-300 p-6 pl-0 rounded-2xl m-7">
        <h2 className="text-2xl font-bold ml-5">TaskWith</h2>
        <div className="text-white bg-sky-600 hover:bg-sky-200">
          <CreateFile />
        </div>
      </div>

      {/* Grid Layout for Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-7">
        
        {/* This is ToDo */}
        <div className="bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-center bg-violet-500 p-4 rounded-t-xl">To Do</h2>
          <div className='rounded-xl p-9'>
            {toDoTasks.map(task => (
              <ToDo key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Progress is this */}
        <div className="bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-center bg-yellow-400 p-4 rounded-t-xl">In Progress</h2>
          <div className='rounded-xl p-9'>
            {inProgressTasks.map(task => (
              <InProgress key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* This is Completed */}
        <div className="bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-center bg-green-500 p-4 rounded-t-xl">Completed</h2>
          <div className='rounded-xl p-9'>
            {completedTasks.map(task => (
              <Completed key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
