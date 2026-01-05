# routes/ml.py
from flask import Blueprint, request, jsonify
from utils.ml_predict import predict_from_landmarks

ml_bp = Blueprint('ml', __name__)

@ml_bp.route('/detect', methods=['POST'])
def detect_letter():
    """
    Deteksi huruf dari LANDMARKS (bukan gambar lagi!)
    
    Expected JSON body:
    {
        "landmarks": [x1, y1, z1, x2, y2, z2, ..., x21, y21, z21]  // 63 values
    }
    """
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data or 'landmarks' not in data:
            return jsonify({
                'success': False,
                'message': 'No landmarks provided. Expected JSON: {"landmarks": [...]}'
            }), 400
        
        landmarks = data['landmarks']
        
        # Validasi panjang landmarks
        if not isinstance(landmarks, list) or len(landmarks) != 63:
            return jsonify({
                'success': False,
                'message': f'Invalid landmarks. Expected 63 values, got {len(landmarks) if isinstance(landmarks, list) else "not a list"}'
            }), 400
        
        print(f"\n{'='*50}")
        print(f"📥 Received landmarks request")
        print(f"📊 Landmarks count: {len(landmarks)}")
        print(f"📈 First 5 values: {landmarks[:5]}")
        print(f"{'='*50}\n")
        
        # Prediksi
        letter, confidence, top_3 = predict_from_landmarks(landmarks)
        
        if letter is None:
            return jsonify({
                'success': False,
                'message': 'Could not detect sign',
                'confidence': round(confidence, 4),
                'top_3': top_3
            }), 200
        
        return jsonify({
            'success': True,
            'letter': letter,
            'confidence': round(confidence, 4),
            'top_3': top_3,
            'all_predictions': {
                pred['label']: round(pred['confidence'], 4)
                for pred in top_3
            }
        }), 200
        
    except Exception as e:
        import traceback
        print(f"\n🔥 ERROR in detect_letter:")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500


@ml_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    from utils.ml_predict import model, labels
    
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'num_classes': len(labels),
        'classes': labels,
        'input_shape': str(model.input_shape),
        'output_shape': str(model.output_shape)
    }), 200


@ml_bp.route('/test', methods=['POST'])
def test_prediction():
    """
    Test endpoint dengan dummy landmarks
    Untuk testing apakah model bisa predict
    """
    try:
        # Dummy landmarks (semi-random tapi valid range)
        dummy_landmarks = [
            0.5, 0.5, 0.0,  # Point 0 (wrist)
            0.4, 0.4, 0.0,  # Point 1
            0.3, 0.3, 0.0,  # Point 2
            0.2, 0.2, 0.0,  # Point 3
            0.1, 0.1, 0.0,  # Point 4
            0.6, 0.6, 0.0,  # Point 5
            0.7, 0.7, 0.0,  # Point 6
            0.8, 0.8, 0.0,  # Point 7
            0.9, 0.9, 0.0,  # Point 8
            0.5, 0.4, 0.0,  # Point 9
            0.5, 0.3, 0.0,  # Point 10
            0.5, 0.2, 0.0,  # Point 11
            0.5, 0.1, 0.0,  # Point 12
            0.4, 0.5, 0.0,  # Point 13
            0.4, 0.4, 0.0,  # Point 14
            0.4, 0.3, 0.0,  # Point 15
            0.4, 0.2, 0.0,  # Point 16
            0.3, 0.6, 0.0,  # Point 17
            0.3, 0.5, 0.0,  # Point 18
            0.3, 0.4, 0.0,  # Point 19
            0.3, 0.3, 0.0   # Point 20
        ]
        
        letter, confidence, top_3 = predict_from_landmarks(dummy_landmarks)
        
        return jsonify({
            'success': True,
            'message': 'Test prediction successful',
            'dummy_landmarks_count': len(dummy_landmarks),
            'result': {
                'letter': letter,
                'confidence': round(confidence, 4),
                'top_3': top_3
            }
        }), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': f'Test failed: {str(e)}'
        }), 500