import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', color = 'orange' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    orange: 'text-orange-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500'
  };

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`border-2 border-gray-300 border-t-transparent rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    </div>
  );
};

const LoadingCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
      <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div 
        key={index}
        className={`h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 ${
          index === lines - 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export { LoadingSpinner, LoadingCard, LoadingSkeleton };
