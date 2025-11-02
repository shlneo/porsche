import math
from flask import (
    Blueprint, abort, current_app, logging, render_template, redirect, send_file, url_for, flash, request, jsonify, session, g
)

from flask_login import (
    current_user, login_required, login_user
)

from app.models import Model
from . import db

views = Blueprint('views', __name__)

@views.route('/')
def catalog(methods=['POST', 'GET']):
    if request.method == 'GET':
        return render_template('catalog.html', 
                            current_user=current_user,
                            )
        
@views.route('/models')
@views.route('/models/<series>')
def models(series=None):
    current_series = series if series else 'All'
    
    return render_template('models.html', 
                        current_user=current_user,
                        current_series=current_series,
                        hide_header=True,
                        black_header=True
                        )
    
    
@views.route('/api/models', methods=['GET'])
def get_models():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    series_filter = request.args.get('series', 'All', type=str)
    
    query = Model.query
    
    if series_filter and series_filter != 'All':
        query = query.filter(Model.series == series_filter)
    
    pagination = query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )
    
    result = []
    for m in pagination.items:
        result.append({
            'id': m.id,
            'series': m.series,
            'subseries': m.subseries,
            'description': m.description,
            'engine': m.engine,
            'drive': m.drive,
            'transmission': m.transmission,
            'is_gazoline': m.is_gazoline,
            'is_electric': m.is_electric,
            'is_hybrid': m.is_hybrid,
            'power': m.power,
            'to100': m.to100,
            'top_speed': m.top_speed,
            'range': m.range if m.range is not None and not math.isnan(m.range) else None
        })
    
    return jsonify({
        'models': result,
        'has_next': pagination.has_next,
        'total': pagination.total,
        'page': page
    })
    
@views.route('/api/models/series-counts', methods=['GET'])
def get_series_counts():
    from sqlalchemy import func
    
    series_counts = db.session.query(
        Model.series,
        func.count(Model.id)
    ).group_by(Model.series).all()
    
    counts_dict = {series: count for series, count in series_counts}
    total_count = db.session.query(func.count(Model.id)).scalar()
    counts_dict['All'] = total_count
    
    return jsonify(counts_dict)

@views.route('/messages')
def messages(methods=['POST', 'GET']):
    if request.method == 'GET':
        return render_template('messages.html', 
                            current_user=current_user,
                            hide_header=True,
                            black_header=True
                            )