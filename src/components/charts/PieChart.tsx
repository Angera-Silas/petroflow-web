import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface PieChartProps {
  data: { label: string; value: number}[];
  theme?: string;
  headerText?: string;
  dataTitle?: string 

}

const PieChart: React.FC<PieChartProps> = ({ data, theme, headerText , dataTitle}) => {
  const colors = [
    'rgba(255, 99, 132, 0.3)',
    'rgba(54, 162, 235, 0.3)',
    'rgba(255, 206, 86, 0.3)',
    'rgba(75, 192, 192, 0.3)',
    'rgba(153, 102, 255, 0.3)',
    'rgba(255, 159, 64, 0.3)',
    'rgba(199, 199, 199, 0.3)',
    'rgba(83, 102, 255, 0.3)',
    'rgba(255, 99, 71, 0.3)',
    'rgba(60, 179, 113, 0.3)',
    'rgba(255, 140, 0, 0.3)',
    'rgba(75, 0, 130, 0.3)',
    'rgba(255, 20, 147, 0.3)',
    'rgba(0, 191, 255, 0.3)',
    'rgba(34, 139, 34, 0.3)',
    'rgba(255, 215, 0, 0.3)',
    'rgba(139, 69, 19, 0.3)',
    'rgba(255, 105, 180, 0.3)',
    'rgba(0, 255, 127, 0.3)',
    'rgba(70, 130, 180, 0.3)',
    'rgba(210, 105, 30, 0.3)',
    'rgba(255, 69, 0, 0.3)',
    'rgba(0, 128, 128, 0.3)',
    'rgba(255, 228, 181, 0.3)',
    'rgba(255, 99, 132, 0.3)',
    'rgba(54, 162, 235, 0.3)',
    'rgba(255, 206, 86, 0.3)',
    'rgba(75, 192, 192, 0.3)',
    'rgba(153, 102, 255, 0.3)',
    'rgba(255, 159, 64, 0.3)',
  ];

  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(199, 199, 199, 1)',
    'rgba(83, 102, 255, 1)',
    'rgba(255, 99, 71, 1)',
    'rgba(60, 179, 113, 1)',
    'rgba(255, 140, 0, 1)',
    'rgba(75, 0, 130, 1)',
    'rgba(255, 20, 147, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(34, 139, 34, 1)',
    'rgba(255, 215, 0, 1)',
    'rgba(139, 69, 19, 1)',
    'rgba(255, 105, 180, 1)',
    'rgba(0, 255, 127, 1)',
    'rgba(70, 130, 180, 1)',
    'rgba(210, 105, 30, 1)',
    'rgba(255, 69, 0, 1)',
    'rgba(0, 128, 128, 1)',
    'rgba(255, 228, 181, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: dataTitle ?? 'Dataset',
        data: data.map((d) => d.value),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? 'white' : 'black',
        },
      },
      title: {
        display: true,
        text: headerText ?? 'Pie Chart',
        color: theme === 'dark' ? 'white' : 'black',
      },
    },
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} flex items-center justify-center`}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;