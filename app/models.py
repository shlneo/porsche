
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
    phone = db.Column(db.String(), unique=True)
    password = db.Column(db.String())
    is_admin = db.Column(db.Boolean, default=False)
    last_active = db.Column(db.DateTime, nullable=False, default=current_belarus_time)
    begin_time = db.Column(db.DateTime, nullable=False, default=current_belarus_time)
    reset_password_token = db.Column(db.String(255), nullable=True)
    reset_password_expires = db.Column(db.DateTime, nullable=True)
 
class Model(db.Model):
    """Porsche."""
    __tablename__ = "models"

    id = db.Column(db.Integer, primary_key=True)
    series = db.Column(db.String(50), nullable=False)              # Основная серия, например "911", "Taycan"
    subseries = db.Column(db.String(100), nullable=True)           # Подсерия или версия
    description = db.Column(db.String(), nullable=True)         # Краткое описание модели
   
    engine = db.Column(db.String(100), nullable=True)              # Тип двигателя
    drive = db.Column(db.String(20), nullable=True)                # Привод (RWD/AWD)
    transmission = db.Column(db.String(50), nullable=True)         # Коробка передач

    is_gazoline = db.Column(db.Boolean, default=False)             # Признак бензиновой модели
    is_electric = db.Column(db.Boolean, default=False)             # Признак электромобиля
    is_hybrid = db.Column(db.Boolean, default=False)               # Признак гибрида
    created_at = db.Column(db.DateTime, nullable=False, default=current_belarus_time)  # Время добавления записи

    power = db.Column(db.Float)
    to100 = db.Column(db.Float)
    top_speed = db.Column(db.Float)
    range = db.Column(db.Float)


    def __repr__(self):
        return f"<Model {self.series} {self.subseries or ''} ({self.power} hp)>"