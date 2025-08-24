import React, { useState } from 'react'
import { socialMock } from '../utils/mockData'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip)
import Nav from "../components/Navbar";

export default function Social() {
  const [input, setInput] = useState('#earthquake,#floodrelief')
  const tags = input.split(',').map(s => s.trim()).filter(Boolean)

  const datasets = tags.map((t, idx) => ({
    label: t,
    data: (socialMock.data[t] || []).map(d => d.mentions),
    borderColor: ['#ef4444', '#0ea5e9', '#f97316'][idx % 3],
    tension: 0.3
  }))

  const labels = (socialMock.data[tags[0]] || []).map(d => d.ts)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
            <Nav />
      
      <h2 className="text-2xl font-semibold">Social Media Analysis</h2>
      <p className="text-sm text-slate-600">Sentiment analysis based on mock social posts.</p>

      <div className="bg-white rounded shadow p-4">
        <label className="text-sm">Enter hashtags (comma-separated)</label>
        <input value={input} onChange={e => setInput(e.target.value)} className="w-full border rounded p-2 mt-2" />

        <div className="mt-4">
          <Line data={{ labels, datasets }} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {tags.map(t => (
          <div key={t} className="bg-white rounded shadow p-4">
            <div className="font-semibold">{t}</div>
            <div className="text-sm text-slate-600 mt-2">Methodology: sentiment analysis on recent posts (mock data)</div>
            <div className="mt-3">
              <div>Recent sentiment:</div>
              <div className="mt-2 text-sm">Positive: {(socialMock.data[t]?.slice(-1)[0]?.sentiment.positive) || 0}</div>
              <div className="text-sm">Neutral: {(socialMock.data[t]?.slice(-1)[0]?.sentiment.neutral) || 0}</div>
              <div className="text-sm">Negative: {(socialMock.data[t]?.slice(-1)[0]?.sentiment.negative) || 0}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
