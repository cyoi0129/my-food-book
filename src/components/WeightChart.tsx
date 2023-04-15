import { FC } from 'react';
import siteData from '../app/util';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartProps } from '../app/types';

ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController);
const WeightChart: FC<ChartProps> = (props) => {
  const { label, data } = props;
  const labels = label;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: siteData.weight,
      },
    },
  };

  const graphData = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: siteData.weight,
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 2,
        fill: false,
        data: data.map((item) => item.weight),
      },
      {
        type: 'bar' as const,
        label: siteData.calorie,
        backgroundColor: 'rgb(75, 192, 192)',
        data: data.map((item) => item.calorie),
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };
  return <Chart options={options} type="bar" height={300} data={graphData} />;
};

export default WeightChart;
