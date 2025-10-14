
from flask import Blueprint
from flask_login import LoginManager


auth = Blueprint('auth', __name__)
login_manager = LoginManager()
