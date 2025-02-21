// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  onClick?: (e: React.FormEvent) => void;
  disabled?: boolean;
  children: React.ReactNode; // This is the label (text) of the button
  type?: "button" | "submit" | "reset"; // Added type prop for flexibility
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled = false, children, type = "button"}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type} // Supports button type flexibility
      className={`px-6 py-2 text-white font-semibold rounded-lg ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-300'
      } `}
    >
      {children} {/* This is the label/text on the button */}
    </button>
  );
};

export default Button;
