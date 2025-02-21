/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

interface TableProps {
  columns: string[];
  data: { [key: string]: any }[];
  theme: string;
  itemsPerPage?: number;
  title: string;
}

const Table = ({ columns, data, theme, itemsPerPage = 10, title }: TableProps) => {
  const isDarkMode = theme === "dark";

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get paginated data
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}>
            {columns.map((col, index) => (
              <th key={index} className="p-2 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex} className={`border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-2">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end space-x-2 mt-4">
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-3 py-1 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className={`px-3 py-1 rounded ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
