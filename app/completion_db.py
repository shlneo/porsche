import os
import pandas as pd
from werkzeug.security import generate_password_hash

def create_database(app, db):
    from .models import Model
    with app.app_context():
        db.drop_all()
        db.create_all()
        add_data_in_db(db)
        
def is_db_empty():
    from .models import Model, User
    return all([
        Model.query.count() == 0,
        User.query.count() == 0,
    ])
     

def add_data_in_db(db):
    if is_db_empty():
        print('Filling is in progress...')

        ### Models import###
        excel_path = os.path.join(os.path.dirname(__file__), 'static', 'files', 'porsche_full_model_lineup.xlsx')
        import_models(db, excel_path)

        ### ... import###


        print('The filling is finished! ✅')
    else:
        print('The database already contains the data!')

def import_models(db, excel_path):
    from .models import Model

    if not os.path.exists(excel_path):
        print(f'❌ File {excel_path} not found.')
        return

    df = pd.read_excel(excel_path)

    models = []
    for _, row in df.iterrows():
        model = Model(
            series=row.get('Series'),
            subseries=row.get('Subseries'),
            description=row.get('Description'),
            power=row.get('Power'),
            engine=row.get('Engine'),
            drive=row.get('Drive'),
            transmission=row.get('Transmission'),
            to100=row.get('to100'),
            top_speed=row.get('TopSpeed'),
            range=row.get('Range'),
            is_gazoline=bool(row.get('IsGazoline')),
            is_electric=bool(row.get('IsElectric')),
            is_hybrid=bool(row.get('IsHybrid')),
        )
        models.append(model)

    db.session.add_all(models)
    db.session.commit()

    print(f'✅ Imported {len(models)} models from Excel.')
