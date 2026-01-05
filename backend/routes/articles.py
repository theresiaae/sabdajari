from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import Article, User, db
from utils.auth_helpers import admin_required, create_slug
import os
from werkzeug.utils import secure_filename

articles_bp = Blueprint('articles', __name__)

UPLOAD_FOLDER = 'uploads/articles'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@articles_bp.route('/', methods=['GET'])
def get_articles():
    articles = Article.query.order_by(Article.created_at.desc()).all()
    return jsonify([{
        'id': a.id,
        'title': a.title,
        'slug': a.slug,
        'cover_image': a.cover_image,
        'content': a.content, 
        'created_at': a.created_at.isoformat()
    } for a in articles])

@articles_bp.route('/<slug>', methods=['GET'])
def get_article(slug):
    article = Article.query.filter_by(slug=slug).first()
    if not article:
        return jsonify({'message': 'Article not found'}), 404
    return jsonify(article.to_dict())

@articles_bp.route('/', methods=['POST'])
@jwt_required()
def create_article():
    error = admin_required()
    if error:
        return error
    
    title = request.form.get('title')
    content = request.form.get('content')
    
    if not title or not content:
        return jsonify({'message': 'Title and content required'}), 400
    
    slug = create_slug(title)
    if Article.query.filter_by(slug=slug).first():
        return jsonify({'message': 'Article with similar title exists'}), 400
    
    cover_image = None
    if 'cover' in request.files:
        file = request.files['cover']
        if file and file.filename:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            cover_image = f'/uploads/articles/{filename}'
    
    article = Article(
        title=title,
        slug=slug,
        cover_image=cover_image,
        content=content
    )
    
    db.session.add(article)
    db.session.commit()
    return jsonify(article.to_dict()), 201

@articles_bp.route('/<slug>', methods=['PUT'])
@jwt_required()
def update_article(slug):
    error = admin_required()
    if error:
        return error
    
    article = Article.query.filter_by(slug=slug).first()
    if not article:
        return jsonify({'message': 'Article not found'}), 404
    
    title = request.form.get('title', article.title)
    content = request.form.get('content', article.content)
    
    # Handle cover image
    if 'cover' in request.files:
        file = request.files['cover']
        if file and file.filename:
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            article.cover_image = f'/uploads/articles/{filename}'
    
    article.title = title
    article.content = content
    # Slug tidak diupdate untuk menghindari broken link
    
    db.session.commit()
    return jsonify(article.to_dict())

@articles_bp.route('/<slug>', methods=['DELETE'])
@jwt_required()
def delete_article(slug):
    error = admin_required()
    if error:
        return error
    
    article = Article.query.filter_by(slug=slug).first()
    if not article:
        return jsonify({'message': 'Article not found'}), 404
    
    db.session.delete(article)
    db.session.commit()
    return jsonify({'message': 'Article deleted successfully'})