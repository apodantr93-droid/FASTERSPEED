import { Doughnut } from 'react-chartjs-2';
import { doughnutOptions, chartColors } from './chartSetup';

interface PieChartProps {
  labels: string[];
  data: number[];
  height?: number;
}

export default function PieChart({ labels, data, height = 280 }: PieChartProps) {
  const colors = [
    chartColors.blue,
    chartColors.orange,
    chartColors.green,
    chartColors.red,
    chartColors.yellow,
    chartColors.purple,
    chartColors.slate,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors.slice(0, data.length),
        borderColor: '#1E293B',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div style={{ height }}>
      <Doughnut data={chartData} options={doughnutOptions} />
    </div>
  );
}
