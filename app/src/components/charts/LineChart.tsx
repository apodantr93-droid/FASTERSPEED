import { Line } from 'react-chartjs-2';
import { chartOptions, chartColors } from './chartSetup';

interface LineChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; color?: string }[];
  height?: number;
}

export default function LineChart({ labels, datasets, height = 300 }: LineChartProps) {
  const data = {
    labels,
    datasets: datasets.map((ds, i) => {
      const colors = [chartColors.blue, chartColors.orange, chartColors.green, chartColors.red, chartColors.purple];
      const color = ds.color || colors[i % colors.length];
      return {
        label: ds.label,
        data: ds.data,
        borderColor: color,
        backgroundColor: color + '20',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2,
      };
    }),
  };

  const options = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        labels: { color: '#94A3B8', font: { size: 12 }, boxWidth: 12 },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}
