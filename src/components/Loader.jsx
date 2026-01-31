import React from 'react';

const Loader = ({ fullPage = false }) => {
  const containerClass = fullPage 
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-[99]"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-600">Loading AcademyOS...</p>
      </div>
    </div>
  );
};

export default Loader;