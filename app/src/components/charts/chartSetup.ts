import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const chartColors = {
  blue: '#3B82F6',
  brightBlue: '#60A5FA',
  orange: '#F97316',
  green: '#22C55E',
  red: '#EF4444',
  yellow: '#EAB308',
  purple: '#8B5CF6',
  slate: '#94A3B8',
};

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: '#94A3B8', font: { family: 'Cairo', size: 12 } },
    },
  },
  scales: {
    x: {
      grid: { color: '#334155', drawBorder: false },
      ticks: { color: '#94A3B8', font: { family: 'Cairo', size: 11 } },
    },
    y: {
      grid: { color: '#334155', drawBorder: false },
      ticks: { color: '#94A3B8', font: { family: 'Cairo', size: 11 } },
    },
  },
};

export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: '#94A3B8', font: { family: 'Cairo', size: 11 }, padding: 16 },
    },
  },
};
