import { Bar } from 'react-chartjs-2';
import { chartOptions, chartColors } from './chartSetup';

interface BarChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color?: string }[];
  height?: number;
}

export default function BarChart({ labels, datasets, height = 300 }: BarChartProps) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => {
      const colors = [chartColors.blue, chartColors.orange, chartColors.green];
      const color = ds.color || colors[i % colors.length];
      return {
        label: ds.label,
        data: ds.data,
        backgroundColor: color + '80',
        borderColor: color,
        borderWidth: 1,
        borderRadius: 6,
      };
    }),
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={chartOptions} />
    </div>
  );
}
