import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Results = () => {
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPredictions();
  }, []);

  useEffect(() => {
    filterAndSortPredictions();
  }, [predictions, searchTerm, filterCategory, sortBy]);

  const fetchPredictions = async () => {
    try {
      const response = await axios.get('/api/predictions/recent?limit=50');
      setPredictions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      // Use sample data if API is not available
      setPredictions(generateSampleData());
      toast.error('Using sample data - API not available');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPredictions = () => {
    let filtered = [...predictions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(prediction => 
        prediction.sgRNA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prediction.DNA.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(prediction => prediction.category === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'confidence_high':
          return b.confidence - a.confidence;
        case 'confidence_low':
          return a.confidence - b.confidence;
        default:
          return 0;
      }
    });

    setFilteredPredictions(filtered);
  };

  const generateSampleData = () => {
    const categories = [
      'correct_predicted_correct',
      'correct_predicted_wrong', 
      'wrong_predicted_correct',
      'wrong_predicted_wrong'
    ];

    const sampleSequences = [
      { sgRNA: 'ATCGATCGATCGATCGATCAGG', DNA: 'ATCGATCGATCGATCGATCAGG' },
      { sgRNA: 'GTCACCTCCAATGACTAGGGAGG', DNA: 'GTCTCCTCCACTGGATTGTGAGG' },
      { sgRNA: 'CGTACGTACGTACGTACGTACGG', DNA: 'CGTACGTACGTACGTACGTCTGG' },
      { sgRNA: 'TACGTATCGATCGATCGATCAGG', DNA: 'TACGTATCGATCGATCGATCTGG' }
    ];

    return Array.from({ length: 20 }, (_, i) => {
      const seqPair = sampleSequences[i % sampleSequences.length];
      const category = categories[i % categories.length];
      return {
        _id: `sample_${i}`,
        sgRNA: seqPair.sgRNA,
        DNA: seqPair.DNA,
        actualLabel: Math.random() > 0.5 ? 1 : 0,
        predictedLabel: Math.random() > 0.5 ? 1 : 0,
        confidence: Math.random() * 0.4 + 0.5, // 50-90%
        category,
        inputType: i % 5 === 0 ? 'image' : 'text',
        pamMatch: Math.random() > 0.3,
        totalMatches: Math.floor(Math.random() * 200) + 100,
        processingTime: Math.floor(Math.random() * 200) + 100,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  };

  const getCategoryInfo = (category) => {
    const categoryMap = {
      'correct_predicted_correct': {
        name: 'True Positive',
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      },
      'correct_predicted_wrong': {
        name: 'False Negative', 
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200'
      },
      'wrong_predicted_correct': {
        name: 'False Positive',
        color: 'red',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200'
      },
      'wrong_predicted_wrong': {
        name: 'True Negative',
        color: 'gray',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200'
      }
    };
    return categoryMap[category] || categoryMap['wrong_predicted_wrong'];
  };

  const exportResults = () => {
    const csvContent = [
      'ID,sgRNA,DNA,Actual,Predicted,Confidence,Category,PAM Match,Processing Time,Created At',
      ...filteredPredictions.map(p => 
        `${p._id},${p.sgRNA},${p.DNA},${p.actualLabel},${p.predictedLabel},${Math.round(p.confidence * 100)}%,${p.category},${p.pamMatch},${p.processingTime}ms,${p.createdAt}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crispr_predictions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
        <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <DocumentTextIcon className="w-4 h-4" />
          <span>Prediction Results</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Recent Predictions
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse and analyze all CRISPR gene editing predictions made using the system.
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-card p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sequences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="correct_predicted_correct">True Positive</option>
              <option value="correct_predicted_wrong">False Negative</option>
              <option value="wrong_predicted_correct">False Positive</option>
              <option value="wrong_predicted_wrong">True Negative</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="confidence_high">High Confidence</option>
              <option value="confidence_low">Low Confidence</option>
            </select>

            {/* Export */}
            <button
              onClick={exportResults}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Results: </span>
              <span className="font-semibold">{filteredPredictions.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Avg Confidence: </span>
              <span className="font-semibold">
                {filteredPredictions.length > 0 
                  ? Math.round(filteredPredictions.reduce((sum, p) => sum + p.confidence, 0) / filteredPredictions.length * 100) 
                  : 0}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">PAM Matches: </span>
              <span className="font-semibold">
                {filteredPredictions.filter(p => p.pamMatch).length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Success Rate: </span>
              <span className="font-semibold">
                {filteredPredictions.length > 0 
                  ? Math.round(filteredPredictions.filter(p => p.predictedLabel === 1).length / filteredPredictions.length * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {filteredPredictions.length > 0 ? (
          filteredPredictions.map((prediction, index) => {
            const categoryInfo = getCategoryInfo(prediction.category);
            return (
              <motion.div
                key={prediction._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-lg shadow-card border-l-4 ${categoryInfo.borderColor} p-6 hover:shadow-lg transition-shadow`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${categoryInfo.bgColor} ${categoryInfo.textColor}`}>
                    {categoryInfo.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(prediction.createdAt), 'MMM dd, yyyy')}
                  </div>
                </div>

                {/* Sequences */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Guide RNA</div>
                    <div className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                      {prediction.sgRNA}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Target DNA</div>
                    <div className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                      {prediction.DNA}
                    </div>
                  </div>
                </div>

                {/* Prediction Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prediction:</span>
                    <span className={`font-medium ${prediction.predictedLabel === 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {prediction.predictedLabel === 1 ? 'Success' : 'No Edit'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-medium">{Math.round(prediction.confidence * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PAM Match:</span>
                    <span className={`font-medium ${prediction.pamMatch ? 'text-green-600' : 'text-red-600'}`}>
                      {prediction.pamMatch ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing:</span>
                    <span className="font-medium">{prediction.processingTime}ms</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Input: {prediction.inputType}
                  </div>
                  <Link
                    to={`/predict?id=${prediction._id}`}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No predictions have been made yet.'
              }
            </p>
            <Link
              to="/predict"
              className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span>Make a Prediction</span>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Results;
