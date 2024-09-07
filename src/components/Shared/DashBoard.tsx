// import React from 'react'
import ToDo from './ToDo'
import InProgress from './InProgress'
import Completed from './Completed'
import { Button } from "@/components/ui/button"

const DashBoard = () => {
  return (
    <section className="p-4 space-y-4">
      {/* Button Section */}
      <div className="flex items-center justify-between mb-4 bg-slate-200 p-4 rounded-xl">
    <h2 className="text-2xl font-bold">TaskWith</h2>
    <Button variant="outline" className="text-blue-600 bg-sky-300">
      Create new
    </Button>
  </div>
      

      {/* Grid Layout for Components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ToDo Component */}
        <div className="bg-gray-100 shadow-xl rounded-xl ">
          <h2 className="text-xl font-semibold mb-2 text-center bg-violet-500 p-5 rounded-t-xl">To Do</h2>
          <ToDo />
        </div>

        {/* Progress Component */}
        <div className="bg-gray-100 shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-center bg-yellow-400 p-4 rounded-t-xl">In Progress</h2>
          <InProgress />
        </div>

        {/* Complete Component */}
        <div className="bg-gray-100 shadow-xl rounded-xl">
          <h2 className="text-xl font-semibold mb-2 text-center bg-green-500 p-4 rounded-t-xl">Completed</h2>
          <Completed />
        </div>
      </div>
    </section>
  )
}

export default DashBoard
