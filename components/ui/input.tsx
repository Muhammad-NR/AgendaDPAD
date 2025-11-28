import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode; // Bisa masukin icon Lucide di sini
}

export function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input 
        className={`
          w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl 
          focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent 
          outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400
          ${icon ? 'pl-12' : 'pl-4'} 
          ${className}
        `}
        {...props}
      />
    </div>
  );
}