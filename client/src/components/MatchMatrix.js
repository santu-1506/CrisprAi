import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const MatchMatrix = ({ sgRNA, DNA, matrix }) => {
  const [showMatrix, setShowMatrix] = useState(true);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const totalMatches = matrix.reduce((sum, row) => 
    sum + row.reduce((rowSum, cell) => rowSum + cell, 0), 0
  );

  const maxPossibleMatches = 23 * 23;
  const matchPercentage = Math.round((totalMatches / maxPossibleMatches) * 100);

  const handleCellHover = (i, j) => {
    setHoveredCell({ i, j, sgRNA: sgRNA[i], DNA: DNA[j], match: matrix[i][j] });
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <MagnifyingGlassIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sequence Match Matrix</h2>
            <p className="text-gray-600">Visual representation of base-pair compatibility</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Zoom:</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
          </div>
          
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {showMatrix ? (
              <>
                <EyeSlashIcon className="w-4 h-4" />
                <span className="text-sm">Hide Matrix</span>
              </>
            ) : (
              <>
                <EyeIcon className="w-4 h-4" />
                <span className="text-sm">Show Matrix</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">Total Matches</div>
          <div className="text-2xl font-bold text-blue-900">{totalMatches}</div>
          <div className="text-xs text-blue-600">out of {maxPossibleMatches}</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-green-600 mb-1">Match Percentage</div>
          <div className="text-2xl font-bold text-green-900">{matchPercentage}%</div>
          <div className="text-xs text-green-600">overall compatibility</div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-purple-600 mb-1">Sequence Length</div>
          <div className="text-2xl font-bold text-purple-900">23</div>
          <div className="text-xs text-purple-600">nucleotides each</div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm text-orange-600 mb-1">Matrix Size</div>
          <div className="text-2xl font-bold text-orange-900">23×23</div>
          <div className="text-xs text-orange-600">comparison grid</div>
        </div>
      </div>

      {showMatrix && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {/* Legend */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Match (1)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 border rounded"></div>
                <span className="text-sm text-gray-600">No Match (0)</span>
              </div>
            </div>
            
            {hoveredCell && (
              <div className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm">
                sgRNA[{hoveredCell.i}]: {hoveredCell.sgRNA} vs DNA[{hoveredCell.j}]: {hoveredCell.DNA} = {hoveredCell.match ? 'Match' : 'No Match'}
              </div>
            )}
          </div>

          {/* Matrix Container */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-auto">
            <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
              {/* Column Headers (DNA sequence) */}
              <div className="flex mb-2">
                <div className="w-8 h-8"></div> {/* Empty corner */}
                {DNA.split('').map((base, j) => (
                  <div
                    key={j}
                    className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold nucleotide nucleotide-${base} mr-px`}
                    title={`DNA[${j}]: ${base}`}
                  >
                    {base}
                  </div>
                ))}
              </div>

              {/* Matrix Rows */}
              {matrix.map((row, i) => (
                <div key={i} className="flex mb-px">
                  {/* Row Header (sgRNA sequence) */}
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold nucleotide nucleotide-${sgRNA[i]} mr-2`}
                    title={`sgRNA[${i}]: ${sgRNA[i]}`}
                  >
                    {sgRNA[i]}
                  </div>
                  
                  {/* Matrix Cells */}
                  {row.map((cell, j) => (
                    <motion.div
                      key={j}
                      className={`matrix-cell mr-px cursor-pointer ${
                        cell ? 'match' : 'no-match'
                      }`}
                      onMouseEnter={() => handleCellHover(i, j)}
                      onMouseLeave={handleCellLeave}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      title={`sgRNA[${i}]:${sgRNA[i]} vs DNA[${j}]:${DNA[j]} = ${cell ? 'Match' : 'No Match'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Position Analysis */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Position Analysis</h3>
              <div className="space-y-2">
                {[0, 5, 10, 15, 20, 22].map(pos => {
                  const matches = matrix[pos] ? matrix[pos].reduce((sum, cell) => sum + cell, 0) : 0;
                  return (
                    <div key={pos} className="flex justify-between text-sm">
                      <span className="text-gray-600">Position {pos + 1}:</span>
                      <span className="font-medium">{matches} matches</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pattern Detection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Pattern Detection</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Diagonal matches:</span>
                  <span className="font-medium">
                    {matrix.reduce((sum, row, i) => sum + (row[i] || 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Perfect matches:</span>
                  <span className="font-medium">
                    {sgRNA.split('').filter((base, i) => base === DNA[i]).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Similarity score:</span>
                  <span className="font-medium">
                    {Math.round((sgRNA.split('').filter((base, i) => base === DNA[i]).length / 23) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 mb-1">Matrix Interpretation</h4>
                <p className="text-sm text-blue-700">
                  This matrix shows where each nucleotide in the sgRNA sequence matches with nucleotides 
                  in the DNA sequence. Blue cells indicate matches, while gray cells indicate mismatches. 
                  The diagonal represents position-specific matches, which are most important for CRISPR efficiency.
                  High match density suggests better compatibility between the guide RNA and target DNA.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MatchMatrix;
