# Документация проекта Eventra

## Введение

Eventra - это веб-приложение для поиска и организации клубных мероприятий в различных городах. Приложение позволяет пользователям находить интересующие их события, клубы и другие развлекательные места. Эта документация предоставляет подробное описание всех аспектов проекта, от установки до деталей реализации и развертывания.

## Установка и начальная настройка

Для начала работы с проектом необходимо выполнить несколько шагов, включающих клонирование репозитория и установку зависимостей.

### Клонирование репозитория

Для получения последней версии проекта используйте следующую команду:

```bash
git clone https://github.com/your_username/eventra.git
cd eventra
```
### Установка зависимостей

Проект использует ряд сторонних библиотек, которые необходимо установить. Это можно сделать с помощью следующей команды:

```bash
pip install -r requirements.txt

```

### Конфигурация

Перед началом работы необходимо настроить ключи API для интеграции с внешними сервисами, такими как Yandex Maps:

```html
<!-- Вставьте ваш ключ API ниже -->
<script src="https://api-maps.yandex.ru/2.1/?apikey=ВАШ_КЛЮЧ_API&lang=ru_RU"></script>
```
Эти шаги подготовят среду для запуска и дальнейшей разработки приложения.

## Архитектура проекта

Eventra разработано с использованием популярного веб-фреймворка Flask, что обеспечивает гибкость и масштабируемость приложения. Проект организован по модели MVC (Model-View-Controller), что упрощает разделение логики приложения и пользовательского интерфейса.

### Структура каталогов

Проект состоит из нескольких основных каталогов:

- `static/`: Содержит статические файлы, такие как CSS, JavaScript и изображения.
- `templates/`: Хранит шаблоны HTML для отображения контента в браузере.
- `data/`: Может использоваться для хранения данных в формате JSON, которые приложение использует для работы.

#### Пример структуры каталога

```plaintext
/eventra
    /static
        /css
        /js
        /images
    /templates
    /data
    app.py
    config.py
    requirements.txt
```

### Описание ключевых файлов

- `app.py`: Главный файл приложения, содержащий логику маршрутизации и взаимодействия с пользователем.
- `config.py`: Файл конфигурации, который может использоваться для хранения параметров окружения и конфигураций API.
- `requirements.txt`: Список зависимостей для Python, необходимых для работы приложения.


### Frontend часть


## Фронтенд

Фронтенд Eventra использует стандартные веб-технологии: HTML, CSS и JavaScript, что обеспечивает кроссплатформенную совместимость и доступность.

#### `index.html`
**Описание:** Это, скорее всего, главная страница сайта. Она служит точкой входа для пользователей, предоставляя ссылки на другие разделы приложения, такие как вход в систему, регистрация и список клубов или мероприятий.

**Типичные кнопки:**
- **Вход:** Перенаправляет на страницу входа, где пользователи могут ввести свои учетные данные.
- **Регистрация:** Ведет на форму регистрации.
- **Просмотр клубов:** Кнопка, которая может использоваться для перехода к поиску или карте, показывающей различные клубы.

**Фрагмент кода:**
```html
<nav>
    <ul>
        <li><a href="{{ url_for('login') }}">Вход</a></li>
        <li><a href="{{ url_for('register') }}">Регистрация</a></li>
        <li><a href="{{ url_for('explore_clubs') }}">Просмотр клубов</a></li>
    </ul>
</nav>
```
- `profile.html`
Описание: Страница профиля пользователя, позволяющая просматривать и редактировать личные данные, такие как имя, адрес электронной почты и пароль.

### Типичные кнопки:

- `Сохранить изменения`: Сохраняет внесенные изменения в профиле пользователя.
- `Загрузить фото`: Позволяет пользователю загрузить или изменить свое профильное изображение.

```html
<form action="{{ url_for('update_profile') }}" method="post" enctype="multipart/form-data">
    <input type="text" name="name" value="{{ user.name }}">
    <input type="email" name="email" value="{{ user.email }}">
    <input type="password" name="password">
    <button type="submit">Сохранить изменения</button>
</form>
```

- `login.html`
Описание: Страница для входа в систему, где пользователи могут войти, используя свой логин и пароль.

Типичные кнопки:

- `Войти`: Обрабатывает данные формы и, если данные верны, предоставляет доступ к пользовательскому профилю.

```html
<form action="{{ url_for('login') }}" method="post">
    <input type="text" name="username" placeholder="Имя пользователя">
    <input type="password" name="password" placeholder="Пароль">
    <button type="submit">Войти</button>
</form>
```
- `register.html`
Описание: Форма регистрации новых пользователей, требующая ввода данных, таких как имя пользователя, электронная почта и пароль.

Типичные кнопки:

