#!/usr/bin/env python3
"""
Simple CRISPR Model Save/Load Script
This script saves and loads the model using weights, which is more reliable.
"""

import os
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
import pickle
import logging

# Import the model classes and functions from model_api
from model_api import ViTClassifier, PatchEmbedding, generate_match_matrix, check_pam_sequence

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_training_data():
    """Load and prepare training data"""
    try:
        # Load CRISPR sequence data
        df = pd.read_csv("I2.txt", sep=',', header=None)
        df.columns = ['sgRNA', 'DNA', 'label']
        
        # Keep only valid 23-base sequences
        df = df[(df['sgRNA'].str.len() == 23) & (df['DNA'].str.len() == 23)]
        
        # Generate match matrices for each sequence pair
        df['match_matrix'] = df.apply(lambda row: generate_match_matrix(row['sgRNA'], row['DNA']), axis=1)
        
        # Generate PAM-based labels
        pam_labels = [check_pam_sequence(row['sgRNA'], row['DNA']) for _, row in df.iterrows()]
        df['pam_label'] = pam_labels
        
        logger.info(f"Loaded {len(df)} sequence pairs for training")
        return df
        
    except Exception as e:
        logger.error(f"Failed to load training data: {str(e)}")
        return None

def train_model(training_data):
    """Train the CRISPR prediction model"""
    try:
        # Prepare data for model training
        X = np.stack(training_data['match_matrix'].values)
        X = np.expand_dims(X, axis=-1).astype(np.float32)
        y = np.array(training_data['pam_label'].values).astype(np.int32)
        
        # Create and compile model
        model = ViTClassifier()
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
            metrics=['accuracy']
        )
        
        # Initialize model with dummy data
        dummy_input = tf.zeros((1, 23, 23, 1))
        _ = model(dummy_input)
        
        logger.info(f"Model parameters: {model.count_params():,}")
        
        # Train the model
        history = model.fit(
            X, y,
            batch_size=32,
            epochs=30,
            validation_split=0.2,
            callbacks=[
                keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=5,
                    min_delta=1e-4,
                    restore_best_weights=True,
                    verbose=1
                ),
                keras.callbacks.ReduceLROnPlateau(
                    monitor='val_loss',
                    factor=0.5,
                    patience=3,
                    min_delta=1e-4,
                    verbose=1
                )
            ],
            verbose=1
        )
        
        logger.info(f"Model training completed. Final accuracy: {history.history.get('val_accuracy', [0])[-1]:.4f}")
        return model
        
    except Exception as e:
        logger.error(f"Model training failed: {str(e)}")
        return None

def save_model_simple(model, filename="crispr_model_weights.h5"):
    """Save the trained model weights (more reliable)"""
    try:
        # Save model weights
        model.save_weights(filename)
        logger.info(f"Model weights saved successfully to {filename}")
        return True
    except Exception as e:
        logger.error(f"Failed to save model weights: {str(e)}")
        return False

def load_model_simple(filename="crispr_model_weights.h5"):
    """Load a pre-trained model by creating new model and loading weights"""
    try:
        if os.path.exists(filename):
            # Create a new model with the same architecture
            model = ViTClassifier()
            model.compile(
                optimizer=keras.optimizers.Adam(learning_rate=0.001),
                loss=keras.losses.SparseCategoricalCrossentropy(from_logits=True),
                metrics=['accuracy']
            )
            
            # Initialize model with dummy data
            dummy_input = tf.zeros((1, 23, 23, 1))
            _ = model(dummy_input)
            
            # Load the weights
            model.load_weights(filename)
            logger.info(f"Model weights loaded successfully from {filename}")
            return model
        else:
            logger.info(f"No pre-trained weights found at {filename}")
            return None
        
    except Exception as e:
        logger.error(f"Failed to load model weights: {str(e)}")
        return None

def model_exists(filename="crispr_model_weights.h5"):
    """Check if a saved model exists"""
    return os.path.exists(filename)

def predict_with_model(model, sgRNA, DNA):
    """Make prediction using the loaded model"""
    try:
        # Generate match matrix
        match_matrix = generate_match_matrix(sgRNA, DNA)
        X_input = np.expand_dims(match_matrix, axis=(0, -1)).astype(np.float32)
        
        # Get model prediction
        predictions = model.predict(X_input, verbose=0)
        prediction = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]))
        
        return {
            'prediction': int(prediction),
            'confidence': confidence,
            'sgRNA': sgRNA,
            'DNA': DNA
        }
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        return None

def main():
    """Main training and saving workflow"""
    logger.info("Starting CRISPR Model Training and Saving Workflow")
    
    # Step 1: Check if model already exists
    if model_exists():
        logger.info("Found existing model weights. Loading...")
        model = load_model_simple()
        if model is not None:
            logger.info("✅ Model loaded successfully!")
            
            # Test prediction
            test_sgRNA = "ATCGATCGATCGATCGATCGATC"
            test_DNA = "ATCGATCGATCGATCGATCGATC"
            result = predict_with_model(model, test_sgRNA, test_DNA)
            if result:
                logger.info(f"Test prediction: {result}")
            
            return model
        else:
            logger.info("Failed to load existing model. Will train new one.")
    
    # Step 2: Load training data
    logger.info("Loading training data...")
    training_data = load_training_data()
    if training_data is None:
        logger.error("Failed to load training data")
        return None
    
    # Step 3: Train model
    logger.info("Training new model...")
    model = train_model(training_data)
    if model is None:
        logger.error("Failed to train model")
        return None
    
    # Step 4: Save model
    logger.info("Saving model weights...")
    if save_model_simple(model):
        logger.info("✅ Model weights saved successfully!")
    else:
        logger.error("Failed to save model weights")
    
    return model

if __name__ == "__main__":
    # Run the complete workflow
    model = main()
    
    if model is not None:
        print("\n" + "="*50)
        print("🎉 SUCCESS: Model is ready for use!")
        print("="*50)
        print("You can now use the model without retraining:")
        print("1. Load the model: model = load_model_simple('crispr_model_weights.h5')")
        print("2. Make predictions: predictions = model.predict(X_test)")
        print("="*50)
    else:
        print("\n❌ ERROR: Failed to prepare model") 