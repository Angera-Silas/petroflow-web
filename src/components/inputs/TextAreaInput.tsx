import React from "react";

interface TextAreaInputProps {
  label: string;
  name: string;
  cols?: number;
  rows?: number;
  placeholder?: string;
  value: string;
  theme?: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, name, cols = 30, rows = 4, placeholder, value, onChange, theme }) => {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium text-gray-700 ${
          theme === "dark" ? "text-white" : "text-black"
        }` }>{label}</label>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        cols={cols}
        rows={rows}
        className={`w-full p-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"
        }`}
      />
    </div>
  );
};

export default TextAreaInput;
