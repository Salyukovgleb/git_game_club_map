import os
from flask import Flask, request, redirect, render_template, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask import send_from_directory
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
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
        username = request.form['Логин']
        name = request.form['Имя']
        password = request.form['Пароль']

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
            flash('Вход выполнен успешно!', 'success')
            return redirect('/index')  # Измененный редирект
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

    # Используйте атрибут image_path объекта user, чтобы передать путь к изображению в шаблон
    # Если image_path не определен, вы можете установить значение по умолчанию
    image_path = user.image_path if user.image_path else 'default.jpg'

    return render_template('index.html', image_path=image_path)

@app.route('/logout')
def logout():
    # Удаление данных пользователя из сессии
    session.pop('user_id', None)
    flash('Вы успешно вышли из системы.', 'success')
    return redirect('/login')


@app.route('/get_club_details', methods=['GET'])
def get_club_details():
    club_id = request.args.get('id')
    for club in clubs_data['clubsData']:
        if str(club['id']) == club_id:
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










if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5001)


