from tkinter import Image
from flask import Blueprint, flash, jsonify, redirect, render_template, request, session, url_for
from flask_login import (
    login_user, logout_user, current_user,
    login_required, LoginManager
)
from sqlalchemy import func

from werkzeug.security import check_password_hash, generate_password_hash

from app.models import User
import random
import string
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import base64

auth = Blueprint('auth', __name__)
login_manager = LoginManager()


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        porsche_id = request.form.get('porsche_id')
        captcha = request.form.get('captcha')
        
        # Здесь добавьте валидацию CAPTCHA
        
        if porsche_id:
            # Сохраняем Porsche ID в сессии для использования в login_password
            session['porsche_id'] = porsche_id
            return redirect(url_for('auth.login_password'))
        
        flash('Please enter your Porsche ID.', 'error')
    
    return render_template(
        'login.html',
        hide_header=True,
        current_user=current_user
    )

@auth.route('/sign', methods=['GET', 'POST'])
def sign():
    if request.method == 'POST':
        pass 
        
    return render_template(
        'sign.html',
        hide_header = True,
        current_user=current_user
    )

@auth.route('/login/password', methods=['GET', 'POST'])
def login_password():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = True if request.form.get('remember') else False

        if email and password:
            user = User.query.filter(func.lower(User.email) == func.lower(email)).first()
            if user:
                if check_password_hash(user.password, password):
                    login_user(user, remember=remember) 
                    flash('Login successful.', 'success')
                    session.pop('porsche_id', None)  # Очищаем сессию
                    return redirect(url_for('auth.profile'))
            
            flash('Invalid email or password.', 'error')
        else:
            flash('Please enter your password.', 'error')

        return render_template('login-with-pass.html', 
            porsche_id=email,
            hide_header=True,
            current_user=current_user
        )
    
    porsche_id = session.get('porsche_id', '')
    
    if not porsche_id:
        flash('Please enter your Porsche ID first.', 'error')
        return redirect(url_for('auth.login'))
    
    return render_template('login-with-pass.html', 
        porsche_id=porsche_id,
        hide_header=True,
        current_user=current_user
    )

@auth.route('/sign/code', methods=['GET', 'POST'])
def sign_code():
    if request.method == 'POST':
        pass 

    return render_template(
        'sign-code.html',
        hide_header = True,
        current_user=current_user
    )

@auth.route('/profile', methods=['GET', 'POST'])
def profile():
    if request.method == 'POST':
        pass 
    return render_template(
        'profile.html',
        current_user=current_user,
                        hide_header=True,
                        black_header=True
    )

def generate_captcha():
    captcha_text = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    session['captcha'] = captcha_text
    
    width, height = 180, 60
    image = Image.new('RGB', (width, height), color=(248, 249, 250))
    draw = ImageDraw.Draw(image)
    
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    draw.text((20, 20), captcha_text, fill=(51, 51, 51), font=font)
    
    for _ in range(100):
        x = random.randint(0, width - 1)
        y = random.randint(0, height - 1)
        draw.point((x, y), fill=(random.randint(200, 255), random.randint(200, 255), random.randint(200, 255)))
    
    buffer = BytesIO()
    image.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

@auth.route('/get_captcha')
def get_captcha():
    captcha_image = generate_captcha()
    return jsonify({'captcha_image': captcha_image})