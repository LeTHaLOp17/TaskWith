  import React, { useEffect, useState } from 'react';
  import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
  import { db } from '@/components/FireBase';
  import ToDo from './ToDo';
  import InProgress from './InProgress';
  import Completed from './Completed';
  import CreateFile from './CreateFile';
  import { DndProvider } from 'react-dnd';
  import { HTML5Backend } from 'react-dnd-html5-backend';

  interface Task {
    id: string;
    title: string;
    message?: string;
    priority?: 'High' | 'Medium' | 'Low';
    date?: Timestamp | null;
    status: string;
  }

  const DashBoard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'tasks'));
          const tasksList = querySnapshot.docs.map((doc) => {
            const data = doc.data() as Omit<Task, 'id'>;
            return {
              id: doc.id,
              ...data,
              priority: data.priority as 'High' | 'Medium' | 'Low' | undefined, // Ensure the type aligns
            };
          });
          console.log('Fetched tasks:', tasksList); 
          setTasks(tasksList);
        } catch (error) {
          console.error('Error fetching tasks: ', error);
        }
      };
      

      fetchTasks();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
      try {
        const taskRef = doc(db, 'tasks', id);
        await updateDoc(taskRef, { status: newStatus });

        
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? { ...task, status: newStatus } : task
          )
        );
      } catch (error) {
        console.error('Error updating status: ', error);
      }
    };

    const toDoTasks = tasks.filter(task => task.status === 'ToDo');
    const inProgressTasks = tasks.filter(task => task.status === 'InProgress');
    const completedTasks = tasks.filter(task => task.status === 'Completed');

    return (
      <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex items-center justify-between mb-4 bg-slate-300 p-6 pl-0 rounded-2xl m-7">
          <h2 className="text-2xl font-bold ml-5">TaskWith</h2>
          <div className="text-white bg-sky-600 hover:bg-sky-200">
            <CreateFile />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-7">
          
          {/* this is for ToDo column*/}
          <div className="bg-white shadow-xl rounded-xl">
            <h2 className="text-xl font-semibold mb-2 text-center bg-violet-500 p-4 rounded-t-xl">To Do</h2>
            <div className='rounded-xl p-9'>
              {toDoTasks.map(task => (
                <ToDo key={task.id} task={task} onStatusChange={handleStatusChange} onTaskDelete={function (): void {
                  throw new Error('Function not implemented.');
                } } />
              ))}
            </div>
          </div>

          {/*this is In Progress colummn */}
          <div className="bg-white shadow-xl rounded-xl">
            <h2 className="text-xl font-semibold mb-2 text-center bg-yellow-400 p-4 rounded-t-xl">In Progress</h2>
            <div className='rounded-xl p-9'>
              {inProgressTasks.map(task => (
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                <InProgress key={task.id} task={task} onStatusChange={handleStatusChange} onTaskEdit={function (_id: string, _newTitle: string): void {
                  throw new Error('Function not implemented.');
                } } onTaskDelete={function (): void {
                  throw new Error('Function not implemented.');
                } } />
              ))}
            </div>
          </div>

          {/*this is Completed column*/}
          <div className="bg-white shadow-xl rounded-xl">
            <h2 className="text-xl font-semibold mb-2 text-center bg-green-500 p-4 rounded-t-xl">Completed</h2>
            <div className='rounded-xl p-9'>
              {completedTasks.map(task => (
                <Completed key={task.id} task={task} onStatusChange={handleStatusChange} onTaskDelete={function (): void {
                  throw new Error('Function not implemented.');
                } } />
              ))}
            </div>
          </div>
        </div>
        </DndProvider>
      </>
    );
  };

  export default DashBoard;
