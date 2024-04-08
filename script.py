import json
import re

# Функция для исправления JavaScript объектов для их преобразования в JSON
def convert_js_to_json(js_text):
    # Первоначальное выражение для поиска объектов JavaScript, чтобы заменить их на JSON
    # Это выражение предполагает, что объекты начинаются с '{' и заканчиваются на '}', 
    # а также что внутри объектов ключи не содержат символов '{', '}', или ':'
    js_obj_pattern = r'(\{[\s\S]+?\})'
    
    # Функция замены, которая будет вызываться для каждого найденного соответствия шаблону
    def replace_with_json(match):
        # Получаем объект JavaScript как строку
        js_obj_str = match.group(1)
        # Заменяем одинарные кавычки на двойные, игнорируя строковые литералы
        js_obj_str = re.sub(r"(\W)'", r'\1"', js_obj_str)
        js_obj_str = re.sub(r"'(\W)", r'"\1', js_obj_str)
        # Заменяем `True`, `False`, `None` на их JSON-эквиваленты
        js_obj_str = js_obj_str.replace('True', 'true').replace('False', 'false').replace('None', 'null')
        return js_obj_str
    
    # Применяем регулярное выражение и функцию замены к тексту JavaScript
    json_text = re.sub(js_obj_pattern, replace_with_json, js_text)
    
    # Удаляем начальное объявление переменной var, если оно есть
    json_text = re.sub(r'var\s+\w+\s*=\s*', '', json_text, count=1)
    return json_text

# Путь к исходному файлу JavaScript
js_file_path = 'static/metro.js'

# Чтение данных из JavaScript файла
with open(js_file_path, 'r', encoding='utf-8') as file:
    js_data = file.read()

# Преобразование данных в формат JSON
json_data = convert_js_to_json(js_data)

# Путь для сохранения сконвертированного JSON файла
json_file_path = 'static/metro_stations.json'

# Запись сконвертированной JSON строки в файл
with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json_file.write(json_data)

# Возвращаем путь к сконвертированному файлу
json_file_path