- `Зарегистрироваться`: Создает новую учетную запись пользователя и перенаправляет на главную страницу или страницу профиля.
```html
<form action="{{ url_for('register') }}" method="post">
    <input type="text" name="username" placeholder="Имя пользователя" required>
    <input type="email" name="email" placeholder="Email" required>
    <input type="password" name="password" placeholder="Пароль" required>
    <button type="submit">Зарегистрироваться</button>
</form>
```
#### `club_details.html`
**Описание:** Страница с детальной информацией о клубе, включая описание, местоположение и предстоящие события. Эта страница позволяет пользователям получать подробную информацию о конкретных клубах.

**Типичные кнопки:**

`Забронировать место`: Позволяет пользователю забронировать место на предстоящее событие в клубе.

`Подписаться на новости клуба`: Подписка на рассылку новостей и обновлений от клуба.


```html
<div class="club-details">
    <h1>{{ club.name }}</h1>
    <p>{{ club.description }}</p>
    <button onclick="bookEvent()">Забронировать место</button>
    <button onclick="subscribeClub()">Подписаться на новости</button>
</div>
```

- `map.html`

Описание: Интерактивная карта для поиска клубов по городу. Эта страница позволяет пользователям визуально исследовать различные места и быстро получать информацию о них.

Типичные кнопки:

`Подробнее о клубе`: Отображает подробную информацию о выбранном на карте клубе.

`Построить маршрут`: Помогает пользователю построить маршрут от текущего местоположения до выбранного клуба.
```js
<div id="map"></div>
<script>
    function showClubDetails(clubId) {
        // Функция для отображения подробностей о клубе
    }
    function routeToClub(clubId) {
        // Функция для построения маршрута
    }
</script>
```
`admins.html` - Страница администратора для управления содержанием сайта и пользователями. Эта страница предоставляет инструменты для добавления, редактирования или удаления информации о клубах, а также управления учетными записями пользователей.

Типичные кнопки:

- `Добавить клуб`: Открывает форму для ввода данных нового клуба.
- `Редактировать данные`: Позволяет редактировать информацию о существующих клубах.
- `Удалить клуб`: Удаляет клуб из базы данных.

```html
<div class="admin-panel">
    <button onclick="addClub()">Добавить клуб</button>
    <button onclick="editClub(clubId)">Редактировать</button>
    <button onclick="deleteClub(clubId)">Удалить</button>
</div>
```
## Расширение функциональности

### Интеграция внешних API

Eventra может интегрировать различные внешние API для улучшения пользовательского опыта и расширения функциональных возможностей, например, API карт для отображения местоположений клубов и API социальных сетей для управления аккаунтами и мероприятиями.

**Пример интеграции API карт:**
```html
<script src="https://api-maps.yandex.ru/2.1/?apikey=ВАШ_КЛЮЧ_API&lang=ru_RU"></script>
<script>
    // Инициализация карты и добавление меток
    ymaps.ready(init);
    function init() {
        var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 10
        });
        // Добавление меток на карту
    }
</script>
```
## Работа с базой данных

Для управления данными о пользователях, клубах и событиях Eventra использует систему базы данных, что позволяет эффективно хранить, извлекать и обновлять информацию в реальном времени.

```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///eventra.db'
db = SQLAlchemy(app)

class Club(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=True)

# Добавление нового клуба в базу данных
def add_club(name, description):
    new_club = Club(name=name, description=description)
    db.session.add(new_club)
    db.session.commit()
```

## Улучшение взаимодействия пользователя

Улучшение пользовательского интерфейса и взаимодействия может включать в себя внедрение адаптивного дизайна, интерактивных элементов UI и улучшенных уведомлений для пользователей.
```js
// Показать уведомление пользователю
function showNotification(message) {
    let notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}
```

## Бэкенд 

Eventra использует Flask, легковесный веб-фреймворк на Python, который предоставляет гибкие инструменты для создания веб-приложений. Flask позволяет разработчикам быстро строить мощные веб-сервисы с использованием простого, но мощного синтаксиса.

### Основные компоненты бэкенда

#### `app.py`
**Описание:** Основной файл приложения, который настраивает и запускает веб-сервер, обрабатывает маршрутизацию запросов, и управляет сессиями.


```python
from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    # Проверка учетных данных
    return redirect(url_for('profile'))

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('home'))
```

### Работа с базой данных
Flask может использовать различные системы управления базами данных через расширения, такие как Flask-SQLAlchemy, что позволяет легко интегрировать модели данных и производить операции CRUD (создание, чтение, обновление, удаление).
```python
from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///eventra.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username
```

### Аутентификация и авторизация

Аутентификация пользователей в Eventra обеспечивается через систему входа, которая проверяет учетные данные перед предоставлением доступа к защищенным ресурсам. Flask поддерживает различные методы аутентификации, включая сессии и токены.
```python
@app.route('/login', methods=['POST'])
def login():
    user = User.query.filter_by(username=request.form['username']).first()
    if user and user.password == request.form['password']:
        session['user_id'] = user.id
        return redirect(url_for('dashboard'))
    return 'Login Failed'
```
### API

