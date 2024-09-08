// import React from 'react'
import ToDo from './ToDo'
import InProgress from './InProgress'
import Completed from './Completed'
import { CreateFile } from './CreateFile'

const DashBoard = () => {
  return (
    <>
      <div className="flex items-center justify-between mb-4 bg-slate-300 p-6 pl-0 rounded-2xl m-7">
    <h2 className="text-2xl font-bold ml-5">TaskWith</h2>
    <div className="text-white bg-sky-600 hover:bg-sky-500">
      <CreateFile />
    </div>
  </div>
      

      {/* Grid Layout for Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-7">
        
        {/* This is ToDo */}
        <div className="bg-white shadow-xl rounded-xl">
          {/* ToDo Text */}
          <h2 className="text-xl font-semibold mb-2 text-center bg-violet-500 p-4 rounded-t-xl">To Do</h2>
          <div className='rounded-xl p-9'>
            <ToDo />
          </div>
          
        </div>

        {/* Progess is this */}
        <div className="bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-center bg-yellow-400 p-4 rounded-t-xl">In Progress</h2>
          <div className='rounded-xl p-9'>
            <InProgress />
          </div>
        </div>

        {/* This is Completed */}
        <div className="bg-white shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-center bg-green-500 p-4 rounded-t-xl">Completed</h2>
          <div className='rounded-xl p-9'>
            <Completed />
          </div>
        </div>
      </div>
      </>
  )
}

export default DashBoard;