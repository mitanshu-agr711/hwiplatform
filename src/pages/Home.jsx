import React from 'react'
import HeroImg from '../assets/hero.png?url'

export default function Home({ setRoute }) {
  return (
    <div className="max-w-6xl mx-auto">
      <section className="grid md:grid-cols-2 gap-8 items-center py-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold">Global Disaster Insights</h1>
          <p className="mt-4 text-slate-600">Track, analyze, and visualize disaster data globally. Monitor events in real-time and gain insights for response and planning.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setRoute('dashboard')} className="px-4 py-2 bg-red-600 text-white rounded">Go to Dashboard</button>
            <button onClick={() => setRoute('analysis')} className="px-4 py-2 border rounded">Learn More</button>
          </div>
        </div>

        <div className="h-64 bg-gradient-to-br from-slate-200 to-white rounded-lg flex items-center justify-center overflow-hidden">
          <img src={HeroImg} alt="Visualization placeholder" className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-4 space-y-3 text-slate-600">
          <li>1. Data collection: ingest reports, sensors, and social media (mock data for demo).</li>
          <li>2. Analysis: apply filters and sentiment analysis to understand impact.</li>
          <li>3. Visualization: map, charts, and heatmaps to guide decisions.</li>
        </ol>
      </section>

      <footer className="mt-12 border-t pt-6 text-sm text-slate-500">
        © {new Date().getFullYear()} Disaster Monitor — Built for demonstration. <span className="ml-4">Follow us: [SVG icons placeholder]</span>
      </footer>
    </div>
  )
}