Eventra может предоставлять данные через API, что позволяет интегрировать систему с другими приложениями и сервисами. Flask упрощает создание RESTful API с помощью расширений, таких как Flask-RESTful.
```python
from flask_restful import Resource, Api

api = Api(app)

class UserAPI(Resource):
    def get(self, id):
        user = User.query.get(id)
        if not user:
            return {'error': 'User not found'}, 404
        return {'username': user.username}

api.add_resource(UserAPI, '/api/users/<int:id>')
```

## Безопасность в Eventra

Безопасность является критически важным аспектом любого веб-приложения. Eventra использует ряд методов для обеспечения безопасности данных и транзакций пользователей.

### Хэширование паролей

Для защиты учетных данных пользователей Eventra использует хэширование паролей. Flask поддерживает интеграцию с Werkzeug, который предлагает безопасные функции для хэширования.

**Пример использования хэширования:**
```python
from werkzeug.security import generate_password_hash, check_password_hash

user.password = generate_password_hash('yourpassword')
if check_password_hash(user.password, 'yourpassword'):
    print('Password is correct')
```

### HTTPS и SSL/TLS
Для защиты данных, передаваемых между клиентом и сервером, Eventra должно использовать HTTPS, что обеспечивается настройкой SSL/TLS сертификатов.
```python
from flask import Flask
from werkzeug.serving import run_simple

app = Flask(__name__)

if __name__ == '__main__':
    run_simple('localhost', 443, app, ssl_context=('path/to/cert.pem', 'path/to/key.pem'))
```

### CSRF-защита

Cross-Site Request Forgery (CSRF) — это атака, которая заставляет конечного пользователя выполнить нежелательные действия на веб-сайте, на котором он в настоящее время аутентифицирован. Flask-WTF предлагает легкую интеграцию для защиты от CSRF.
```python
from flask_wtf import CSRFProtect

app = Flask(__name__)
csrf = CSRFProtect(app)

app.config['SECRET_KEY'] = 'your_secret_key'
```

## Производительность и масштабируемость Eventra

Производительность является ключевым фактором для обеспечения качественного пользовательского опыта, особенно при работе с большим количеством данных и пользователями.

### Кэширование

Кэширование — эффективный способ ускорить приложение, уменьшив количество запросов к серверу или базе данных.

**Пример интеграции кэширования в Flask:**
```python
from flask_caching import Cache

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/')
@cache.cached(timeout=50)
def home():
    return render_template('index.html')
```

### Асинхронная обработка

Использование асинхронной обработки может значительно улучшить производительность приложения, позволяя обрабатывать множество запросов одновременно.
```python
from flask import Flask, jsonify
import asyncio

app = Flask(__name__)

async def get_data():
    # Имитация длительной операции
    await asyncio.sleep(2)
    return {'data': 'Some data'}

@app.route('/data')
async def data():
    data = await get_data()
    return jsonify(data)
```
### Масштабирование

Для обеспечения масштабирования Eventra может быть развернуто в облачной инфраструктуре, которая поддерживает горизонтальное масштабирование.

```doctest
# Dockerfile
FROM python:3.8
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["python", "app.py"]

# Команды для сборки и запуска контейнера
docker build -t eventra .
docker run -p 5000:5000 eventra
```

## Мониторинг и логирование

Мониторинг и логирование критически важны для диагностики и решения проблем в приложении. Eventra может использовать инструменты как Flask-Logging для логирования и Prometheus для мониторинга.


```python
import logging
from flask import Flask

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

@app.route('/')
def home():
    app.logger.debug('Запрос на главную страницу')
    return 'Hello, Eventra!'
```

## JSON-файлы в Eventra

Приложение Eventra использует несколько JSON-файлов для хранения статических данных, которые необходимы для работы карты, отображения информации о клубах и других функций.

### `clubsData.json`

**Описание:** Этот файл содержит информацию о различных клубах. Обычно включает название клуба, описание, адрес, контактную информацию, а также возможно рейтинг и отзывы.


