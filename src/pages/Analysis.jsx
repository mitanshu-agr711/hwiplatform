import React, { useState } from 'react'
import { historicalMock } from '../utils/mockData'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)
import Nav from "../components/Navbar";

export default function Analysis() {
  const [range] = useState('24m')

  const lineData = {
    labels: historicalMock.monthly.map(m => m.month),
    datasets: [{ label: 'Disasters', data: historicalMock.monthly.map(m => m.count), borderColor: '#ef4444', tension: 0.2 }]
  }

  const barData = {
    labels: historicalMock.types.map(t => t.type),
    datasets: [{ label: 'Count', data: historicalMock.types.map(t => t.count), backgroundColor: ['#ef4444','#0ea5e9','#f97316','#a78bfa'] }]
  }

  const pieData = {
    labels: Object.keys(historicalMock.severity),
    datasets: [{ data: Object.values(historicalMock.severity), backgroundColor: ['#ef4444','#f59e0b','#86efac'] }]
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Nav />
      <h2 className="text-2xl font-semibold">Historical Analysis & Insights</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-medium">Disasters Over Time</h4>
          <Line data={lineData} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h4 className="font-medium">Most Frequent Types</h4>
          <Bar data={barData} />
        </div>
        <div className="bg-white rounded shadow p-4 md:col-span-2">
          <h4 className="font-medium">Severity Distribution</h4>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  )
}
