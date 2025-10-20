from flask import (
    Blueprint, abort, current_app, logging, render_template, redirect, send_file, url_for, flash, request, jsonify, session, g
)

from flask_login import (
    current_user, login_required, login_user
)

from app.models import Model

views = Blueprint('views', __name__)

@views.route('/')
def catalog(methods=['POST', 'GET']):
    if request.method == 'GET':
        return render_template('catalog.html', 
                            current_user=current_user,
                            )
        
@views.route('/models')
def models(methods=['POST', 'GET']):
    if request.method == 'GET':
        return render_template('models.html', 
                            current_user=current_user,
                            )
        
@views.route('/api/models', methods=['GET'])
def get_models():
    """"""
    models = Model.query.all()
    result = []
    for m in models:
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
            'range': m.range
        })
    return jsonify(result)
    """Добавляет новую модель в базу данных."""
    data = request.json 
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    model = Model(
        series=data.get('series'),
        subseries=data.get('subseries'),
        description=data.get('description'),
        engine=data.get('engine'),
        drive=data.get('drive'),
        transmission=data.get('transmission'),
        is_gazoline=data.get('is_gazoline', False),
        is_electric=data.get('is_electric', False),
        is_hybrid=data.get('is_hybrid', False),
        power=data.get('power'),
        to100=data.get('to100'),
        top_speed=data.get('top_speed'),
        range=data.get('range'),
        created_at=datetime.now()  # можно использовать твою функцию current_belarus_time
    )
    db.session.add(model)
    db.session.commit()

    return jsonify({'message': 'Model added', 'id': model.id}), 201