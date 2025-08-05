import os
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.review_routes import review_routes
from .api.business_routes import business_routes
from .api.business_image_routes import business_image_routes
from .api.review_image_routes import review_image_routes
from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
db.init_app(app)
Migrate(app, db)

# Register blueprints
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(business_routes, url_prefix='/api/businesses')
app.register_blueprint(review_routes, url_prefix='/api/reviews')
app.register_blueprint(review_image_routes, url_prefix='/api/review-images')
app.register_blueprint(business_image_routes, url_prefix='/api/businesses')

# CORS Configuration
frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
backend_url = os.environ.get('BACKEND_URL', 'http://localhost:8000')

CORS(app, resources={
    r"/api/*": {
        "origins": [frontend_url, backend_url],
        "supports_credentials": True,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "X-CSRFToken", "Authorization"]
    }
})

# Security middleware
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)

@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=os.environ.get('FLASK_ENV') == 'production',
        samesite='Lax' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=True)
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# API documentation route
@app.route("/api/docs")
def api_help():
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { 
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__
        ]
        for rule in app.url_map.iter_rules() if rule.endpoint != 'static'
    }
    return jsonify(route_list)

# React catch-all routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')