```json
{
    "clubsData": [
        {
            "id": 1,
            "name": "DENVER GAME CLUB",
            "description": "4 \u043a\u0430\u0431\u0438\u043d\u043a\u0438 5x5 + \u0412\u0438\u043f & \u041b\u044e\u043a\u0441 \u043a\u0430\u0431\u0438\u043d\u043a\u0438. \u041f\u0435\u0440\u0435\u0444\u0435\u0440\u0438\u044f \u043e\u0442 Redragon \u0438 HyperX",
            "location": {
                "address": "\u200b\u0427\u0438\u043b\u0430\u043d\u0437\u0430\u0440 \u0426 \u043a\u0432\u0430\u0440\u0442\u0430\u043b \u043c\u0438\u043a\u0440\u043e\u0440\u0430\u0439\u043e\u043d, 1\u0430/1\u200b1 \u044d\u0442\u0430\u0436",
                "coordinates": [
                    41.315569,
                    69.279737
                ],
                "time": "24/7"
            },
            "photos": [
                "https://lh3.googleusercontent.com/p/AF1QipMa8c9hEFJkd7tR6CXnOP79BLgSuVpOBgJYwuh-=s1360-w1360-h1020-rw",
                "https://i4.photo.2gis.com/images/branch/0/30258560163944869_b67b_328x170.jpg"
            ],
            "reviews": [
                {
                    "user": "Ulugbek Khudoynazarov",
                    "rating": 5,
                    "text": "\u041e\u0447\u0435\u043d\u044c \u043a\u0440\u0443\u0442\u043e\u0435 \u043c\u0435\u0441\u0442\u043e! \u041c\u043e\u0449\u043d\u044b\u0435 \u043a\u043e\u043c\u043f\u044b, \u0443\u044e\u0442\u043d\u0430\u044f \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u0430, \u0431\u0430\u0440 \u0441 \u0445\u043e\u0442-\u0434\u043e\u0433\u0430\u043c\u0438 \u0438 \u043c\u043d\u043e\u0433\u0438\u043c\u0438 \u0434\u0440\u0443\u0433\u0438\u043c\u0438 \u0441\u043d\u0435\u043a\u0430\u043c\u0438. \u041f\u0440\u0438\u0445\u043e\u0434\u0438\u0442\u0435 \u043d\u0435 \u043f\u043e\u0436\u0430\u043b\u0435\u0435\u0442\u0435!"
                }
            ],
            "administration": {
                "contact": "-",
                "number": "+998 99\u2012022\u201268\u201268, +998 99\u2012023\u201268\u201268"
            },
            "services": {
                "Wi-Fi": true,
                "bar": true,
                "kitchen": true,
                "consoles": true,
                "games": true,
                "relaxation_zones": true
            },
            "prices": {
                "pc_rent_STANDART": 14400,
                "pc_rent_VIP": 17700,
                "special_offers": "\u0421\u043a\u0438\u0434\u043a\u0430 20% \u043f\u043e\u0441\u043b\u0435 22:00"
            },
            "working_hours": "9:00 - 24:00",
            "club_card": {
                "loyalty_program": true,
                "benefits": "\u0421\u043a\u0438\u0434\u043a\u0438 \u043f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u044b\u043c \u043a\u043b\u0438\u0435\u043d\u0442\u0430\u043c, \u0431\u043e\u043d\u0443\u0441\u043d\u044b\u0435 \u0438\u0433\u0440\u044b"
            },
            "comments": "\u0414\u043e\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u044c\u043d\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0438 \u0430\u043a\u0446\u0438\u0438 \u0434\u043e\u0441\u0442\u0443\u043f\u043d\u044b \u043d\u0430 \u0441\u0430\u0439\u0442\u0435 \u043a\u043b\u0443\u0431\u0430"
        }
```

### `metro_stations.json`

Описание: Этот файл используется для хранения данных о станциях метро, включая их названия и координаты. Эти данные могут быть использованы для отображения местоположения станций на карте и помощи пользователям в навигации.
```json
[
    {
        "name": "Дустлик 2",
        "coordinates": [41.294681, 69.323408],
        "line": "Наземная кольцевая линия",
        "timetable": {
            "Вперед": ["5:00", "5:15", "5:30", "5:45", "6:00", "6:15"],
            "Назад": ["5:34", "5:49", "6:04", "6:19", "6:34", "6:49"]
        }
    },
    {
        "name": "Ахангаран",
        "coordinates": [41.297678, 69.349739],
        "line": "Наземная кольцевая линия",
        "timetable": {
            "Вперед": ["5:04", "5:19", "5:34", "5:49", "6:04", "6:19"],
            "Назад": ["5:30", "5:45", "6:00", "6:15", "6:30", "6:45"]
        }
    }
```
### `poligons.json`

Описание: Файл poligons.json содержит геометрические данные, которые могут быть использованы для отображения определенных областей на карте, например, районов города или зон покрытия услуг.

```json
[
    {
        "id": 1,
        "name": "Zone 1",
        "coordinates": [
            [40.713955826286046, -74.00640106201172],
            [40.71277523078251, -74.00432014465332],
            [40.71094993032014, -74.00713348388672]
        ]
    },
    {
        "id": 2,
        "name": "Zone 2",
        "coordinates": [
            [40.70930336532742, -74.00924682617188],
            [40.70863301850067, -74.0076456079483],
            [40.70742776360569, -74.00910377502441]
        ]
    }
]
```



