// Basic chart setup using Chart.js
import { Line } from 'react-chartjs-2';

const AnalyticsChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Compliance Data',
        data: data.values,
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default AnalyticsChart;
