import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  BeakerIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const PredictionResult = ({ prediction }) => {
  const {
    sgRNA,
    DNA,
    prediction: predictionData,
    metrics,
    prediction_source,
    model_prediction,
    model_confidence,
    pam_prediction
  } = prediction;

  const isSuccess = predictionData.label === 1;
  const confidence = predictionData.confidence;
  const category = predictionData.category;
  
  // Determine prediction source
  const isPamBased = prediction_source === 'PAM_rule';
  const isModelBased = prediction_source === 'AI_model';

  // Category information
  const categoryInfo = {
    'correct_predicted_correct': {
      name: 'True Positive',
      description: 'Correctly predicted as successful',
      color: 'green',
      icon: CheckCircleIcon
    },
    'correct_predicted_wrong': {
      name: 'False Negative',
      description: 'Incorrectly predicted as unsuccessful',
      color: 'yellow',
      icon: ExclamationTriangleIcon
    },
    'wrong_predicted_correct': {
      name: 'False Positive',
      description: 'Incorrectly predicted as successful',
      color: 'red',
      icon: XCircleIcon
    },
    'wrong_predicted_wrong': {
      name: 'True Negative',
      description: 'Correctly predicted as unsuccessful',
      color: 'gray',
      icon: CheckCircleIcon
    }
  };

  const categoryData = categoryInfo[category] || {
    name: 'Unknown',
    description: 'Unknown category',
    color: 'gray',
    icon: InformationCircleIcon
  };

  const CategoryIcon = categoryData.icon;

  // Confidence level
  const getConfidenceLevel = (conf) => {
    if (conf >= 80) return { level: 'High', color: 'green' };
    if (conf >= 60) return { level: 'Medium', color: 'yellow' };
    return { level: 'Low', color: 'red' };
  };

  const confidenceLevel = getConfidenceLevel(confidence);

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
          isSuccess ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500'
        } flex items-center justify-center`}>
          <BeakerIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Prediction Result</h2>
          <p className="text-gray-600">CRISPR gene editing success analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Result */}
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border-2 ${
            isSuccess 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-center space-x-3 mb-2">
              {isSuccess ? (
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-red-600" />
              )}
              <span className={`text-lg font-semibold ${
                isSuccess ? 'text-green-800' : 'text-red-800'
              }`}>
                {isSuccess ? 'Successful Editing' : 'No Editing Expected'}
              </span>
            </div>
            <p className={`text-sm ${
              isSuccess ? 'text-green-700' : 'text-red-700'
            }`}>
              {isSuccess 
                ? 'The model predicts successful CRISPR gene editing'
                : 'The model predicts no successful gene editing will occur'
              }
            </p>
          </div>

          {/* Confidence */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Confidence Score</span>
              <span className={`text-lg font-bold ${
                confidenceLevel.color === 'green' ? 'text-green-600' :
                confidenceLevel.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2 rounded-full ${
                  confidenceLevel.color === 'green' ? 'bg-green-500' :
                  confidenceLevel.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
            </div>
            <span className={`text-xs font-medium ${
              confidenceLevel.color === 'green' ? 'text-green-600' :
              confidenceLevel.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {confidenceLevel.level} Confidence
            </span>
          </div>

          {/* Category */}
          <div className={`p-4 rounded-lg border category-${category}`}>
            <div className="flex items-center space-x-3 mb-2">
              <CategoryIcon className="w-5 h-5" />
              <span className="font-semibold">{categoryData.name}</span>
            </div>
            <p className="text-sm opacity-90 mb-2">{categoryData.description}</p>
            {prediction.categorization_info?.category_explanation && (
              <div className="text-xs bg-white bg-opacity-50 p-2 rounded border">
                <strong>Why this category?</strong><br />
                {prediction.categorization_info.category_explanation}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Sequences */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Input Sequences</h3>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">Guide RNA (sgRNA)</div>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  {sgRNA.split('').map((base, i) => (
                    <span key={i} className={`nucleotide nucleotide-${base}`}>
                      {base}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Target DNA</div>
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  {DNA.split('').map((base, i) => (
                    <span key={i} className={`nucleotide nucleotide-${base}`}>
                      {base}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Analysis Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">PAM Match</div>
                <div className={`font-semibold ${
                  predictionData.pamMatch ? 'text-green-600' : 'text-red-600'
                }`}>
                  {predictionData.pamMatch ? 'Yes' : 'No'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Total Matches</div>
                <div className="font-semibold text-gray-900">
                  {metrics.totalMatches}/529
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Processing Time</div>
                <div className="font-semibold text-gray-900 flex items-center space-x-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{metrics.processingTime}ms</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Model Version</div>
                <div className="font-semibold text-gray-900">ViT-CRISPR v1.0</div>
              </div>
            </div>
          </div>

          {/* Prediction Source */}
          <div className="p-4 rounded-lg bg-green-50">
            <div className="flex items-center space-x-2 mb-2">
              <BeakerIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Biological Analysis
              </span>
            </div>
            <div className="text-sm text-green-700">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-semibold">
                  🧬 PAM-Based Ground Truth
                </span>
                {model_confidence !== undefined && (
                  <span className="text-xs bg-white px-2 py-1 rounded">
                    AI model confidence: {Math.round(model_confidence * 100)}%
                  </span>
                )}
              </div>
              <p className="text-xs mb-2">
                Prediction based on biological PAM sequence rules for maximum accuracy
              </p>
              
              <div className="bg-white bg-opacity-50 p-2 rounded border">
                <div className="text-xs">
                  <strong>PAM Analysis:</strong> {pam_prediction === 1 ? '✅ Success' : '❌ No cut'}<br/>
                  <strong>AI Model Says:</strong> {model_prediction === 1 ? '✅ Success' : '❌ No cut'}<br/>
                  <strong>Agreement:</strong> {model_prediction === pam_prediction ? '✅ AI agrees with biology' : '❌ AI disagrees with biology'}
                </div>
              </div>
              
              {model_prediction !== pam_prediction && (
                <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
                  <strong>⚠️ Note:</strong> AI model disagrees with biological rules. 
                  PAM sequence analysis takes precedence for accuracy.
                </div>
              )}
            </div>
          </div>

          {/* PAM Analysis */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <InformationCircleIcon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">PAM Sequence Analysis</span>
            </div>
            <div className="text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">sgRNA PAM:</span>
                  <span className="font-mono ml-2">...{sgRNA.slice(-3)}</span>
                </div>
                <div>
                  <span className="text-gray-600">DNA PAM:</span>
                  <span className="font-mono ml-2">...{DNA.slice(-3)}</span>
                </div>
              </div>
              <p className="mt-2 text-xs">
                CRISPR Cas9 requires NGG PAM sequence for successful cutting. 
                Both sequences should end with GG.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Explanation */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-1">About Confidence Scores</h4>
            <p className="text-sm text-yellow-700">
              Confidence scores indicate how certain the model is about its prediction. 
              Lower scores suggest the sequences are in a gray area where the model is less certain. 
              This often occurs with sequences that have intermediate compatibility or 
              when the training data had similar borderline cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
