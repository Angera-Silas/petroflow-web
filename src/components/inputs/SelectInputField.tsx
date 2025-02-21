import React from "react";

interface SelectInputFieldProps {
  label: string;
  value: string;
  name: string;
  theme: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
}

const SelectInputField: React.FC<SelectInputFieldProps> = ({ label, value, onChange, options, name, theme }) => {
  return (
    <div className="flex flex-col">
      <label className={`font-medium mb-1 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInputField;
