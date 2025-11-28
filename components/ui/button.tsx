import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
}

export function Button({ 
  children, 
  className = '', 
  isLoading = false, 
  variant = 'primary', 
  ...props 
}: ButtonProps) {
  
  const baseStyles = "w-full py-3.5 rounded-xl font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]",
    outline: "bg-white border-2 border-gray-100 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    ghost: "bg-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
}