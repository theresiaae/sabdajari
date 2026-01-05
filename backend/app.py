from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db, bcrypt
from routes.auth import auth_bp
from routes.letters import letters_bp
from routes.articles import articles_bp
from routes.quiz import quiz_bp
from routes.ml import ml_bp

jwt = JWTManager()   # INIT JWT OBJECT

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # 🔸 BATAS UKURAN FILE UPLOAD (16 MB)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 

    CORS(app, origins=["http://localhost:5173"])

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # 🔹 ROUTE UNTUK SERVE FILE UPLOAD
    @app.route('/uploads/<path:filename>')
    def serve_uploads(filename):
        return send_from_directory('uploads', filename)
    

    # 🔹 Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(letters_bp, url_prefix='/api/letters')
    app.register_blueprint(articles_bp, url_prefix='/api/articles')
    app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
    app.register_blueprint(ml_bp, url_prefix='/api/ml')

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
