from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import QuizAttempt, db

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/result', methods=['POST'])
@jwt_required()
def save_quiz_result():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'No data provided'}), 400
    
    required_fields = ['score', 'correct_count', 'wrong_count']
    for field in required_fields:
        if field not in data or not isinstance(data[field], int):
            return jsonify({'message': f'Valid {field} required'}), 400
    
    attempt = QuizAttempt(
        user_id=current_user_id,
        score=data['score'],
        correct_count=data['correct_count'],
        wrong_count=data['wrong_count']
    )
    
    db.session.add(attempt)
    db.session.commit()
    
    return jsonify({
        'message': 'Quiz result saved',
        'attempt': attempt.to_dict()
    }), 201