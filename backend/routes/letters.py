from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Letter, User, db
from utils.auth_helpers import admin_required, create_slug
import os
from werkzeug.utils import secure_filename

letters_bp = Blueprint('letters', __name__)

UPLOAD_FOLDER = 'uploads/letters'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@letters_bp.route('/', methods=['GET'])
def get_letters():
    letters = Letter.query.order_by(Letter.letter).all()
    return jsonify([l.to_dict() for l in letters])

@letters_bp.route('/<letter>', methods=['GET'])
def get_letter(letter):
    letter_obj = Letter.query.filter_by(letter=letter.upper()).first()
    if not letter_obj:
        return jsonify({'message': 'Letter not found'}), 404
    return jsonify(letter_obj.to_dict())

@letters_bp.route('/', methods=['POST'])
@jwt_required()
def create_letter():
    error = admin_required()
    if error:
        return error
    
    letter_char = request.form.get('letter', '').upper()
    description = request.form.get('description')
    tips = request.form.get('tips')
    
    if not letter_char or not description or not tips or len(letter_char) != 1:
        return jsonify({'message': 'Valid letter, description, and tips required'}), 400
    
    if Letter.query.filter_by(letter=letter_char).first():
        return jsonify({'message': 'Letter already exists'}), 400
    
    if 'image' not in request.files:
        return jsonify({'message': 'Image is required'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'message': 'Image is required'}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    image_path = f'/uploads/letters/{filename}'
    
    letter_obj = Letter(
        letter=letter_char,
        image_path=image_path,
        description=description,
        tips=tips
    )
    
    db.session.add(letter_obj)
    db.session.commit()
    return jsonify(letter_obj.to_dict()), 201

@letters_bp.route('/<letter>', methods=['PUT'])
@jwt_required()
def update_letter(letter):
    error = admin_required()
    if error:
        return error
    
    letter_obj = Letter.query.filter_by(letter=letter.upper()).first()
    if not letter_obj:
        return jsonify({'message': 'Letter not found'}), 404
    
    description = request.form.get('description', letter_obj.description)
    tips = request.form.get('tips', letter_obj.tips)
    
    # Handle image update
    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            letter_obj.image_path = f'/uploads/letters/{filename}'
    
    letter_obj.description = description
    letter_obj.tips = tips
    
    db.session.commit()
    return jsonify(letter_obj.to_dict())

@letters_bp.route('/<letter>', methods=['DELETE'])
@jwt_required()
def delete_letter(letter):
    error = admin_required()
    if error:
        return error
    
    letter_obj = Letter.query.filter_by(letter=letter.upper()).first()
    if not letter_obj:
        return jsonify({'message': 'Letter not found'}), 404
    
    db.session.delete(letter_obj)
    db.session.commit()
    return jsonify({'message': 'Letter deleted successfully'})