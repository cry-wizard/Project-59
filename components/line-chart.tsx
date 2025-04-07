"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface LineChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      yAxisID: string
      tension: number
      borderWidth: number
      pointRadius: number
    }[]
  }
}

export function LineChart({ data }: LineChartProps) {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
        },
      },
      tooltip: {
        usePointStyle: true,
        boxWidth: 6,
        boxHeight: 6,
        padding: 10,
        boxPadding: 4,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          color: "rgba(180, 5, 244, 0.1)",
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          display: false,
        },
      },
    },
  }

  return <Line options={options} data={data} />
}

