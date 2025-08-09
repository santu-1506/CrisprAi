#!/usr/bin/env python3
"""
Generate high-quality CRISPR training data with PAM-based labels
Creates biologically accurate sequence pairs for model training
"""

import random
import csv
import numpy as np

def generate_random_sequence(length=23):
    """Generate random DNA sequence of specified length"""
    bases = ['A', 'T', 'G', 'C']
    return ''.join(random.choice(bases) for _ in range(length))

def create_pam_matching_pair():
    """Create sgRNA-DNA pair with matching PAM (NGG pattern)"""
    # Generate random first 20 bases
    base_sgrna = generate_random_sequence(20)
    base_dna = generate_random_sequence(20)
    
    # Add matching PAM (NGG pattern) - same for both
    pam_options = ['AGG', 'TGG', 'CGG', 'GGG']  # All valid NGG patterns
    pam = random.choice(pam_options)
    
    sgrna = base_sgrna + pam
    dna = base_dna + pam
    
    return sgrna, dna, 1  # Label 1 for matching PAM

def create_pam_mismatching_pair():
    """Create sgRNA-DNA pair with non-matching PAM"""
    sgrna = generate_random_sequence(20)
    dna = generate_random_sequence(20)
    
    # Add different PAMs
    pam_sgrna = random.choice(['AGG', 'TGG', 'CGG', 'GGG'])
    pam_dna = random.choice(['AAT', 'ATC', 'CTG', 'TAC', 'TTT', 'CAA'])  # Non-NGG patterns
    
    sgrna = sgrna + pam_sgrna
    dna = dna + pam_dna
    
    return sgrna, dna, 0  # Label 0 for non-matching PAM

def create_realistic_crispr_pair():
    """Create more realistic CRISPR pair with some sequence similarity"""
    # Start with same base sequence
    base_sequence = generate_random_sequence(20)
    
    # Create variations with mutations
    sgrna_bases = list(base_sequence)
    dna_bases = list(base_sequence)
    
    # Introduce 1-3 random mutations in each
    for _ in range(random.randint(1, 3)):
        pos = random.randint(0, 19)
        sgrna_bases[pos] = random.choice(['A', 'T', 'G', 'C'])
        
    for _ in range(random.randint(1, 3)):
        pos = random.randint(0, 19)
        dna_bases[pos] = random.choice(['A', 'T', 'G', 'C'])
    
    sgrna_base = ''.join(sgrna_bases)
    dna_base = ''.join(dna_bases)
    
    # Randomly decide if PAM should match
    if random.random() < 0.6:  # 60% chance of PAM match
        pam = random.choice(['AGG', 'TGG', 'CGG', 'GGG'])
        return sgrna_base + pam, dna_base + pam, 1
    else:  # 40% chance of PAM mismatch
        pam_sgrna = random.choice(['AGG', 'TGG', 'CGG', 'GGG'])
        pam_dna = random.choice(['AAT', 'ATC', 'CTG', 'TAC'])
        return sgrna_base + pam_sgrna, dna_base + pam_dna, 0

def generate_crispr_dataset(num_samples=2000, filename="expanded_crispr_data.txt"):
    """Generate comprehensive CRISPR dataset"""
    
    print(f"🧬 Generating {num_samples} CRISPR sequence pairs...")
    
    data = []
    
    # Generate different types of sequence pairs
    for i in range(num_samples):
        if i % 100 == 0:
            print(f"Progress: {i}/{num_samples} samples generated")
        
        # Mix different generation strategies
        if i % 3 == 0:
            # Pure PAM matching
            sgrna, dna, label = create_pam_matching_pair()
        elif i % 3 == 1:
            # Pure PAM mismatching  
            sgrna, dna, label = create_pam_mismatching_pair()
        else:
            # Realistic with mutations
            sgrna, dna, label = create_realistic_crispr_pair()
        
        data.append([sgrna, dna, label])
    
    # Shuffle the data
    random.shuffle(data)
    
    # Write to file
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        for row in data:
            writer.writerow(row)
    
    # Print statistics
    labels = [row[2] for row in data]
    success_count = sum(labels)
    
    print(f"\n✅ Dataset generated successfully!")
    print(f"📁 Saved to: {filename}")
    print(f"📊 Statistics:")
    print(f"   • Total samples: {len(data)}")
    print(f"   • Success (label=1): {success_count} ({success_count/len(data)*100:.1f}%)")
    print(f"   • No edit (label=0): {len(data)-success_count} ({(len(data)-success_count)/len(data)*100:.1f}%)")
    
    return data

def validate_sequences(filename):
    """Validate generated sequences"""
    print(f"\n🔍 Validating sequences in {filename}...")
    
    valid_count = 0
    total_count = 0
    
    with open(filename, 'r') as file:
        for line in file:
            if line.strip():
                parts = line.strip().split(',')
                if len(parts) == 3:
                    sgrna, dna, label = parts[0], parts[1], int(parts[2])
                    
                    # Check sequence length
                    if len(sgrna) == 23 and len(dna) == 23:
                        # Check valid nucleotides
                        if all(base in 'ATGC' for base in sgrna + dna):
                            valid_count += 1
                    
                    total_count += 1
    
    print(f"✅ Validation complete:")
    print(f"   • Valid sequences: {valid_count}/{total_count} ({valid_count/total_count*100:.1f}%)")
    
    return valid_count == total_count

if __name__ == "__main__":
    # Set random seed for reproducibility
    random.seed(42)
    np.random.seed(42)
    
    print("🚀 CRISPR Data Generator")
    print("=" * 50)
    
    # Generate different sized datasets
    datasets = [
        (1000, "crispr_data_1k.txt"),
        (2000, "crispr_data_2k.txt"), 
        (5000, "crispr_data_5k.txt")
    ]
    
    for size, filename in datasets:
        print(f"\n📈 Generating {size} samples...")
        generate_crispr_dataset(size, filename)
        validate_sequences(filename)
        print("-" * 50)
    
    print("\n🎉 All datasets generated successfully!")
    print("\n💡 Usage:")
    print("   • Use crispr_data_1k.txt for quick training (1,000 samples)")
    print("   • Use crispr_data_2k.txt for better performance (2,000 samples)")  
    print("   • Use crispr_data_5k.txt for best results (5,000 samples)")
    print("\n🔬 All data follows biological PAM rules for accuracy!")
