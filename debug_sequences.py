#!/usr/bin/env python3

def check_pam_sequence(sgRNA, DNA):
    """Check if sequences have matching PAM (NGG) pattern at end"""
    sgRNA_pam = sgRNA[-3:]
    DNA_pam = DNA[-3:]
    
    print(f"sgRNA: {sgRNA}")
    print(f"DNA: {DNA}")
    print(f"sgRNA PAM: {sgRNA_pam}")
    print(f"DNA PAM: {DNA_pam}")
    print(f"sgRNA ends with GG: {sgRNA_pam[-2:] == 'GG'}")
    print(f"DNA ends with GG: {DNA_pam[-2:] == 'GG'}")
    print(f"First chars match: {sgRNA_pam[0] == DNA_pam[0]}")
    
    # For CRISPR Cas9, PAM is NGG where N can be any nucleotide
    # Both sequences must end with GG for Cas9 to cut
    if sgRNA_pam[-2:] == "GG" and DNA_pam[-2:] == "GG":
        # Also check if the first base matches (N matches N)
        if sgRNA_pam[0] == DNA_pam[0]:
            print("Result: 1 (PAM Match)")
            return 1
    print("Result: 0 (No PAM Match)")
    return 0

# Test the exact sequences from the user's image that are showing wrong PAM match
print("=== Testing sequences from user's image ===")
# The sequences showing in the image appear to both end with GGG
# Let me test different possible sequences
sequences_to_test = [
    ("ATCGATCGATCGATCGATCAGGG", "ATCGATCGATCGATCGATCAGGG"),
    ("GTCACCTCCAATGACTAGGGAGG", "GTCTCCTCCACTGGATTGTGAGG"),
    # Let's also test if there might be hidden characters or different sequences
]

for i, (sgRNA, DNA) in enumerate(sequences_to_test):
    print(f"\n--- Test {i+1} ---")
    result = check_pam_sequence(sgRNA, DNA)
    print(f"PAM match result: {result}")
    print(f"Expected frontend display: {'Yes' if result == 1 else 'No'}")
