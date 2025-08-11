#!/usr/bin/env python3
"""
CRISPR Model Usage Example
This script shows how to load and use the saved model without retraining.
"""

import os
import numpy as np
import tensorflow as tf
from model_api import ViTClassifier, PatchEmbedding, generate_match_matrix

def load_model(filename="crispr_model.h5"):
    """Load a pre-trained model"""
    try:
        if os.path.exists(filename):
            # Load the entire model
            model = tf.keras.models.load_model(filename, custom_objects={
                'ViTClassifier': ViTClassifier,
                'PatchEmbedding': PatchEmbedding
            })
            print(f"✅ Model loaded successfully from {filename}")
            return model
        else:
            print(f"❌ No model found at {filename}")
            print("Please run train_and_save_model.py first to create the model")
            return None
        
    except Exception as e:
        print(f"❌ Failed to load model: {str(e)}")
        return None

def predict_crispr(model, sgRNA, DNA):
    """Make CRISPR prediction for given sequences"""
    try:
        # Validate sequences
        if len(sgRNA) != 23 or len(DNA) != 23:
            raise ValueError("Both sequences must be exactly 23 nucleotides long")
        
        if not all(base in 'ATCG' for base in sgRNA + DNA):
            raise ValueError("Sequences must contain only A, T, C, G nucleotides")
        
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
            'DNA': DNA,
            'interpretation': 'High off-target risk' if prediction == 1 else 'Low off-target risk'
        }
    except Exception as e:
        print(f"❌ Prediction failed: {str(e)}")
        return None

def main():
    """Main usage example"""
    print("🧬 CRISPR Model Usage Example")
    print("="*40)
    
    # Step 1: Load the saved model
    print("Loading saved model...")
    model = load_model()
    
    if model is None:
        return
    
    print(f"Model loaded! Parameters: {model.count_params():,}")
    print()
    
    # Step 2: Make predictions
    print("Making predictions...")
    
    # Example 1: Perfect match (should be low risk)
    sgRNA1 = "ATCGATCGATCGATCGATCGATC"
    DNA1 = "ATCGATCGATCGATCGATCGATC"
    
    result1 = predict_crispr(model, sgRNA1, DNA1)
    if result1:
        print(f"Example 1 - Perfect match:")
        print(f"  sgRNA: {result1['sgRNA']}")
        print(f"  DNA:   {result1['DNA']}")
        print(f"  Prediction: {result1['interpretation']} (confidence: {result1['confidence']:.3f})")
        print()
    
    # Example 2: Mismatch (should be high risk)
    sgRNA2 = "ATCGATCGATCGATCGATCGATC"
    DNA2 = "ATCGATCGATCGATCGATCGATT"  # One mismatch at the end
    
    result2 = predict_crispr(model, sgRNA2, DNA2)
    if result2:
        print(f"Example 2 - With mismatch:")
        print(f"  sgRNA: {result2['sgRNA']}")
        print(f"  DNA:   {result2['DNA']}")
        print(f"  Prediction: {result2['interpretation']} (confidence: {result2['confidence']:.3f})")
        print()
    
    # Example 3: User input
    print("Try your own sequences:")
    try:
        user_sgRNA = input("Enter sgRNA sequence (23 bases, ATCG only): ").upper()
        user_DNA = input("Enter DNA sequence (23 bases, ATCG only): ").upper()
        
        if user_sgRNA and user_DNA:
            result3 = predict_crispr(model, user_sgRNA, user_DNA)
            if result3:
                print(f"\nYour prediction:")
                print(f"  sgRNA: {result3['sgRNA']}")
                print(f"  DNA:   {result3['DNA']}")
                print(f"  Prediction: {result3['interpretation']} (confidence: {result3['confidence']:.3f})")
    except KeyboardInterrupt:
        print("\nExiting...")
    except Exception as e:
        print(f"Error with user input: {str(e)}")

if __name__ == "__main__":
    main() 