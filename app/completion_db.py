import os
from werkzeug.security import generate_password_hash

def create_database(app, db):
    from .models import User, Car
    with app.app_context():
        # db.drop_all()
        db.create_all()
        add_data_in_db(db)
        
def is_db_empty():
    from .models import User, Car
    return all([
        User.query.count() == 0,
        Car.query.count() == 0,
    ])

       
def add_data_in_db(db):
    if is_db_empty():
        from .models import User, Car
        print('Filling is in progress...')

        ### USER DATA ###
        # users_data = [
        #     ('Инженер-программист', os.getenv('adminemail1'), os.getenv('adminname1'), os.getenv('adminsecondname1'), os.getenv('adminpatr1'), os.getenv('adminphone1'), True, False, 14),
        # ]

        # for post, email, first_name, last_name, patronymic_name, phone, is_admin, is_auditor, organization_id in users_data:
        #     user = User(
        #         post = post,
        #         email=email,
        #         first_name=first_name,
        #         last_name=last_name,
        #         patronymic_name=patronymic_name,
        #         phone=phone,
        #         is_admin=is_admin,
        #         is_auditor=is_auditor,
        #         organization_id = organization_id,
        #         password=generate_password_hash(os.getenv('userpass'))
        #     )
        #     db.session.add(user)
        # db.session.commit()
        ### ----------- ###
        
        print('The filling is finished!')
    else:
        print('The database already contains the data!')