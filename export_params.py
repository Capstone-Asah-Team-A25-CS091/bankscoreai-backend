import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import json
import os

# --- IMPORTANT ---
# Please ensure the path to the CSV file is correct relative to where you run this script.
# This script assumes it is run from the 'bankscoreai-backend' directory.
CSV_PATH = 'bank-additional-full.csv'
OUTPUT_DIR = 'ml-model'

def export_preprocessing_params():
    print(f"Loading data from {CSV_PATH}...")
    if not os.path.exists(CSV_PATH):
        print(f"Error: Dataset not found at {CSV_PATH}")
        print("Please make sure the path is correct.")
        return

    df = pd.read_csv(CSV_PATH, sep=';')

    # --- 1. Replicate Categorical Encoding from Notebook ---
    print("Encoding categorical features...")
    # Convert to category dtype
    for col in ['job', 'marital', 'education', 'default', 'housing', 'loan', 'contact', 'poutcome', 'day_of_week', 'month', 'y']:
        df[col] = df[col].astype('category')
    
    # Convert to numeric codes
    for col in ['job', 'marital', 'education', 'default', 'housing', 'loan', 'contact', 'poutcome', 'day_of_week', 'month', 'y']:
        df[col] = df[col].cat.codes

    # --- 2. Define Feature Set ---
    feature_cols = [
        'age', 'job', 'marital', 'education', 'default', 'balance', 'housing', 'loan', 
        'contact', 'month', 'day_of_week', 'duration', 'campaign', 'pdays', 'previous', 
        'poutcome', 'emp.var.rate', 'cons.price.idx', 'cons.conf.idx', 'euribor3m', 'nr.employed'
    ]
    X = df[feature_cols]

    # --- 3. Fit Scaler and PCA ---
    print("Fitting StandardScaler...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print("Fitting PCA...")
    pca = PCA(n_components=4)
    pca.fit(X_scaled)

    # --- 4. Prepare data for JSON export ---
    scaler_params = {
        'mean': scaler.mean_.tolist(),
        'scale': scaler.scale_.tolist()
    }

    pca_params = {
        'components': pca.components_.tolist()
    }

    # --- 5. Write to JSON files ---
    scaler_json_path = os.path.join(OUTPUT_DIR, 'scaler.json')
    pca_json_path = os.path.join(OUTPUT_DIR, 'pca.json')

    print(f"Writing scaler parameters to {scaler_json_path}...")
    with open(scaler_json_path, 'w') as f:
        json.dump(scaler_params, f, indent=4)

    print(f"Writing PCA parameters to {pca_json_path}...")
    with open(pca_json_path, 'w') as f:
        json.dump(pca_params, f, indent=4)
        
    print("\nDone! `scaler.json` and `pca.json` have been created in the 'ml-model' directory.")

if __name__ == '__main__':
    export_preprocessing_params()

