import React from 'react';
import { motion } from 'framer-motion';
import {
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SequenceInput = ({ sequences, setSequences, validationErrors }) => {
  const formatSequence = (sequence) => {
    return sequence.toUpperCase().replace(/[^ATCG]/g, '');
  };

  const handleSequenceChange = (field, value) => {
    const formatted = formatSequence(value);
    if (formatted.length <= 23) {
      setSequences(prev => ({ ...prev, [field]: formatted }));
    }
  };

  const renderSequence = (sequence) => {
    if (!sequence) return null;
    
    return sequence.split('').map((nucleotide, index) => (
      <span
        key={index}
        className={`nucleotide nucleotide-${nucleotide} inline-block`}
      >
        {nucleotide}
      </span>
    ));
  };

  const calculateGCContent = (sequence) => {
    if (!sequence) return 0;
    const gcCount = (sequence.match(/[GC]/g) || []).length;
    return Math.round((gcCount / sequence.length) * 100);
  };

  const checkPAMSequence = (sequence) => {
    if (sequence.length < 3) return null;
    const pam = sequence.slice(-3);
    const isValid = pam.slice(-2) === 'GG';
    return { pam, isValid };
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Sequence Input</h2>
      
      <div className="space-y-6">
        {/* sgRNA Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guide RNA (sgRNA) - 23 nucleotides
          </label>
          <div className="relative">
            <input
              type="text"
              value={sequences.sgRNA}
              onChange={(e) => handleSequenceChange('sgRNA', e.target.value)}
              placeholder="Enter sgRNA sequence (A, T, C, G only)"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                validationErrors.sgRNA ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={23}
            />
            <div className="absolute right-3 top-2 text-xs text-gray-500">
              {sequences.sgRNA.length}/23
            </div>
          </div>
          
          {validationErrors.sgRNA && (
            <div className="mt-1 flex items-center space-x-1 text-red-600 text-sm">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span>{validationErrors.sgRNA}</span>
            </div>
          )}
          
          {sequences.sgRNA && (
            <div className="mt-3">
              <div className="sequence-display">
                {renderSequence(sequences.sgRNA)}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">GC Content: </span>
                  <span className="font-medium">{calculateGCContent(sequences.sgRNA)}%</span>
                </div>
                {sequences.sgRNA.length >= 3 && (
                  <div>
                    <span className="text-gray-600">PAM: </span>
                    <span className={`font-mono font-medium ${
                      checkPAMSequence(sequences.sgRNA)?.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ...{checkPAMSequence(sequences.sgRNA)?.pam}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DNA Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target DNA - 23 nucleotides
          </label>
          <div className="relative">
            <input
              type="text"
              value={sequences.DNA}
              onChange={(e) => handleSequenceChange('DNA', e.target.value)}
              placeholder="Enter target DNA sequence (A, T, C, G only)"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
                validationErrors.DNA ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={23}
            />
            <div className="absolute right-3 top-2 text-xs text-gray-500">
              {sequences.DNA.length}/23
            </div>
          </div>
          
          {validationErrors.DNA && (
            <div className="mt-1 flex items-center space-x-1 text-red-600 text-sm">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <span>{validationErrors.DNA}</span>
            </div>
          )}
          
          {sequences.DNA && (
            <div className="mt-3">
              <div className="sequence-display">
                {renderSequence(sequences.DNA)}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">GC Content: </span>
                  <span className="font-medium">{calculateGCContent(sequences.DNA)}%</span>
                </div>
                {sequences.DNA.length >= 3 && (
                  <div>
                    <span className="text-gray-600">PAM: </span>
                    <span className={`font-mono font-medium ${
                      checkPAMSequence(sequences.DNA)?.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ...{checkPAMSequence(sequences.DNA)?.pam}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sequence Comparison */}
        {sequences.sgRNA && sequences.DNA && sequences.sgRNA.length === 23 && sequences.DNA.length === 23 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t pt-4"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-3">Sequence Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-600 mb-1">Exact Matches</div>
                <div className="text-lg font-semibold text-gray-900">
                  {sequences.sgRNA.split('').filter((base, i) => base === sequences.DNA[i]).length}/23
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-600 mb-1">Similarity</div>
                <div className="text-lg font-semibold text-gray-900">
                  {Math.round((sequences.sgRNA.split('').filter((base, i) => base === sequences.DNA[i]).length / 23) * 100)}%
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-gray-600 mb-1">PAM Compatible</div>
                <div className={`text-lg font-semibold ${
                  checkPAMSequence(sequences.sgRNA)?.isValid && checkPAMSequence(sequences.DNA)?.isValid
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {checkPAMSequence(sequences.sgRNA)?.isValid && checkPAMSequence(sequences.DNA)?.isValid ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </motion.div>
        )}


      </div>
    </div>
  );
};

export default SequenceInput;
