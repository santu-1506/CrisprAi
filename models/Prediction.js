const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  sgRNA: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[ATCG]{23}$/.test(v);
      },
      message: 'sgRNA must be exactly 23 nucleotides (A, T, C, G only)'
    }
  },
  DNA: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[ATCG]{23}$/.test(v);
      },
      message: 'DNA must be exactly 23 nucleotides (A, T, C, G only)'
    }
  },
  actualLabel: {
    type: Number,
    required: true,
    enum: [0, 1] // 0 = No Edit, 1 = Success
  },
  predictedLabel: {
    type: Number,
    required: true,
    enum: [0, 1]
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  pamMatch: {
    type: Boolean,
    required: true
  },
  totalMatches: {
    type: Number,
    required: true,
    min: 0,
    max: 529 // 23x23 maximum possible matches
  },
  category: {
    type: String,
    required: true,
    enum: [
      'correct_predicted_correct',    // True Positive
      'correct_predicted_wrong',      // False Negative
      'wrong_predicted_correct',      // False Positive
      'wrong_predicted_wrong'         // True Negative
    ]
  },
  inputType: {
    type: String,
    required: true,
    enum: ['text', 'image']
  },
  imageUrl: {
    type: String,
    required: function() {
      return this.inputType === 'image';
    }
  },
  processingTime: {
    type: Number, // milliseconds
    required: true
  },
  userAgent: String,
  ipAddress: String
}, {
  timestamps: true
});

// Indexes for better query performance
predictionSchema.index({ category: 1 });
predictionSchema.index({ createdAt: -1 });
predictionSchema.index({ confidence: -1 });
predictionSchema.index({ pamMatch: 1 });

// Virtual for prediction accuracy
predictionSchema.virtual('isCorrect').get(function() {
  return this.actualLabel === this.predictedLabel;
});

// Static method to get analytics data
predictionSchema.statics.getAnalytics = async function(timeRange = '7d') {
  const startDate = new Date();
  
  switch(timeRange) {
    case '24h':
      startDate.setHours(startDate.getHours() - 24);
      break;
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
  }

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$confidence' },
        avgProcessingTime: { $avg: '$processingTime' }
      }
    }
  ];

  return await this.aggregate(pipeline);
};

// Static method to get performance metrics
predictionSchema.statics.getPerformanceMetrics = async function(timeRange = '7d') {
  const analytics = await this.getAnalytics(timeRange);
  
  let tp = 0, tn = 0, fp = 0, fn = 0;
  
  analytics.forEach(item => {
    switch(item._id) {
      case 'correct_predicted_correct':
        tp = item.count;
        break;
      case 'wrong_predicted_wrong':
        tn = item.count;
        break;
      case 'wrong_predicted_correct':
        fp = item.count;
        break;
      case 'correct_predicted_wrong':
        fn = item.count;
        break;
    }
  });

  const total = tp + tn + fp + fn;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
  const f1Score = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

  return {
    accuracy: Math.round(accuracy * 10000) / 100, // percentage with 2 decimal places
    precision: Math.round(precision * 10000) / 100,
    recall: Math.round(recall * 10000) / 100,
    f1Score: Math.round(f1Score * 10000) / 100,
    confusionMatrix: { tp, tn, fp, fn },
    totalPredictions: total
  };
};

module.exports = mongoose.model('Prediction', predictionSchema);
