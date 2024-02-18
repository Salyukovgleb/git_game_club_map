ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
        center: [41.311081, 69.240562], // Центр карты (Ташкент)
        zoom: 12
    });

    // Загрузка данных из файла clubsData.json
    fetch('static/clubsData.json').then(response => response.json()).then(data => {
        data.clubsData.forEach(club => {
            var balloonContent = `<strong>${club.name}</strong><br>${club.location.address}<br>Часы работы: ${club.working_hours}<br><button onclick="showDetails('${club.id}')">Подробнее</button>`;
            var placemark = new ymaps.Placemark(club.location.coordinates, {
                balloonContent: balloonContent
            }, {
                preset: 'islands#redDotIcon'
            });

            myMap.geoObjects.add(placemark);
        });
    }).catch(error => console.error('Ошибка при загрузке данных: ', error));
}

function showDetails(clubId) {
    // Функция для отображения подробной информации о клубе
    // В данном примере не реализована полностью, требуется дополнительная логика для отображения деталей
    alert("Показать детали для клуба с ID: " + clubId);
    // Здесь должен быть код для отображения детальной информации о клубе
}


function buildRoute(from, to, map) {
    map.geoObjects.each(function (geoObject) {
        if (geoObject instanceof ymaps.Polyline) {
            map.geoObjects.remove(geoObject);
        }
    });

    ymaps.route([from, to]).then(function (route) {
        map.geoObjects.add(route);
        map.setBounds(route.getBounds(), {
            checkZoomRange: true
        });
    }, function (error) {
        alert("Возникла ошибка при построении маршрута: " + error.message);
    });
}
