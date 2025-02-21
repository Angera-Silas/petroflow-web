import { Pie } from "react-chartjs-2";

interface PieChartProps {
  data: { label: string; value: number }[];
  theme?: "light" | "dark";
}

const PieChart = ({ data, theme = "light" }: PieChartProps) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <Pie
        data={{
          labels: data.map((d) => d.label),
          datasets: [
            {
              label: "Data",
              data: data.map((d) => d.value),
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        }}
      />
    </div>
  );
};

export default PieChart;
