// src/components/Card.tsx
import React from 'react';

interface CardProps {
  content: string;
  theme: string;
}

const Card: React.FC<CardProps> = ({ content, theme }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      {content}
    </div>
  );
};

export default Card;
