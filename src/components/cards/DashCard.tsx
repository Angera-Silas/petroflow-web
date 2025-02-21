import React from "react";

interface DashCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  theme: string;
  bgColor?: string;
  textColor?: string;
  onClick?: () => void;
}

const DashCard: React.FC<DashCardProps> = ({
  title,
  value,
  icon,
  theme,
  bgColor,
  textColor,
  onClick,
}) => {
  const isDark = theme === "dark";
  const defaultBg = isDark ? "bg-gray-800" : "bg-gray-100";
  const defaultText = isDark ? "text-white" : "text-black";

  return (
    <div
      className={`p-4 rounded-lg shadow-lg flex items-center space-x-4 
        ${bgColor || defaultBg} ${textColor || defaultText} cursor-pointer`}
      onClick={onClick}
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
};

export default DashCard;
