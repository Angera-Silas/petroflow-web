import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  theme: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", onSearch, theme }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const containerStyles =
    theme === "dark"
      ? "bg-gray-800 text-white border border-gray-600 hover:border-gray-400 focus-within:border-gray-300"
      : "bg-white text-gray-900 border border-gray-300 hover:border-blue-500 focus-within:border-blue-400";

  const inputStyles =
    "flex-1 px-3 py-2 outline-none border-none bg-transparent"; // Keep background unchanged

  const buttonStyles =
    theme === "dark"
      ? "text-white border-l border-gray-600 hover:border-gray-400 focus:border-gray-300"
      : "text-gray-900 border-l border-gray-300 hover:border-blue-500 focus:border-blue-400";

  return (
    <div className={`flex items-center rounded-lg p-2 transition duration-200 ${containerStyles}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputStyles}
      />
      <button
        onClick={handleSearch}
        className={`px-4 py-2 rounded-r-md transition duration-200 ${buttonStyles}`}
      >
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
