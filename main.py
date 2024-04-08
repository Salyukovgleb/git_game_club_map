from flask import Flask, request, redirect, render_template, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask import send_from_directory
import json
from math import radians, cos, sin, asin, sqrt
from admin import admin_bp
import os
import secrets
from functools import wraps

app = Flask(__name__)
app.register_blueprint(admin_bp, url_prefix='/admin')
app.config['SECRET_KEY'] = 'your-secret-key'

# Создаем папку instance, если она не существует
if not os.path.exists(app.instance_path):
    os.makedirs(app.instance_path)

# Конфигурируем приложение для использования базы данных в папке instance
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.instance_path, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
db = SQLAlchemy(app)



os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

with open('static/clubsData.json') as f:
    clubs_data = json.load(f)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    image_path = db.Column(db.String(128), nullable=True)
    # Связь с дополнительной информацией пользователя
    profile = db.relationship('UserProfile', backref='user', uselist=False)

class UserProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return '<Admin %r>' % self.username
def insert_main_admin():
    main_admin_username = 'sp1ngo'
    main_admin = Admin.query.filter_by(username=main_admin_username).first()
    if not main_admin:
        main_admin = Admin(username=main_admin_username)
        db.session.add(main_admin)
        db.session.commit()

class DeveloperAPIKey(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    developer_name = db.Column(db.String(100), nullable=False)
    api_key = db.Column(db.String(128), unique=True, nullable=False)

    def __repr__(self):
        return '<DeveloperAPIKey %r>' % self.developer_name


with app.app_context():
    db.create_all()
    insert_main_admin()


def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('Authorization')
        if api_key:
            api_key = api_key.replace('Bearer ', '', 1)
            developer = DeveloperAPIKey.query.filter_by(api_key=api_key).first()
            if developer:
                return f(*args, **kwargs)
        return jsonify({"error": "Unauthorized"}), 401
    return decorated_function

@app.route('/')
def home():
    # Если пользователь уже вошел, перенаправить на главную страницу
    if 'user_id' in session:
        return redirect('/index')
    # Иначе, перенаправить на страницу входа
    return redirect('/login')




@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        name = request.form['name']
        password = request.form['password']


        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Пользователь с таким логином уже существует.', 'error')
            return redirect('/register')

        password_hash = generate_password_hash(password)
        user = User(username=username, name=name, password_hash=password_hash)
        db.session.add(user)
        db.session.commit()
        flash('Регистрация успешно завершена! Теперь вы можете войти.', 'success')
        return redirect('/login')
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['Логин']
        password = request.form['Пароль']
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['username'] = user.username  # Добавьте эту строку
            flash('Вход выполнен успешно!', 'success')
            return redirect('/index')
        else:
            flash('Неверный логин или пароль.', 'error')
    return render_template('login.html')



@app.route('/index')
def index():
    # Проверка, что пользователь вошел в систему
    if 'user_id' not in session:
        flash('Пожалуйста, войдите в систему для доступа к главной странице.', 'error')
        return redirect('/login')

    user_id = session['user_id']
    user = User.query.get(user_id)
    if not user:
        flash('Пользователь не найден.', 'error')
        return redirect('/login')


    image_path = user.image_path if user.image_path else 'default.jpg'

    return render_template('index.html', image_path=image_path)

@app.route('/logout')
def logout():
    # Удаление данных пользователя из сессии
    session.pop('user_id', None)
    flash('Вы успешно вышли из системы.', 'success')
    return redirect('/login')


@app.route('/get-club-details', methods=['GET'])
def get_club_details():
    club_id = request.args.get('club_id')
    with open('static/clubsData.json') as f:
        clubs_data = json.load(f)
    club = next((club for club in clubs_data['clubsData'] if str(club['id']) == club_id), None)
    if club:
        return jsonify(club)
    return jsonify({"error": "Club not found"}), 404



@app.route('/user_info')
def user_info():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'User not logged in'}), 401

    user = User.query.get(user_id)
    profile = UserProfile.query.filter_by(user_id=user_id).first()  # Получаем дополнительные данные пользователя
    if user:
        return jsonify({
            'username': user.username,
            'name': user.name,
            'phone': profile.phone if profile else '',  # Добавляем номер телефона
            'email': profile.email if profile else ''  # Добавляем email
        })
    else:
        return jsonify({'error': 'User not found'}), 404


