import { Bar } from "react-chartjs-2";

interface BarChartProps {
  data: { label: string; values: number[] }[];
  labels: string[];
  theme: string;
}

const BarChart = ({ data, labels, theme }: BarChartProps) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <Bar
        data={{
          labels,
          datasets: data.map((d, i) => ({
            label: d.label,
            data: d.values,
            backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"][i % 3],
          })),
        }}
      />
    </div>
  );
};

export default BarChart;
