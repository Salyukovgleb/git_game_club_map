import requests

# Обновлённый запрос, фокусирующийся на поиске по тегу "place" для города Ташкент
query = """
[out:json][timeout:50];
// Ищем объекты с тегом "place" для Ташкента
(
  relation["place"="city"]["name"~"Ташкент",i];
);
// Выводим результат включая геометрию
out body;
>;
out skel qt;
"""

# URL Overpass API
url = "https://overpass-api.de/api/interpreter"

# Отправляем запрос
response = requests.post(url, data={'data': query})

# Проверяем статус ответа
if response.status_code == 200:
    # Преобразуем ответ в JSON
    data = response.json()

    # Проверяем наличие элементов в ответе
    if data['elements']:
        # Выводим найденные элементы
        for element in data['elements']:
            # Проверяем наличие геометрии и выводим её
            if 'geometry' in element:
                print("Найдена геометрия:", element['geometry'])
                break
        else:
            print("Геометрия не найдена.")
    else:
        print("Данные о границах Ташкента не найдены.")
else:
    print(f"Ошибка запроса к API: статус {response.status_code}")