@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'user_id' not in session:
        return redirect('/login')
    file = request.files['profile_image']
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        user_id = session['user_id']
        user = User.query.get(user_id)
        user.image_path = filepath
        db.session.commit()
        return redirect('/profile')
    return 'Файл не загружен', 400

@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return redirect('/login')

    user_id = session['user_id']
    user = User.query.get(user_id)
    if not user:
        flash('Пользователь не найден', 'error')
        return redirect('/')

    # Проверяем, есть ли путь к изображению в базе данных
    image_path = user.image_path if user.image_path else 'default_image.jpg'  # Используйте имя файла изображения по умолчанию
    return render_template('profile.html', user=user, image_path=image_path)


@app.route('/update_profile', methods=['POST'])
def update_profile():
    if 'user_id' not in session:
        return redirect('/login')

    user_id = session['user_id']
    user = User.query.get(user_id)
    if not user:
        flash('Пользователь не найден', 'error')
        return redirect('/profile')

    user.name = request.form['name']
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.session.add(profile)
    profile.phone = request.form['phone']
    profile.email = request.form['email']

    db.session.commit()
    flash('Профиль успешно обновлен', 'success')
    return redirect('/profile')


def haversine(lon1, lat1, lon2, lat2):
    # Конвертация десятичных координат в радианы
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # Формула гаверсинуса
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    r = 6371  # Радиус Земли в километрах
    return c * r


@app.route('/find_nearest_clubs', methods=['GET'])
def find_nearest_clubs():
    location = request.args.get('location', '').split(',')
    rating = float(request.args.get('rating', 0))
    maxDistance = float(request.args.get('maxDistance', 5))  # Максимальное расстояние в км

    if not location:
        return jsonify({'error': 'Location not provided'}), 400

    lat, lon = float(location[0]), float(location[1])

    suitable_clubs = []
    for club in clubs_data['clubsData']:
        club_lat, club_lon = club['location']['coordinates']
        distance = haversine(lon, lat, club_lon, club_lat)

        # Средний рейтинг клуба
        total_rating = sum(review['rating'] for review in club['reviews'])
        average_rating = total_rating / len(club['reviews']) if club['reviews'] else 0

        if distance <= maxDistance and average_rating >= rating:
            club['distance'] = distance
            suitable_clubs.append(club)

    return jsonify(suitable_clubs)


@app.route('/update_club/<int:club_id>', methods=['POST'])
def update_club(club_id):
    # Тут ваш код для обновления информации о клубе
    # Например, получение данных формы и обновление данных в базе
    app.register_blueprint(admin_bp, url_prefix='/admin')


@app.route('/metro-map')
def metro_map():
    with open('static/metro_stations.json') as f:
        stations = json.load(f)
    return render_template('map.html', stations=stations)



@app.route('/get-poligons')
def get_poligons():
    return app.send_static_file('path/to/poligons.json')


@app.route('/developer/register', methods=['GET', 'POST'])
def register_developer():
    if request.method == 'POST':
        developer_name = request.form.get('developer_name')
        if not developer_name:
            return render_template('register_developer.html', message="Имя разработчика обязательно к заполнению")
        
        # Проверяем, существует ли уже разработчик с таким именем
        existing_developer = DeveloperAPIKey.query.filter_by(developer_name=developer_name).first()
        if existing_developer:
            # Если разработчик найден, возвращаем его существующий API-ключ
            return render_template('register_developer.html', message=f"Разработчик уже зарегистрирован. Ваш API-ключ: {existing_developer.api_key}")
        
        # Если разработчик не найден, создаем новый API-ключ
        new_api_key = secrets.token_urlsafe(32)
        new_developer = DeveloperAPIKey(developer_name=developer_name, api_key=new_api_key)
        db.session.add(new_developer)
        db.session.commit()

        # Возвращаем шаблон с сообщением об успешной регистрации и новым API-ключом
        return render_template('register_developer.html', message=f"Регистрация успешна. Ваш API-ключ: {new_api_key}")
    
    return render_template('register_developer.html')




if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5001)


