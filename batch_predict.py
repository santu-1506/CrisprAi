#!/usr/bin/env python3
"""
CRISPR Batch Prediction Script
This script loads the saved model and makes predictions on multiple sequences.
"""

import os
import numpy as np
import pandas as pd
import tensorflow as tf
from model_api import ViTClassifier, PatchEmbedding, generate_match_matrix

def load_model(filename="crispr_model.h5"):
    """Load a pre-trained model"""
    try:
        if os.path.exists(filename):
            model = tf.keras.models.load_model(filename, custom_objects={
                'ViTClassifier': ViTClassifier,
                'PatchEmbedding': PatchEmbedding
            })
            print(f"✅ Model loaded successfully from {filename}")
            return model
        else:
            print(f"❌ No model found at {filename}")
            return None
    except Exception as e:
        print(f"❌ Failed to load model: {str(e)}")
        return None

def predict_batch(model, sequences):
    """
    Make predictions on a batch of sequences
    
    Args:
        model: Loaded TensorFlow model
        sequences: List of dicts with 'sgRNA' and 'DNA' keys
    
    Returns:
        List of prediction results
    """
    results = []
    
    for i, seq in enumerate(sequences):
        try:
            sgRNA = seq['sgRNA'].upper()
            DNA = seq['DNA'].upper()
            
            # Validate sequences
            if len(sgRNA) != 23 or len(DNA) != 23:
                results.append({
                    'index': i,
                    'sgRNA': sgRNA,
                    'DNA': DNA,
                    'error': 'Invalid sequence length (must be 23 bases)'
                })
                continue
            
            if not all(base in 'ATCG' for base in sgRNA + DNA):
                results.append({
                    'index': i,
                    'sgRNA': sgRNA,
                    'DNA': DNA,
                    'error': 'Invalid nucleotides (must be A, T, C, G only)'
                })
                continue
            
            # Generate match matrix
            match_matrix = generate_match_matrix(sgRNA, DNA)
            X_input = np.expand_dims(match_matrix, axis=(0, -1)).astype(np.float32)
            
            # Get model prediction
            predictions = model.predict(X_input, verbose=0)
            prediction = np.argmax(predictions[0])
            confidence = float(np.max(predictions[0]))
            
            results.append({
                'index': i,
                'sgRNA': sgRNA,
                'DNA': DNA,
                'prediction': int(prediction),
                'confidence': confidence,
                'interpretation': 'High off-target risk' if prediction == 1 else 'Low off-target risk',
                'error': None
            })
            
        except Exception as e:
            results.append({
                'index': i,
                'sgRNA': seq.get('sgRNA', 'N/A'),
                'DNA': seq.get('DNA', 'N/A'),
                'error': f'Prediction failed: {str(e)}'
            })
    
    return results

def load_sequences_from_csv(filename):
    """Load sequences from a CSV file"""
    try:
        df = pd.read_csv(filename)
        sequences = []
        
        for _, row in df.iterrows():
            sequences.append({
                'sgRNA': str(row['sgRNA']),
                'DNA': str(row['DNA'])
            })
        
        print(f"✅ Loaded {len(sequences)} sequences from {filename}")
        return sequences
        
    except Exception as e:
        print(f"❌ Failed to load sequences from {filename}: {str(e)}")
        return None

def save_results_to_csv(results, filename="predictions.csv"):
    """Save prediction results to CSV"""
    try:
        df = pd.DataFrame(results)
        df.to_csv(filename, index=False)
        print(f"✅ Results saved to {filename}")
        return True
    except Exception as e:
        print(f"❌ Failed to save results: {str(e)}")
        return False

def main():
    """Main batch prediction workflow"""
    print("🧬 CRISPR Batch Prediction")
    print("="*40)
    
    # Load model
    model = load_model()
    if model is None:
        return
    
    # Example 1: Use predefined sequences
    print("\nExample 1: Predicting on predefined sequences...")
    example_sequences = [
        {'sgRNA': 'ATCGATCGATCGATCGATCGATC', 'DNA': 'ATCGATCGATCGATCGATCGATC'},
        {'sgRNA': 'ATCGATCGATCGATCGATCGATC', 'DNA': 'ATCGATCGATCGATCGATCGATT'},
        {'sgRNA': 'GCTAGCTAGCTAGCTAGCTAGCT', 'DNA': 'GCTAGCTAGCTAGCTAGCTAGCT'},
        {'sgRNA': 'GCTAGCTAGCTAGCTAGCTAGCT', 'DNA': 'GCTAGCTAGCTAGCTAGCTAGCA'},
    ]
    
    results = predict_batch(model, example_sequences)
    
    print("\nResults:")
    for result in results:
        if result['error']:
            print(f"  {result['index']}: ERROR - {result['error']}")
        else:
            print(f"  {result['index']}: {result['sgRNA']} vs {result['DNA']} -> {result['interpretation']} (conf: {result['confidence']:.3f})")
    
    # Save results
    save_results_to_csv(results, "example_predictions.csv")
    
    # Example 2: Load from CSV file if it exists
    csv_file = "test_sequences.csv"
    if os.path.exists(csv_file):
        print(f"\nExample 2: Loading sequences from {csv_file}...")
        sequences = load_sequences_from_csv(csv_file)
        
        if sequences:
            results2 = predict_batch(model, sequences)
            save_results_to_csv(results2, "batch_predictions.csv")
            
            # Show summary
            successful = sum(1 for r in results2 if r['error'] is None)
            print(f"\nSummary: {successful}/{len(results2)} predictions successful")
    
    print("\n✅ Batch prediction completed!")

if __name__ == "__main__":
    main() 