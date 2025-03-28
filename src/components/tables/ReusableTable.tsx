/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaCog, FaChevronDown } from "react-icons/fa";
import './ReusableTable.css'; // Import the external CSS file

interface Column {
  key: string;
  label: string;
  resizable?: boolean;
  render?: (row: any) => React.ReactNode;
}

interface RowData {
  [key: string]: any;
}

interface Action<T> {
  label: string;
  onClick: (row: T) => void;
}

interface ReusableTableProps<T> {
  columns: Column[];
  data: T[];
  onRowSelect: (selectedIds: string[]) => void;
  theme: string;
  itemsPerPage: number;
  visibleColumns: Column[];
  onColumnVisibilityChange: (col: Column) => void;
  enableColumnResizing?: boolean;
  rowKey: string;
  selectionMode?: "single" | "multiple";
  actions?: Action<T>[]; // Generic actions
}

const ReusableTable = <T extends RowData>({
  columns,
  data,
  onRowSelect,
  theme,
  itemsPerPage,
  visibleColumns,
  onColumnVisibilityChange,
  enableColumnResizing = true,
  rowKey,
  selectionMode = "multiple",
  actions, // Destructure the generic actions
}: ReusableTableProps<T>) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" }>({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [actionDropdown, setActionDropdown] = useState<{ [key: string]: boolean }>({}); // Track dropdown visibility

  useEffect(() => {
    onRowSelect(selectedRows);
  }, [selectedRows, onRowSelect]);

  const handleRowSelect = (id: string) => {
    if (selectionMode === "single") {
      setSelectedRows((prev) => (prev.includes(id) ? [] : [id]));
    } else {
      setSelectedRows((prev) =>
        prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]
      );
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleDropdown = (rowId: string) => {
    setActionDropdown((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((val) =>
      val.toString().toLowerCase().includes(searchKeyword.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    return sortConfig.direction === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const themeClasses = theme === "dark" ? "bg-dark-background text-dark-text" : "bg-light-background text-light-text";
  const dropdownTheme = theme === "dark" ? "bg-gray-600 text-dark-text" : "bg-white text-light-text";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";

  return (
    <div className={`p-4 border ${borderColor} rounded-md ${themeClasses}`}>
      <input
        type="text"
        placeholder="Search..."
        className={`border p-2 rounded-md mb-2 w-full ${borderColor} ${themeClasses}`}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      <div className="mb-2 flex flex-wrap">
        {columns.map((col) => (
          <label key={col.key} className="mr-4">
            <input
              type="checkbox"
              checked={visibleColumns.includes(col)}
              onChange={() => onColumnVisibilityChange(col)}
            />{" "}
            {col.label}
          </label>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full border-collapse border ${borderColor}`}>
          <thead>
            <tr className={`${themeClasses}`}>
              <th className={`border p-2 ${borderColor}`}>Select</th>
              {visibleColumns.map((col, index) => (
                <th
                  key={col.key}
                  className={`border p-2 cursor-pointer ${borderColor} ${enableColumnResizing ? 'resizable' : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
              {actions && <th className={`border p-2 ${borderColor}`}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row[rowKey]} className={`border ${borderColor}`}>
                <td className={`border p-2 ${borderColor}`}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row[rowKey])}
                    onChange={() => handleRowSelect(row[rowKey])}
                  />
                </td>
                {visibleColumns.map((col) => (
                  <td key={col.key} className={`border p-2 ${borderColor} text-sm`}>
                    {row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className={`p-2 flex justify-center items-center ${borderColor}`}>
                    <div className="relative flex justify-center items-center">
                      <button
                        className="flex items-center justify-center space-x-1"
                        onClick={() => toggleDropdown(row[rowKey])}
                      >
                        <FaCog />
                      </button>
                      {actionDropdown[row[rowKey]] && (
                        <div className={`absolute border rounded shadow-md mt-2 z-50 ${dropdownTheme}`}>
                          {actions.map((action) => (
                            <button
                              key={action.label}
                              className={`block px-1 py-2 text-left w-full ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-100'} ${dropdownTheme}`}
                              onClick={() => {
                                console.log('Action clicked:', action.label, 'Row:', row);
                                action.onClick(row);
                                toggleDropdown(row[rowKey]);
                              }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-4">
          <button type="button" onClick={handlePrevPage} disabled={currentPage === 1} className="p-2">
            <FaChevronLeft />
          </button>
          <span className="font-bold">
            {currentPage > 1 && `${currentPage - 1} - `}
            {currentPage}
            {currentPage < totalPages && ` - ${currentPage + 1}`}
          </span>
          <button type="button" onClick={handleNextPage} disabled={currentPage === totalPages} className="p-2">
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReusableTable;