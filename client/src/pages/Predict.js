import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  BeakerIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

// Components
import SequenceInput from '../components/SequenceInput';
import PredictionResult from '../components/PredictionResult';
import MatchMatrix from '../components/MatchMatrix';

const Predict = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputType, setInputType] = useState('text'); // 'text' or 'image'
  const [sequences, setSequences] = useState({
    sgRNA: '',
    DNA: '',
    actualLabel: 1
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Sample sequences for quick testing
  // Load prediction details from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const predictionId = urlParams.get('id');
    
    if (predictionId) {
      loadPredictionDetails(predictionId);
    }
  }, [location.search]);

  // Load existing prediction details
  const loadPredictionDetails = async (predictionId) => {
    setLoadingDetails(true);
    try {
      const response = await axios.get(`/api/predictions/${predictionId}`);
      const predictionData = response.data.data;
      
      // Set the sequences from the loaded prediction
      setSequences({
        sgRNA: predictionData.sgRNA,
        DNA: predictionData.DNA,
        actualLabel: predictionData.actualLabel
      });
      
      // Set input type
      setInputType(predictionData.inputType || 'text');
      
      // Transform the prediction data to match the expected format
      const transformedPrediction = {
        sgRNA: predictionData.sgRNA,
        DNA: predictionData.DNA,
        prediction: {
          label: predictionData.predictedLabel,
          confidence: Math.round(predictionData.confidence * 100),
          category: predictionData.category,
          pamMatch: predictionData.pamMatch
        },
        metrics: {
          totalMatches: predictionData.totalMatches,
          processingTime: predictionData.processingTime
        },
        prediction_source: predictionData.prediction_source || 'AI_model',
        model_prediction: predictionData.predictedLabel,
        model_confidence: predictionData.confidence,
        pam_prediction: predictionData.pamMatch ? 1 : 0
      };
      
      setPrediction(transformedPrediction);
      toast.success('Prediction details loaded successfully!');
      
      // Clear the URL parameter to clean up the URL
      navigate('/predict', { replace: true });
      
    } catch (error) {
      console.error('Error loading prediction details:', error);
      toast.error('Failed to load prediction details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const sampleSequences = [
    {
      name: "Perfect Match Example",
      sgRNA: "ATCGATCGATCGATCGATCAGGG",
      DNA: "ATCGATCGATCGATCGATCAGGG",
      actualLabel: 1
    },
    {
      name: "PAM Mismatch Example", 
      sgRNA: "ATCGATCGATCGATCGATCAGGG",
      DNA: "ATCGATCGATCGATCGATCTGGA",
      actualLabel: 0
    },
    {
      name: "Real Data Sample",
      sgRNA: "GTCACCTCCAATGACTAGGGAGG",
      DNA: "GTCTCCTCCACTGGATTGTGAGG",
      actualLabel: 0
    }
  ];

  // File upload handling
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setInputType('image');
      toast.success('Image uploaded successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  // Validation
  const validateSequences = () => {
    const errors = {};
    
    if (!sequences.sgRNA) {
      errors.sgRNA = 'sgRNA sequence is required';
    } else if (sequences.sgRNA.length !== 23) {
      errors.sgRNA = 'sgRNA must be exactly 23 nucleotides long';
    } else if (!/^[ATCG]+$/i.test(sequences.sgRNA)) {
      errors.sgRNA = 'sgRNA must contain only A, T, C, G nucleotides';
    }

    if (!sequences.DNA) {
      errors.DNA = 'DNA sequence is required';
    } else if (sequences.DNA.length !== 23) {
      errors.DNA = 'DNA must be exactly 23 nucleotides long';
    } else if (!/^[ATCG]+$/i.test(sequences.DNA)) {
      errors.DNA = 'DNA must contain only A, T, C, G nucleotides';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Make prediction
  const handlePredict = async () => {
    if (inputType === 'text' && !validateSequences()) {
      toast.error('Please fix validation errors');
      return;
    }

    if (inputType === 'image' && !uploadedFile) {
      toast.error('Please upload an image');
      return;
    }

    setLoading(true);
    setPrediction(null);

    try {
      let response;
      
      if (inputType === 'text') {
        response = await axios.post('/api/predictions/text', {
          sgRNA: sequences.sgRNA.toUpperCase(),
          DNA: sequences.DNA.toUpperCase(),
          actualLabel: sequences.actualLabel
        });
      } else {
        const formData = new FormData();
        formData.append('image', uploadedFile);
        formData.append('actualLabel', sequences.actualLabel);
        
        response = await axios.post('/api/predictions/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setPrediction(response.data.data);
      toast.success('Prediction completed successfully!');
      
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error(error.response?.data?.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  // Load sample sequence
  const loadSample = (sample) => {
    setSequences(sample);
    setInputType('text');
    setUploadedFile(null);
    setPrediction(null);
    setValidationErrors({});
    toast.success(`Loaded: ${sample.name}`);
  };

  // Reset form
  const resetForm = () => {
    setSequences({ sgRNA: '', DNA: '', actualLabel: 1 });
    setUploadedFile(null);
    setPrediction(null);
    setValidationErrors({});
    setInputType('text');
  };

  // Show loading indicator while loading prediction details
  if (loadingDetails) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <ArrowPathIcon className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Prediction Details</h2>
          <p className="text-gray-600">Please wait while we load the prediction data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <BeakerIcon className="w-4 h-4" />
          <span>CRISPR Prediction</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Predict Gene Editing Success
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Input your guide RNA and target DNA sequences to predict CRISPR editing success rates
          using our advanced AI model.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Input Method</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setInputType('text')}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all ${
                  inputType === 'text'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <DocumentTextIcon className="w-5 h-5" />
                <span>Text Input</span>
              </button>
              <button
                onClick={() => setInputType('image')}
                className={`flex-1 flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all ${
                  inputType === 'image'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <PhotoIcon className="w-5 h-5" />
                <span>Image Upload</span>
              </button>
            </div>
          </motion.div>

          {/* Text Input */}
          {inputType === 'text' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SequenceInput
                sequences={sequences}
                setSequences={setSequences}
                validationErrors={validationErrors}
              />
            </motion.div>
          )}

          {/* Image Upload */}
          {inputType === 'image' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-card p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Sequence Image</h2>
              
              <div
                {...getRootProps()}
                className={`upload-area ${isDragActive ? 'dragover' : ''}`}
              >
                <input {...getInputProps()} />
                <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop an image'}
                </p>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <p className="text-sm text-gray-400">
                  Supports JPEG, PNG, GIF, BMP (max 5MB)
                </p>
              </div>

              {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">File uploaded:</span>
                    <span className="text-green-700">{uploadedFile.name}</span>
                  </div>
                </div>
              )}


            </motion.div>
          )}

          {/* Prediction Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex space-x-4"
          >
            <button
              onClick={handlePredict}
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Predicting...</span>
                </>
              ) : (
                <>
                  <BeakerIcon className="w-5 h-5" />
                  <span>Predict Success</span>
                </>
              )}
            </button>
            
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sample Sequences */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Sequences</h3>
            <div className="space-y-3">
              {sampleSequences.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => loadSample(sample)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="font-medium text-gray-900 text-sm">{sample.name}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    {sample.sgRNA.slice(0, 10)}...
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">How it works</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Input 23-nucleotide sequences (A, T, C, G)</li>
                  <li>• AI analyzes sequence compatibility</li>
                  <li>• PAM sequence validation</li>
                  <li>• Confidence score provided</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Processing Time */}
          {prediction && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-50 rounded-xl p-6"
            >
              <div className="flex items-start space-x-3">
                <ClockIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900 mb-2">Performance</h3>
                  <div className="text-sm text-green-800">
                    Processing time: {prediction.metrics?.processingTime}ms
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Prediction Results */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PredictionResult prediction={prediction} />
        </motion.div>
      )}

      {/* Match Matrix Visualization */}
      {prediction && inputType === 'text' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MatchMatrix 
            sgRNA={prediction.sgRNA}
            DNA={prediction.DNA}
            matrix={prediction.match_matrix || generateMatrix(prediction.sgRNA, prediction.DNA)}
          />
        </motion.div>
      )}
    </div>
  );
};

// Helper function to generate matrix if not provided
const generateMatrix = (sgRNA, DNA) => {
  const matrix = [];
  for (let i = 0; i < 23; i++) {
    matrix[i] = [];
    for (let j = 0; j < 23; j++) {
      matrix[i][j] = sgRNA[i] === DNA[j] ? 1 : 0;
    }
  }
  return matrix;
};

export default Predict;
