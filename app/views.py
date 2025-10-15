from flask import (
    Blueprint, abort, current_app, logging, render_template, redirect, send_file, url_for, flash, request, jsonify, session, g
)

from flask_login import (
    current_user, login_required, login_user
)

views = Blueprint('views', __name__)

@views.route('/')
def catalog(methods=['POST', 'GET']):
    if request.method == 'GET':
        return render_template('catalog.html', 
                            current_user=current_user,
                            )
