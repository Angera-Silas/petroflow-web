import { Line } from "react-chartjs-2";

interface LineChartProps {
  data: { label: string; values: number[] }[];
  labels: string[];
  theme?: "light" | "dark";
}

const LineChart = ({ data, labels, theme = "light" }: LineChartProps) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <Line
        data={{
          labels,
          datasets: data.map((d, i) => ({
            label: d.label,
            data: d.values,
            borderColor: ["#3B82F6", "#FF6384", "#4CAF50"][i % 3],
            fill: false,
          })),
        }}
      />
    </div>
  );
};

export default LineChart;
