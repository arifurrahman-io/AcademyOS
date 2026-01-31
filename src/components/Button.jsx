import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, variant = 'primary', isLoading, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;