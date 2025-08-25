import React from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, AreaChart, Area 
} from 'recharts';

const COLORS = ['#ef4444', '#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#f59e0b', '#84cc16', '#06b6d4'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Disaster Distribution Pie Chart
export const DisasterPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  </ResponsiveContainer>
);

// Analysis Type Bar Chart
export const AnalysisBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
      <XAxis 
        dataKey="type" 
        tick={{ fontSize: 12 }}
        stroke="#6b7280"
      />
      <YAxis 
        tick={{ fontSize: 12 }}
        stroke="#6b7280"
      />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

// Social Media Score Gauge
export const ScoreGauge = ({ score, maxScore = 10 }) => {
  const data = [
    { name: 'Score', value: score * 10, fill: score > 7 ? '#10b981' : score > 5 ? '#f97316' : '#ef4444' }
  ];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="60%" 
          outerRadius="90%" 
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar dataKey="value" cornerRadius={10} fill={data[0].fill} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color: data[0].fill }}>
            {score}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            / {maxScore}
          </div>
        </div>
      </div>
    </div>
  );
};

// Time Series Line Chart
export const TimeSeriesChart = ({ data, dataKey, color = '#f97316' }) => (
  <ResponsiveContainer width="100%" height={200}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
      <XAxis 
        dataKey="timestamp" 
        tick={{ fontSize: 10 }}
        stroke="#6b7280"
      />
      <YAxis 
        tick={{ fontSize: 10 }}
        stroke="#6b7280"
      />
      <Tooltip content={<CustomTooltip />} />
      <Line 
        type="monotone" 
        dataKey={dataKey} 
        stroke={color} 
        strokeWidth={2}
        dot={{ fill: color, strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

// Performance Metrics Area Chart
export const PerformanceAreaChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
      <XAxis 
        dataKey="name" 
        tick={{ fontSize: 12 }}
        stroke="#6b7280"
      />
      <YAxis 
        tick={{ fontSize: 12 }}
        stroke="#6b7280"
      />
      <Tooltip content={<CustomTooltip />} />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke="#f97316" 
        fill="#fed7aa" 
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
);

// Confidence Level Progress Bar
export const ConfidenceBar = ({ confidence, severity }) => {
  const getColor = () => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Confidence
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {confidence}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
};

// Severity Badge
export const SeverityBadge = ({ severity }) => {
  const getStyles = () => {
    switch (severity?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStyles()}`}>
      {severity}
    </span>
  );
};
