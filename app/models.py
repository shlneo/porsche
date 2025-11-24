from . import db
from sqlalchemy import Numeric
from flask_login import UserMixin
from datetime import datetime
from zoneinfo import ZoneInfo
from decimal import Decimal, InvalidOperation

def current_belarus_time():
    return datetime.now(ZoneInfo("Europe/Minsk"))

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True)
    last_name = db.Column(db.String())
    first_name = db.Column(db.String())
    patronymic_name = db.Column(db.String())
    adress = db.Column(db.String(), default=None)
    phone = db.Column(db.String(), unique=True)
    password = db.Column(db.String())
    is_admin = db.Column(db.Boolean, default=False)
    is_dealer = db.Column(db.Boolean, default=False)
    begin_time = db.Column(db.DateTime, nullable=False, default=current_belarus_time)
 
class Model(db.Model):
    __tablename__ = "models"

    id = db.Column(db.Integer, primary_key=True)
    series = db.Column(db.String(50), nullable=False)              
    subseries = db.Column(db.String(100), nullable=True)           
    description = db.Column(db.String(), nullable=True)        
   
    engine = db.Column(db.String(100), nullable=True)             
    drive = db.Column(db.String(20), nullable=True)               
    transmission = db.Column(db.String(50), nullable=True)        

    is_gazoline = db.Column(db.Boolean, default=False)             
    is_electric = db.Column(db.Boolean, default=False)             
    is_hybrid = db.Column(db.Boolean, default=False)               
    created_at = db.Column(db.DateTime, nullable=False, default=current_belarus_time)  

    power = db.Column(db.Float)
    to100 = db.Column(db.Float)
    top_speed = db.Column(db.Float)
    range = db.Column(db.Float)

    def __repr__(self):
        return f"<Model {self.series} {self.subseries or ''} ({self.power} hp)>"