# CRISPR Gene Editing Success Prediction Platform

A comprehensive MERN stack application that predicts CRISPR gene editing success rates using advanced Vision Transformer (ViT) machine learning models.

## 🧬 Overview

This platform combines cutting-edge AI technology with biological expertise to provide accurate CRISPR-Cas9 gene editing predictions. It features a modern web interface, real-time analytics, and support for both text and image-based sequence inputs.

## ✨ Features

### 🔬 Core Functionality

- **AI-Powered Predictions**: Vision Transformer model analyzes sequence compatibility
- **Multiple Input Types**: Support for text sequences and image recognition
- **Real-time Processing**: Predictions completed in <200ms
- **PAM Sequence Validation**: Biological accuracy with NGG pattern checking

### 📊 Analytics Dashboard

- **Performance Metrics**: Accuracy, precision, recall, F1 score
- **Confusion Matrix**: Detailed prediction categorization
- **Confidence Distribution**: Visual confidence score analysis
- **Trend Analysis**: Historical prediction patterns

### 🎨 User Experience

- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Responsive Design**: Works seamlessly across all devices
- **Interactive Visualizations**: Sequence match matrices and charts
- **Real-time Feedback**: Live validation and error handling

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File upload handling

### AI/ML

- **TensorFlow** - Deep learning framework
- **Python Flask** - Model serving API
- **Vision Transformer** - Core ML architecture
- **NumPy & Pandas** - Data processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crispr-prediction-platform
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**

   ```bash
   # Create .env file in root directory
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/crispr_prediction
   MODEL_API_URL=http://localhost:5001
   ```

6. **Start the services**

   **Terminal 1 - MongoDB** (if running locally):

   ```bash
   mongod
   ```

   **Terminal 2 - Python Model API**:

   ```bash
   python model_api.py
   ```

   **Terminal 3 - Backend Server**:

   ```bash
   npm run dev
   ```

   **Terminal 4 - Frontend**:

   ```bash
   cd client
   npm start
   ```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Model API**: http://localhost:5001

## 📝 Usage

### Making Predictions

1. **Text Input**:

   - Navigate to the Predict page
   - Enter 23-nucleotide sgRNA sequence
   - Enter 23-nucleotide target DNA sequence
   - Select expected result for validation
   - Click "Predict Success"

2. **Image Input**:
   - Switch to image input mode
   - Upload sequence image (JPEG, PNG, GIF, BMP)
   - Select expected result
   - Click "Predict Success"

### Viewing Analytics

1. Navigate to the Analytics page
2. Select time range (24h, 7d, 30d, 90d)
3. View performance metrics and charts
4. Analyze prediction patterns and trends

### Managing Results

1. Navigate to the Results page
2. Search and filter predictions
3. Sort by date or confidence
4. Export data as CSV

## 🔬 Model Information

### Architecture

- **Type**: Vision Transformer (ViT)
- **Input**: 23×23 sequence match matrices
- **Parameters**: ~135,000 trainable parameters
- **Output**: Binary classification with confidence scores

### Performance Metrics

- **Accuracy**: 68.5%
- **F1 Score**: 68.9%
- **Processing Time**: <200ms average
- **Confidence Range**: 58-68% (due to limited training data)

### Prediction Categories

- **True Positive**: Correctly predicted successful editing
- **True Negative**: Correctly predicted no editing
- **False Positive**: Incorrectly predicted successful editing
- **False Negative**: Incorrectly predicted no editing

## 📊 API Reference

### Backend Endpoints

#### Predictions

```
POST /api/predictions/text
POST /api/predictions/image
GET  /api/predictions/recent
GET  /api/predictions/:id
```

#### Analytics

```
GET /api/analytics/summary
GET /api/analytics/performance
GET /api/analytics/categories
GET /api/analytics/trends
```

#### Sequences

```
GET /api/sequences/samples
POST /api/sequences/validate
GET /api/sequences/random
```

### Model API Endpoints

```
GET  /health
POST /predict
GET  /model/info
POST /model/retrain
```

## 🔧 Configuration

### Environment Variables

```bash
# Server
NODE_ENV=development|production
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/crispr_prediction

# Model API
MODEL_API_URL=http://localhost:5001

# Security
JWT_SECRET=your_jwt_secret

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 🐳 Docker Deployment

### Build and Run

```bash
# Build the application
docker build -t crispr-prediction .

# Run with docker-compose
docker-compose up -d
```

### Production Configuration

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/crispr_prediction

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

## 🧪 Testing

### Run Tests

```bash
# Backend tests
npm test

# Frontend tests
cd client
npm test
```

### Sample Data

The application includes sample CRISPR sequences for testing:

- Perfect match examples
- PAM mismatch cases
- Real experimental data

## 🚨 Known Limitations

1. **Training Data**: Limited to 200 sequence pairs
2. **Confidence Scores**: Range of 58-68% due to dataset size
3. **Image Processing**: Basic implementation, needs enhancement
4. **Biological Complexity**: Simplified model of CRISPR mechanisms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔬 Scientific Background

### CRISPR-Cas9 System

- **Guide RNA (sgRNA)**: 20-nucleotide sequence that guides Cas9 to target
- **PAM Sequence**: NGG motif required for Cas9 cutting
- **Target DNA**: Genomic sequence to be edited
- **Success Factors**: Sequence complementarity, PAM presence, chromatin accessibility

### Prediction Approach

- **Match Matrix**: Compares each sgRNA base against all DNA bases
- **Pattern Recognition**: ViT identifies compatibility patterns
- **Confidence Scoring**: Probabilistic output with uncertainty quantification

## 📞 Support

For questions, issues, or contributions:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

Built with ❤️ for the scientific community
