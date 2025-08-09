const express = require('express');
const Prediction = require('../models/Prediction');

const router = express.Router();

// Get overall analytics summary
router.get('/summary', async (req, res) => {
  try {
    const timeRange = req.query.range || '7d';
    
    // Get performance metrics
    const performance = await Prediction.getPerformanceMetrics(timeRange);
    
    // Get category distribution
    const categoryData = await Prediction.getAnalytics(timeRange);
    
    // Get prediction trends over time
    const trendPipeline = [
      {
        $match: {
          createdAt: { $gte: getDateFromRange(timeRange) }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            category: "$category"
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ];
    
    const trends = await Prediction.aggregate(trendPipeline);
    
    // Get confidence distribution
    const confidenceDistribution = await Prediction.aggregate([
      {
        $match: {
          createdAt: { $gte: getDateFromRange(timeRange) }
        }
      },
      {
        $bucket: {
          groupBy: "$confidence",
          boundaries: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
          default: "Other",
          output: {
            count: { $sum: 1 },
            avgConfidence: { $avg: "$confidence" }
          }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        performance,
        categoryDistribution: categoryData,
        trends: formatTrendData(trends),
        confidenceDistribution,
        timeRange
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// Get detailed performance metrics
router.get('/performance', async (req, res) => {
  try {
    const timeRange = req.query.range || '7d';
    const performance = await Prediction.getPerformanceMetrics(timeRange);
    
    // Additional metrics
    const additionalMetrics = await Prediction.aggregate([
      {
        $match: {
          createdAt: { $gte: getDateFromRange(timeRange) }
        }
      },
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: "$confidence" },
          avgProcessingTime: { $avg: "$processingTime" },
          minConfidence: { $min: "$confidence" },
          maxConfidence: { $max: "$confidence" },
          totalPredictions: { $sum: 1 },
          textInputs: {
            $sum: { $cond: [{ $eq: ["$inputType", "text"] }, 1, 0] }
          },
          imageInputs: {
            $sum: { $cond: [{ $eq: ["$inputType", "image"] }, 1, 0] }
          },
          pamMatches: {
            $sum: { $cond: ["$pamMatch", 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...performance,
        additional: additionalMetrics[0] || {},
        timeRange
      }
    });

  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch performance metrics'
    });
  }
});

// Get category breakdown with detailed statistics
router.get('/categories', async (req, res) => {
  try {
    const timeRange = req.query.range || '7d';
    
    const categoryBreakdown = await Prediction.aggregate([
      {
        $match: {
          createdAt: { $gte: getDateFromRange(timeRange) }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$confidence" },
          avgProcessingTime: { $avg: "$processingTime" },
          avgTotalMatches: { $avg: "$totalMatches" },
          minConfidence: { $min: "$confidence" },
          maxConfidence: { $max: "$confidence" },
          pamMatchCount: {
            $sum: { $cond: ["$pamMatch", 1, 0] }
          }
        }
      },
      {
        $addFields: {
          pamMatchRate: {
            $multiply: [
              { $divide: ["$pamMatchCount", "$count"] },
              100
            ]
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories: categoryBreakdown,
        timeRange
      }
    });

  } catch (error) {
    console.error('Category breakdown error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category breakdown'
    });
  }
});

// Get prediction trends over time
router.get('/trends', async (req, res) => {
  try {
    const timeRange = req.query.range || '7d';
    const groupBy = req.query.groupBy || 'day'; // day, hour, week
    
    let dateFormat;
    switch(groupBy) {
      case 'hour':
        dateFormat = "%Y-%m-%d %H:00";
        break;
      case 'week':
        dateFormat = "%Y-W%U";
        break;
      default:
        dateFormat = "%Y-%m-%d";
    }
    
    const trends = await Prediction.aggregate([
      {
        $match: {
          createdAt: { $gte: getDateFromRange(timeRange) }
        }
      },
      {
        $group: {
          _id: {
            period: { $dateToString: { format: dateFormat, date: "$createdAt" } },
            category: "$category"
          },
          count: { $sum: 1 },
          avgConfidence: { $avg: "$confidence" }
        }
      },
      {
        $group: {
          _id: "$_id.period",
          categories: {
            $push: {
              category: "$_id.category",
              count: "$count",
              avgConfidence: "$avgConfidence"
            }
          },
          totalCount: { $sum: "$count" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        trends,
        timeRange,
        groupBy
      }
    });

  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trend data'
    });
  }
});

// Helper function to get date from time range
function getDateFromRange(range) {
  const date = new Date();
  
  switch(range) {
    case '24h':
      date.setHours(date.getHours() - 24);
      break;
    case '7d':
      date.setDate(date.getDate() - 7);
      break;
    case '30d':
      date.setDate(date.getDate() - 30);
      break;
    case '90d':
      date.setDate(date.getDate() - 90);
      break;
    default:
      date.setDate(date.getDate() - 7);
  }
  
  return date;
}

// Helper function to format trend data for frontend
function formatTrendData(trends) {
  const formatted = {};
  
  trends.forEach(item => {
    const date = item._id.date;
    const category = item._id.category;
    
    if (!formatted[date]) {
      formatted[date] = {};
    }
    
    formatted[date][category] = item.count;
  });
  
  return formatted;
}

module.exports = router;
