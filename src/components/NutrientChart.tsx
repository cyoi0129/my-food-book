import { FC } from 'react';
import siteData from '../app/util';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartProps } from '../app/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const NutrientChart: FC<ChartProps> = (props) =>  {
  const { label, data } = props;
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: siteData.nutrient,
      },
    },
  };
  const labels = label;
  const graphData = {
    labels,
    datasets: [
      {
        label: siteData.protein,
        data: data.map((item) => item.protein),
        backgroundColor: 'rgb(255, 99, 132)',
      },
      {
        label: siteData.sugar,
        data: data.map((item) => item.sugar),
        backgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: siteData.fat,
        data: data.map((item) => item.fat),
        backgroundColor: 'rgb(53, 162, 235)',
      },
    ],
  };
  return <Bar options={options} height={300} data={graphData} />;
};

export default NutrientChart;