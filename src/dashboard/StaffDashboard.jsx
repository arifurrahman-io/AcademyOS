import React from 'react';
import { Search, ClipboardList, BookOpen } from 'lucide-react';

const StaffDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome, Staff Member!</h1>
        <p className="opacity-90 mt-2">Manage your student attendance and daily records efficiently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Search className="text-blue-600" />
            <h2 className="text-xl font-bold">Quick Student Search</h2>
          </div>
          <input 
            type="text" 
            placeholder="Search by Roll Number..." 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-green-600" />
            <h2 className="text-xl font-bold">Today's Tasks</h2>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-gray-600"><BookOpen size={16}/> Record morning attendance</li>
            <li className="flex items-center gap-2 text-gray-600"><BookOpen size={16}/> Update HSC-2026 Batch progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;