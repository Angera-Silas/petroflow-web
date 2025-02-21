/* eslint-disable @typescript-eslint/no-explicit-any */
interface PivotTableProps {
    data: { [key: string]: any }[];
    columns: string[];
    rowKey: string;
    theme?: "light" | "dark";
  }
  
  const PivotTable = ({ data, columns, rowKey, theme = "light" }: PivotTableProps) => {
    return (
      <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">{rowKey}</th>
              {columns.map((col) => (
                <th key={col} className="border p-2">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="border p-2">{row[rowKey]}</td>
                {columns.map((col) => (
                  <td key={col} className="border p-2">{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default PivotTable;
  