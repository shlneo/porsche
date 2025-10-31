from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import (
    login_user, logout_user, current_user,
    login_required, LoginManager
)
from sqlalchemy import func

from werkzeug.security import check_password_hash, generate_password_hash

from app.models import User


auth = Blueprint('auth', __name__)
login_manager = LoginManager()


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if email and password:
            user = User.query.filter(func.lower(User.email) == func.lower(email)).first()
            if user and check_password_hash(user.password, password):
                login_user(user)
                if (
                    not user.last_name or
                    not user.first_name or
                    not user.phone
                ):
                    flash("Необходимо заполнить обязательные парамметры.", "error")
                    return redirect(url_for('auth.param'))
                flash('Авторизация прошла успешно.', 'success')
                return redirect(url_for('views.profile'))
            else:
                flash('Неправильный email или пароль.', 'error')
        else:
            flash('Введите данные для авторизации.', 'error')

    return render_template(
        'login.html',
        hide_header = True,
        current_user=current_user
    )







