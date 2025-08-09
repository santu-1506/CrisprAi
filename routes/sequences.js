const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Get sample sequences from the dataset
router.get('/samples', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Read the I2.txt file to get sample sequences
    const filePath = path.join(__dirname, '..', 'I2.txt');
    const fileContent = await fs.readFile(filePath, 'utf8');
    
    const lines = fileContent.trim().split('\n');
    const sequences = [];
    
    for (let i = 0; i < Math.min(lines.length, limit); i++) {
      const [sgRNA, DNA, label] = lines[i].split(',');
      
      if (sgRNA && DNA && label !== undefined) {
        sequences.push({
          id: i + 1,
          sgRNA: sgRNA.trim(),
          DNA: DNA.trim(),
          actualLabel: parseInt(label.trim()),
          description: `Sample sequence pair ${i + 1}`
        });
      }
    }

    res.json({
      success: true,
      data: sequences,
      total: sequences.length
    });

  } catch (error) {
    console.error('Error reading sequences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sample sequences'
    });
  }
});

// Validate sequence format
router.post('/validate', async (req, res) => {
  try {
    const { sgRNA, DNA } = req.body;
    
    const errors = [];
    
    // Validate sgRNA
    if (!sgRNA) {
      errors.push('sgRNA is required');
    } else if (sgRNA.length !== 23) {
      errors.push('sgRNA must be exactly 23 nucleotides long');
    } else if (!/^[ATCG]+$/i.test(sgRNA)) {
      errors.push('sgRNA must contain only A, T, C, G nucleotides');
    }
    
    // Validate DNA
    if (!DNA) {
      errors.push('DNA sequence is required');
    } else if (DNA.length !== 23) {
      errors.push('DNA sequence must be exactly 23 nucleotides long');
    } else if (!/^[ATCG]+$/i.test(DNA)) {
      errors.push('DNA sequence must contain only A, T, C, G nucleotides');
    }
    
    const isValid = errors.length === 0;
    
    let analysis = {};
    if (isValid) {
      // Perform sequence analysis
      analysis = {
        sgRNA: {
          sequence: sgRNA.toUpperCase(),
          length: sgRNA.length,
          gcContent: calculateGCContent(sgRNA),
          pamSequence: sgRNA.slice(-3),
          hasPAM: sgRNA.slice(-2).toUpperCase() === 'GG'
        },
        DNA: {
          sequence: DNA.toUpperCase(),
          length: DNA.length,
          gcContent: calculateGCContent(DNA),
          pamSequence: DNA.slice(-3),
          hasPAM: DNA.slice(-2).toUpperCase() === 'GG'
        },
        compatibility: {
          exactMatches: countExactMatches(sgRNA, DNA),
          similarityScore: calculateSimilarity(sgRNA, DNA),
          pamCompatible: sgRNA.slice(-2).toUpperCase() === 'GG' && DNA.slice(-2).toUpperCase() === 'GG'
        }
      };
    }

    res.json({
      success: true,
      data: {
        isValid,
        errors,
        analysis
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate sequences'
    });
  }
});

// Generate random sequences for testing
router.get('/random', async (req, res) => {
  try {
    const count = Math.min(parseInt(req.query.count) || 1, 10);
    const sequences = [];
    
    for (let i = 0; i < count; i++) {
      const sgRNA = generateRandomSequence(23);
      const DNA = generateRandomSequence(23);
      
      sequences.push({
        id: `random_${i + 1}`,
        sgRNA,
        DNA,
        actualLabel: Math.random() > 0.5 ? 1 : 0, // Random label for testing
        description: `Randomly generated sequence pair ${i + 1}`,
        gcContent: {
          sgRNA: calculateGCContent(sgRNA),
          DNA: calculateGCContent(DNA)
        },
        pamSequence: {
          sgRNA: sgRNA.slice(-3),
          DNA: DNA.slice(-3)
        }
      });
    }

    res.json({
      success: true,
      data: sequences
    });

  } catch (error) {
    console.error('Random sequence generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate random sequences'
    });
  }
});

// Helper functions
function calculateGCContent(sequence) {
  const gcCount = (sequence.match(/[GC]/gi) || []).length;
  return Math.round((gcCount / sequence.length) * 100);
}

function countExactMatches(seq1, seq2) {
  let matches = 0;
  for (let i = 0; i < Math.min(seq1.length, seq2.length); i++) {
    if (seq1[i].toUpperCase() === seq2[i].toUpperCase()) {
      matches++;
    }
  }
  return matches;
}

function calculateSimilarity(seq1, seq2) {
  const matches = countExactMatches(seq1, seq2);
  return Math.round((matches / Math.max(seq1.length, seq2.length)) * 100);
}

function generateRandomSequence(length) {
  const nucleotides = ['A', 'T', 'C', 'G'];
  let sequence = '';
  
  for (let i = 0; i < length; i++) {
    sequence += nucleotides[Math.floor(Math.random() * nucleotides.length)];
  }
  
  // Ensure PAM sequence (GG at the end) for more realistic CRISPR sequences
  if (Math.random() > 0.5) {
    sequence = sequence.slice(0, -2) + 'GG';
  }
  
  return sequence;
}

module.exports = router;
