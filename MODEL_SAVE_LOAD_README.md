# CRISPR Model Save/Load Guide

This guide explains how to save your trained CRISPR model and load it later without retraining.

## 🎯 Quick Start

### 1. Train and Save Model (One-time setup)
```bash
python train_and_save_model.py
```

### 2. Use Saved Model (Every time after)
```bash
python use_saved_model.py
```

## 📁 Files Overview

- **`train_and_save_model.py`** - Trains the model and saves it to `crispr_model.h5`
- **`use_saved_model.py`** - Loads the saved model and makes predictions
- **`batch_predict.py`** - Loads the saved model and processes multiple sequences
- **`model_api.py`** - Updated with improved save/load functions

## 🔧 How It Works

### Before (Had to retrain every time):
```python
# Train model every time
model = ViTClassifier()
model.compile(...)
model.fit(X_train, y_train, epochs=30)
predictions = model.predict(X_test)
```

### After (Load saved model):
```python
# Load saved model (no training needed)
from tensorflow.keras.models import load_model
model = load_model("crispr_model.h5", custom_objects={
    'ViTClassifier': ViTClassifier,
    'PatchEmbedding': PatchEmbedding
})
predictions = model.predict(X_test)
```

## 📋 Usage Examples

### Example 1: Simple Usage
```python
from use_saved_model import load_model, predict_crispr

# Load the model
model = load_model()

# Make prediction
result = predict_crispr(model, "ATCGATCGATCGATCGATCGATC", "ATCGATCGATCGATCGATCGATC")
print(f"Prediction: {result['interpretation']}")
```

### Example 2: Batch Processing
```python
from batch_predict import load_model, predict_batch

# Load the model
model = load_model()

# Define sequences
sequences = [
    {'sgRNA': 'ATCGATCGATCGATCGATCGATC', 'DNA': 'ATCGATCGATCGATCGATCGATC'},
    {'sgRNA': 'GCTAGCTAGCTAGCTAGCTAGCT', 'DNA': 'GCTAGCTAGCTAGCTAGCTAGCT'},
]

# Make predictions
results = predict_batch(model, sequences)
for result in results:
    print(f"{result['sgRNA']} vs {result['DNA']} -> {result['interpretation']}")
```

### Example 3: Load from CSV
Create a file `test_sequences.csv`:
```csv
sgRNA,DNA
ATCGATCGATCGATCGATCGATC,ATCGATCGATCGATCGATCGATC
GCTAGCTAGCTAGCTAGCTAGCT,GCTAGCTAGCTAGCTAGCTAGCT
```

Then run:
```bash
python batch_predict.py
```

## 🚀 Workflow

### First Time Setup:
1. **Train the model**: `python train_and_save_model.py`
   - This will train the model and save it as `crispr_model.h5`
   - Takes time (30 epochs of training)

### Every Time After:
1. **Load and use**: `python use_saved_model.py`
   - This loads the saved model instantly
   - No training time needed

## 📊 Model Information

The saved model contains:
- ✅ Complete model architecture
- ✅ Trained weights
- ✅ Optimizer state
- ✅ Model configuration

File size: ~1-2 MB (depending on model complexity)

## 🔍 Troubleshooting

### "No model found" error:
- Run `python train_and_save_model.py` first
- Check that `crispr_model.h5` exists in the current directory

### "Failed to load model" error:
- Make sure you have the same TensorFlow version
- Check that custom objects (ViTClassifier, PatchEmbedding) are available

### Memory issues:
- The model loads into memory, so ensure you have enough RAM
- Close other applications if needed

## 📈 Performance

- **Training time**: ~5-10 minutes (one-time)
- **Loading time**: ~1-2 seconds
- **Prediction time**: ~0.1 seconds per sequence

## 🎯 Benefits

1. **Time saving**: No need to retrain every time
2. **Consistency**: Same model used across sessions
3. **Portability**: Share the model file with others
4. **Production ready**: Load model in production without training code

## 🔄 Updating the Model

To retrain and update the saved model:
```bash
python train_and_save_model.py
```

This will overwrite the existing `crispr_model.h5` file with the newly trained model.

## 📝 API Integration

The Flask API in `model_api.py` automatically uses the saved model:
- On startup, it tries to load `crispr_model.h5`
- If not found, it trains a new model and saves it
- All predictions use the loaded model

## 🎉 Success!

You now have a complete save/load system for your CRISPR model. Train once, use many times! 