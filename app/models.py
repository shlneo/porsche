from . import db
from sqlalchemy import Numeric
from flask_login import UserMixin
from datetime import datetime, timedelta
from decimal import Decimal, InvalidOperation

def to_decimal_3(value):
    try:
        return Decimal(value).quantize(Decimal('0.001'))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal('0.000')

def current_utc_time():
    return datetime.utcnow() + timedelta(hours=3)

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
    last_active = db.Column(db.DateTime, nullable=False, default=current_utc_time)
    begin_time = db.Column(db.DateTime, nullable=False, default=current_utc_time)
    reset_password_token = db.Column(db.String(255), nullable=True)
    reset_password_expires = db.Column(db.DateTime, nullable=True)
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade="all, delete-orphan")
    

class Car(db.Model):
    __tablename__ = 'cars'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True)
    model = db.Column(db.String(100), nullable=False)  # Например: 911, Cayenne
    generation = db.Column(db.String(100))  # Поколение модели
    year = db.Column(db.Integer)  # Год выпуска
    price = db.Column(Numeric(12, 2))  # Цена
    horsepower = db.Column(db.Integer)  # Лошадиные силы
    engine_type = db.Column(db.String(50))  # Бензин, дизель, электро
    transmission = db.Column(db.String(50))  # Автомат, механика
    drive_type = db.Column(db.String(50))  # Полный, задний, передний
    color = db.Column(db.String(50))  # Цвет
    interior_color = db.Column(db.String(50))  # Цвет салона
    mileage = db.Column(db.Integer)  # Пробег (0 для новых)
    vin = db.Column(db.String(17), unique=True)  # VIN код
    is_new = db.Column(db.Boolean, default=True)  # Новый/с пробегом
    is_available = db.Column(db.Boolean, default=True)  # Доступен для продажи
    description = db.Column(db.Text)  # Описание
    features = db.Column(db.JSON)  # Дополнительные характеристики
    created_at = db.Column(db.DateTime, default=current_utc_time)
    updated_at = db.Column(db.DateTime, default=current_utc_time, onupdate=current_utc_time)
    
    images = db.relationship('CarImage', backref='car', lazy=True, cascade="all, delete-orphan")
    test_drives = db.relationship('TestDrive', backref='car', lazy=True)
    orders = db.relationship('Order', backref='car', lazy=True)
    
class CarImage(db.Model):
    __tablename__ = 'car_images'
    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    is_main = db.Column(db.Boolean, default=False) 
    order_index = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=current_utc_time)

class TestDrive(db.Model):
    __tablename__ = 'test_drives'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'), nullable=False)
    scheduled_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, completed, cancelled
    duration = db.Column(db.Integer, default=30)
    notes = db.Column(db.Text)
    admin_notes = db.Column(db.Text)  
    created_at = db.Column(db.DateTime, default=current_utc_time)
    updated_at = db.Column(db.DateTime, default=current_utc_time, onupdate=current_utc_time)

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('cars.id'), nullable=False)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    total_price = db.Column(Numeric(12, 2), nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, in_production, shipped, delivered, cancelled
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, refunded
    delivery_address = db.Column(db.Text)
    delivery_date = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=current_utc_time)
    updated_at = db.Column(db.DateTime, default=current_utc_time, onupdate=current_utc_time)
        
class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True, nullable=False)
    message = db.Column(db.String(140), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=current_utc_time)
