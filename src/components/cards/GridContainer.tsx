import React, { useState, useRef } from "react";

interface GridContainerProps {
  children: React.ReactNode;
  columns?: number;
  rows?: number;
  gap?: string;
  padding?: string;
  theme?: "light" | "dark";
  paginated?: boolean;
  itemsPerPage?: number;
  showPageNumber?: boolean;
}

const GridContainer: React.FC<GridContainerProps> = ({
  children,
  columns = 3,
  rows = 2,
  gap = "4",
  padding = "6",
  theme = "light",
  paginated = false,
  itemsPerPage = 6,
  showPageNumber = true, // Option to toggle page number display
}) => {
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-800 text-white" : "bg-white text-black";
  const gridStyle = `grid grid-cols-${columns} grid-rows-${rows} gap-${gap} p-${padding}`;

  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenArray = React.Children.toArray(children);
  const totalPages = Math.ceil(childrenArray.length / itemsPerPage);

  const displayedItems = paginated
    ? childrenArray.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : childrenArray;

  // Drag Scroll Functionality
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startDrag = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 2; // Adjust scroll speed
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  return (
    <div className={`rounded-lg shadow-md ${bgColor}`}>
      {/* Draggable Grid Container */}
      <div
        ref={containerRef}
        className={`overflow-x-auto cursor-grab ${gridStyle}`}
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        {displayedItems}
      </div>

      {/* Pagination with Optional Page Number */}
      {paginated && totalPages > 1 && (
        <div className="flex justify-center items-center mt-4">
          <button
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>

          {/* Page Indicator */}
          <div className="mx-4 flex space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <span
                key={index}
                className={`h-3 w-3 rounded-full ${
                  currentPage === index + 1 ? "bg-blue-500" : "bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>

          {/* Optional Page Number Display */}
          {showPageNumber && (
            <span className="ml-4 text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default GridContainer;
