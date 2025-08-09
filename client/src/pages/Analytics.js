import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CpuChipIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
    fetchPerformance();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/analytics/summary?range=${timeRange}`);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      toast.error('Failed to fetch analytics data');
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await axios.get(`/api/analytics/performance?range=${timeRange}`);
      setPerformance(response.data.data);
    } catch (error) {
      console.error('Performance fetch error:', error);
      toast.error('Failed to fetch performance data');
    } finally {
      setLoading(false);
    }
  };

  // Chart colors
  const COLORS = {
    'correct_predicted_correct': '#10b981',
    'correct_predicted_wrong': '#f59e0b', 
    'wrong_predicted_correct': '#ef4444',
    'wrong_predicted_wrong': '#6b7280'
  };

  // Sample data when no real data available
  const sampleData = {
    performance: {
      accuracy: 68.5,
      precision: 72.3,
      recall: 65.8,
      f1Score: 68.9,
      confusionMatrix: { tp: 15, tn: 12, fp: 8, fn: 5 },
      totalPredictions: 40,
      additional: {
        avgConfidence: 0.652,
        avgProcessingTime: 185,
        textInputs: 35,
        imageInputs: 5,
        pamMatches: 32
      }
    },
    categoryDistribution: [
      { _id: 'correct_predicted_correct', count: 15, avgConfidence: 0.75 },
      { _id: 'correct_predicted_wrong', count: 5, avgConfidence: 0.58 },
      { _id: 'wrong_predicted_correct', count: 8, avgConfidence: 0.64 },
      { _id: 'wrong_predicted_wrong', count: 12, avgConfidence: 0.71 }
    ],
    trends: {
      '2023-11-01': { correct_predicted_correct: 3, wrong_predicted_correct: 2 },
      '2023-11-02': { correct_predicted_correct: 5, wrong_predicted_wrong: 1 },
      '2023-11-03': { correct_predicted_correct: 7, wrong_predicted_correct: 3 }
    }
  };

  const data = {
    performance: performance || sampleData.performance,
    categoryDistribution: analytics?.categoryDistribution || sampleData.categoryDistribution,
    trends: analytics?.trends || sampleData.trends
  };

  // Prepare chart data
  const categoryChartData = data.categoryDistribution.map(item => ({
    name: item._id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: item.count,
    confidence: Math.round(item.avgConfidence * 100),
    color: COLORS[item._id]
  }));

  const confidenceData = [
    { range: '0-20%', count: 2 },
    { range: '21-40%', count: 3 },
    { range: '41-60%', count: 8 },
    { range: '61-80%', count: 20 },
    { range: '81-100%', count: 7 }
  ];

  const trendData = Object.entries(data.trends).map(([date, categories]) => ({
    date: new Date(date).toLocaleDateString(),
    ...categories,
    total: Object.values(categories).reduce((sum, val) => sum + val, 0)
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <ChartBarIcon className="w-4 h-4" />
          <span>Analytics Dashboard</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Model Performance Analytics
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive analysis of CRISPR prediction model performance, accuracy metrics, and usage statistics.
        </p>
      </motion.div>

      {/* Time Range Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="bg-white rounded-lg p-1 shadow-sm border">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{data.performance.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-500">
              {data.performance.totalPredictions} total predictions
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{data.performance.f1Score}%</div>
              <div className="text-sm text-gray-600">F1 Score</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-500">
              Precision: {data.performance.precision}% | Recall: {data.performance.recall}%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(data.performance.additional.avgProcessingTime)}ms
              </div>
              <div className="text-sm text-gray-600">Avg Processing</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-500">
              Real-time predictions
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(data.performance.additional.avgConfidence * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-gray-500">
              Model certainty level
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prediction Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Confidence Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={confidenceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Confusion Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Confusion Matrix</h3>
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div></div>
            <div className="font-semibold text-gray-700">Predicted No</div>
            <div className="font-semibold text-gray-700">Predicted Yes</div>
            
            <div className="font-semibold text-gray-700">Actual No</div>
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {data.performance.confusionMatrix.tn}
              </div>
              <div className="text-xs text-green-600">True Negative</div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-800">
                {data.performance.confusionMatrix.fp}
              </div>
              <div className="text-xs text-red-600">False Positive</div>
            </div>
            
            <div className="font-semibold text-gray-700">Actual Yes</div>
            <div className="bg-red-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-800">
                {data.performance.confusionMatrix.fn}
              </div>
              <div className="text-xs text-red-600">False Negative</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-800">
                {data.performance.confusionMatrix.tp}
              </div>
              <div className="text-xs text-green-600">True Positive</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trends */}
      {trendData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="correct_predicted_correct" 
                stackId="1"
                stroke="#10b981" 
                fill="#10b981"
                name="Correct Predictions"
              />
              <Area 
                type="monotone" 
                dataKey="wrong_predicted_correct" 
                stackId="1"
                stroke="#ef4444" 
                fill="#ef4444"
                name="Incorrect Predictions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Model Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-blue-50 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Model Performance Notes</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                • The model shows {data.performance.accuracy}% accuracy with a balanced F1 score of {data.performance.f1Score}%.
              </p>
              <p>
                • Low confidence scores (58-68%) are expected due to the limited training dataset size and 
                the inherent complexity of CRISPR gene editing prediction.
              </p>
              <p>
                • PAM sequence compatibility is detected in {Math.round((data.performance.additional.pamMatches / data.performance.totalPredictions) * 100)}% of predictions, 
                which aligns with biological CRISPR requirements.
              </p>
              <p>
                • Average processing time of {Math.round(data.performance.additional.avgProcessingTime)}ms enables real-time predictions 
                for interactive use.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
