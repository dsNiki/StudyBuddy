# app.py - TELJES JAVÍTOTT VÁLTOZAT (copy-paste kész!)

from flask import Flask, send_from_directory, render_template, jsonify  # type: ignore
from flask_mail import Mail  # 👈 FONTOS: Mail import IDE!
from config import Config
from models import db
from routes import register_routes
from flask_cors import CORS  # type: ignore
from werkzeug.exceptions import HTTPException  # type: ignore
from flask_migrate import Migrate  # type: ignore
import os

def create_app():
    app = Flask(__name__)
    
    # 👈 MAILTRAP CONFIG IDE ELŐRE (Config ELŐTT!)
    app.config['MAIL_SERVER'] = 'sandbox.smtp.mailtrap.io'
    app.config['MAIL_PORT'] = 2525
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = '7d102fd345b575'  # Mailtrap SMTP Username
    app.config['MAIL_PASSWORD'] = '43712d8b49aa14'  # Mailtrap SMTP Password  
    app.config['MAIL_DEFAULT_SENDER'] = 'noreply@studyconnect.hu'
    # app.py (create_app()-ban):
    app.config['ELTE_EMAIL_REGEX'] = r'^[a-zA-Z0-9._%+-]+@(inf|student)\.elte\.hu$'


    
    # CORS (marad)
    CORS(app, 
         origins=["http://localhost:3000","http://localhost:5173", "https://elte-frontend-5bnk.vercel.app"], 
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True,
         expose_headers=["Content-Type"])

    # Error handler-ek (maradnak)
    @app.errorhandler(HTTPException)
    def handle_http_error(e):
        return jsonify({
            "error": e.name,
            "message": str(e.description),
            "code": e.code
        }), e.code

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "error": "Nincs ilyen endpoint",
            "code": 404
        }), 404

    # Config betöltés (MAIL CONFIG UTÁN!)
    app.config.from_object(Config)

    db.init_app(app)
    mail = Mail(app) 

    
    migrate = Migrate(app, db)
    # Route-ok (mind maradnak változatlanul)
    @app.route("/")
    def home():
        return "Welcome to the StudyBuddy API! ✅ Mailtrap email kész!"

    @app.route("/test-ui")
    def test_ui():
        return "<h1>Backend működik! Mailtrap konfigurálva!</h1>"

    @app.route("/test")
    def test_page():
        return render_template("test.html")
    
    @app.route("/uploads/<path:filepath>")
    def uploaded_file(filepath):
        file_path = os.path.join(Config.UPLOAD_FOLDER, filepath)
        directory = os.path.dirname(file_path)
        filename = os.path.basename(file_path)
        return send_from_directory(directory, filename)
    
    # Route-ok regisztrálása
    register_routes(app)

    # DB létrehozás
    with app.app_context():
        db.create_all()

        

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
