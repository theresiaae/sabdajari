# utils/ml_predict.py
import tensorflow as tf
import numpy as np
import json
import os

# Path model & label mapping
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../ml_model/hand_model.keras')
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), '../ml_model/classname.json')
SCALER_PARAMS_PATH = os.path.join(os.path.dirname(__file__), '../ml_model/scaler_params.json')

# Load model sekali saat startup
print("🔄 Loading ML model...")
model = tf.keras.models.load_model(MODEL_PATH)
print(f"✅ Model loaded: {MODEL_PATH}")
print(f"📐 Input shape: {model.input_shape}")
print(f"📤 Output shape: {model.output_shape}")

# Load class names
with open(CLASS_NAMES_PATH, 'r') as f:
    class_names_dict = json.load(f)
    # Convert {"0": "A", "1": "B", ...} to list ["A", "B", ...]
    labels = [class_names_dict[str(i)] for i in range(len(class_names_dict))]

print(f"🔤 Loaded {len(labels)} classes: {labels}")

def normalize_landmarks(landmarks):
    """
    Normalisasi landmarks - PENTING INI HARUS SAMA DENGAN TRAINING!
    """
    landmarks = np.array(landmarks, dtype=np.float32)
    
    # METHOD 3B: StandardScaler PER COORDINATE (X, Y, Z separately)
    # Reshape ke (21, 3) untuk normalize per axis
    landmarks_reshaped = landmarks.reshape(21, 3)
    
    # === TARUH DI SINI (WAJIB) ===
    base = landmarks_reshaped[0].copy()
    landmarks_reshaped = landmarks_reshaped - base

    # Normalize each axis (X, Y, Z) separately
    normalized = np.zeros_like(landmarks_reshaped)
    for i in range(3):  # 0=X, 1=Y, 2=Z
        axis_values = landmarks_reshaped[:, i]
        mean = axis_values.mean()
        std = axis_values.std()
        if std != 0:
            normalized[:, i] = (axis_values - mean) / std
        else:
            normalized[:, i] = axis_values - mean
    
    # Flatten back to 63 values
    return normalized.flatten()
    
    # ============ METODE LAIN (uncomment untuk coba) ============
    
    # METHOD 1: No normalization
    # return landmarks
    
    # METHOD 2: Min-Max normalization [0, 1]
    # min_val = landmarks.min()
    # max_val = landmarks.max()
    # if max_val - min_val != 0:
    #     return (landmarks - min_val) / (max_val - min_val)
    # return landmarks
    
    # METHOD 3: StandardScaler (all 63 values together)
    # mean = landmarks.mean()
    # std = landmarks.std()
    # if std != 0:
    #     return (landmarks - mean) / std
    # return landmarks
    
    # METHOD 4: Normalize by max absolute value
    # max_abs = np.max(np.abs(landmarks))
    # if max_abs != 0:
    #     return landmarks / max_abs
    # return landmarks
    
    # METHOD 5: Per-coordinate Min-Max
    # landmarks_reshaped = landmarks.reshape(21, 3)
    # normalized = np.zeros_like(landmarks_reshaped)
    # for i in range(3):
    #     axis_values = landmarks_reshaped[:, i]
    #     min_val = axis_values.min()
    #     max_val = axis_values.max()
    #     if max_val - min_val != 0:
    #         normalized[:, i] = (axis_values - min_val) / (max_val - min_val)
    #     else:
    #         normalized[:, i] = axis_values
    # return normalized.flatten()

def predict_from_landmarks(landmarks):
    """
    Prediksi huruf dari landmark coordinates
    
    Args:
        landmarks: List of 63 values [x1, y1, z1, x2, y2, z2, ..., x21, y21, z21]
    
    Returns:
        (predicted_letter, confidence, top_3_predictions)
    """
    try:
        # Validasi input
        if len(landmarks) != 63:
            print(f"❌ Invalid landmarks length: {len(landmarks)}, expected 63")
            return None, 0.0, []
        
        # Convert to numpy array
        landmarks_array = np.array(landmarks, dtype=np.float32)
        
        # Normalisasi (KRUSIAL!)
        landmarks_array = normalize_landmarks(landmarks_array)
        
        # Reshape sesuai input model
        # Cek model.input_shape: bisa (None, 63) atau (None, 21, 3)
        input_shape = model.input_shape
        
        if len(input_shape) == 2:  # (None, 63)
            landmarks_array = landmarks_array.reshape(1, 63)
        elif len(input_shape) == 3:  # (None, 21, 3)
            landmarks_array = landmarks_array.reshape(1, 21, 3)
        else:
            print(f"❌ Unexpected input shape: {input_shape}")
            return None, 0.0, []
        
        print(f"📊 Input shape after reshape: {landmarks_array.shape}")
        print(f"📈 Sample values: {landmarks_array[0][:5]}")
        
        # Prediksi
        predictions = model.predict(landmarks_array, verbose=0)
        
        # Get top prediction
        predicted_class = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class])
        predicted_letter = labels[predicted_class]
        
        # Get top 3 predictions
        top_3_idx = np.argsort(predictions[0])[-3:][::-1]
        top_3 = [
            {
                'label': labels[idx],
                'confidence': float(predictions[0][idx])
            }
            for idx in top_3_idx
        ]
        
        print(f"✅ Predicted: {predicted_letter} ({confidence:.2%})")
        
        # Print top 3 (avoid nested f-string issues)
        top_3_str = ", ".join([f"{p['label']}:{p['confidence']:.2%}" for p in top_3])
        print(f"📊 Top 3: {top_3_str}")
        
        # Threshold confidence (opsional, bisa dimatikan dulu untuk testing)
        # if confidence < 0.3:
        #     return None, confidence, top_3
        
        return predicted_letter, confidence, top_3
        
    except Exception as e:
        print(f"🔥 ML Prediction Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return None, 0.0, []

def predict_letter(image_bytes):
    """
    DEPRECATED: Function lama untuk backward compatibility
    Sekarang kita pakai predict_from_landmarks()
    """
    print("⚠️ predict_letter() is deprecated, use predict_from_landmarks()")
    return None, 0.0