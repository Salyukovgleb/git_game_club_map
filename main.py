from flask import Flask, request, redirect, render_template, flash, session, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

with open('static/clubsData.json') as f:
    clubs_data = json.load(f)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)


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
    if 'user_id' in session:
        return render_template('index.html')
    else:
        flash('Пожалуйста, войдите в систему для доступа к главной странице.', 'error')
        return redirect('/login')

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


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5001)


