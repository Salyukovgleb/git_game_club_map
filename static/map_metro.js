ymaps.ready(init);

var myMap;
var metroStations = []; // Для хранения меток станций метро
var linesCoordinates = {
    'Чиланзарская Линия': [
        [41.206309, 69.219124], [41.213600, 69.213990], [41.220954, 69.208588], [41.227427, 69.203973], [41.238198, 69.196161], [41.239198, 69.195395], [41.240486, 69.195115], [41.242320, 69.194998], [41.245880, 69.194959], [41.245880, 69.194959], [41.249578, 69.197671], [41.250777, 69.19767], [41.253653, 69.19617], [41.255522, 69.195685], [41.258415, 69.195783], [41.259455, 69.196508], [41.261952, 69.197606], [41.266079, 69.199770], [41.270135, 69.202200], [41.273027, 69.203743], [41.274370, 69.204742], [41.278249, 69.208248], [41.281917, 69.212548], [41.291993, 69.223570], [41.297739, 69.230433], [41.300951, 69.233793], [41.304719, 69.235694], [41.309653, 69.240509], [41.311839, 69.243173], [41.316879, 69.248736], [41.317500, 69.250340], [41.317888, 69.251790], [41.317853, 69.255295], [41.317500, 69.260017], [41.317253, 69.262401], [41.316478, 69.265439], [41.314955, 69.270787], [41.314743, 69.272423], [41.312417, 69.276209], [41.311818, 69.278172], [41.311571, 69.279201], [41.311642, 69.280323], [41.312770, 69.283221], [41.318326, 69.295655], [41.320864, 69.301265], [41.321287, 69.302573], [41.321463, 69.303321], [41.321533, 69.304350], [41.321110, 69.307061], [41.321357, 69.308463], [41.321921, 69.311268], [41.324164, 69.318045], [41.325386, 69.323057], [41.325853, 69.325739], [41.326186, 69.328776]
    ],
    'Узбекистанская Линия': [
        [41.293712, 69.322323], [41.297491, 69.311120], [41.299274, 69.305093], [41.299570, 69.301654], [41.299335, 69.299446], [41.298806, 69.297134], [41.298024, 69.295697], [41.293318, 69.287436], [41.291539, 69.284782], [41.291465, 69.283733], [41.291341, 69.282914], [41.291687, 69.281013], [41.292948, 69.279735], [41.298187, 69.273640], [41.301468, 69.270287], [41.303717, 69.268059], [41.304359, 69.266978], [41.305254, 69.264826], [41.308148, 69.254253], [41.309358, 69.253368], [41.310569, 69.253302], [41.312101, 69.253368], [41.317505, 69.254191], [41.319161, 69.254093], [41.324052, 69.254945], [41.325007, 69.254271], [41.326020, 69.252960], [41.327131, 69.250798], [41.327699, 69.248864], [41.327823, 69.245915], [41.327798, 69.243589], [41.327612, 69.241968], [41.326624, 69.239314], [41.325759, 69.236791], [41.324820, 69.234202], [41.324870, 69.232892], [41.324944, 69.232269], [41.325265, 69.231352], [41.332450, 69.218761], [41.339966, 69.205461], [41.340666, 69.205043], [41.341209, 69.205206], [41.341802, 69.205370], [41.345160, 69.207009]
    ],
    'Юнусабадская Линия': [
        [41.299694, 69.274545], [41.305293, 69.282495], [41.307668, 69.285157], [41.308714, 69.285832], [41.309675, 69.286657], [41.310411, 69.286657], [41.311513, 69.286469], [41.313718, 69.283320], [41.316093, 69.281407], [41.316659, 69.281070], [41.318380, 69.281132], [41.320189, 69.281582], [41.327030, 69.283232], [41.332588, 69.284261], [41.337167, 69.284486], [41.345827, 69.286057], [41.349089, 69.287407], [41.353060, 69.288015], [41.359872, 69.289232], [41.361059, 69.289457], [41.362528, 69.288857], [41.363658, 69.288857], [41.365268, 69.290244], [41.366765, 69.292081], [41.368177, 69.293244], [41.369512, 69.293778], [41.377364, 69.295878]
    ],
    'Сергелийская Линия': [
        [41.341081, 69.330562], [41.341080, 69.340563], [41.341079, 69.350564]
    ],
    'Наземная кольцевая линия': [
        [41.297693, 69.349579], [41.296505, 69.351679], [41.295431, 69.352954], [41.292179, 69.356103], [41.289181, 69.358728], [41.287229, 69.359216], [41.285815, 69.359703], [41.281601, 69.360228], [41.279363, 69.360578], [41.272517, 69.361815], [41.271640, 69.362078], [41.271640, 69.362078], [41.270028, 69.363390], [41.268557, 69.365078], [41.267666, 69.365607], [41.266676, 69.365495], [41.265629, 69.364745], [41.256632, 69.358483], [41.250956, 69.354275], [41.249032, 69.351950], [41.246768, 69.347713], [41.244108, 69.338039], [41.239762, 69.333731], [41.238686, 69.331931], [41.237894, 69.329306], [41.236988, 69.325856], [41.237639, 69.322932], [41.238545, 69.321207], [41.240469, 69.319144], [41.242366, 69.317007], [41.243922, 69.314457], [41.244715, 69.311200], [41.244655, 69.308192], [41.244598, 69.299380], [41.244866, 69.284893], [41.244583, 69.280244], [41.244328, 69.278819], [41.243762, 69.277319], [41.230087, 69.270394], [41.227398, 69.269081], [41.225190, 69.267506], [41.222783, 69.263682], [41.221528, 69.260003], [41.209812, 69.231822], [41.205294, 69.220881]
    ]
};

var lineColors = {
    'Чиланзарская Линия': "#FF0000", // Красный
    'Узбекистанская Линия': "#0000FF", // Синий
    'Юнусабадская Линия': "#008000", // Зелёный
    'Сергелийская Линия': "#808080", // Серый
    'Наземная кольцевая линия': "#00FFFF" // Голубой
};
function init() {
    myMap = new ymaps.Map('map', {
        center: [41.311081, 69.240562],
        zoom: 12
    }, {
        searchControlProvider: 'yandex#search'
    });

    // Удаление стандартных элементов управления
    myMap.controls.remove('geolocationControl'); // удаляем геолокацию
    myMap.controls.remove('searchControl'); // удаляем поиск
    myMap.controls.remove('trafficControl'); // удаляем контроль трафика
    myMap.controls.remove('typeSelector'); // удаляем тип
    myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
    myMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
    myMap.controls.remove('rulerControl'); // удаляем контрол правил


    fetchStations();
    attachEventListeners();
}


function fetchStations() {
    fetch('static/metro_stations.json')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                addMetroStations(data);
            }
        })
        .catch(error => console.error('Error loading the metro stations data:', error));
}
function getNextThreeTimes(times, currentTimeString) {
    const currentTimeMinutes = timeStringToMinutes(currentTimeString);
    return times
        .map(time => ({ time, minutes: timeStringToMinutes(time) }))
        .filter(({ minutes }) => minutes >= currentTimeMinutes)
        .slice(0, 3)
        .map(({ time }) => time);
}

function timeStringToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function addMetroStations(data) {
    data.forEach(station => {
        var placemark = new ymaps.Placemark(station.coordinates, {
            balloonContentHeader: `<strong>${station.name}</strong>`,
            balloonContentBody: `
                <div class="metro-balloon">
                    <p>Линия: <strong>${station.line}</strong></p>
                    <p>Следующие прибытия:<br>
                    Вперед: <span class="metro-time blink">${station.timetable.Вперед.slice(0, 3).join(', ')}</span><br>
                    Назад: <span class="metro-time blink">${station.timetable.Назад.slice(0, 3).join(', ')}</span></p>
                    <button id="routeButton-${station.id}" class="route-button">Как добраться?</button>
                </div>
            `,
        }, {
            iconLayout: 'default#image',
            iconImageHref: 'static/images/metro_2.png',
            iconImageSize: [30, 30],
            iconImageOffset: [-15, -15]
        });

        myMap.geoObjects.add(placemark);
        metroStations.push({ ...station, placemark });

        // Добавляем обработчик на открытие балуна
        placemark.events.add('balloonopen', function () {
            var button = document.getElementById(`routeButton-${station.id}`);
            if (button) {
                button.onclick = function () {
                    buildRoute(station.coordinates);
                };
            }
        });
    });
}


function attachEventListeners() {
    document.getElementById('linesButton').addEventListener('click', function() {
        var linesMenu = document.getElementById('linesMenu');
        linesMenu.style.display = linesMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('.metroLine').forEach(function(button) {
        button.addEventListener('click', function() {
            var lineName = this.getAttribute('data-line');
            drawMetroLine(lineName);
        });
    });

    // Этот обработчик добавляется вне цикла и предыдущих условий
    document.getElementById('showAllLinesButton').addEventListener('click', drawAllMetroLines);
}



function drawMetroLine(lineName) {
    // Вместо удаления всех объектов, будем удалять только линии, оставляя метки станций
    myMap.geoObjects.each(function (geoObject) {
        if (geoObject.geometry && geoObject.geometry.getType() === 'LineString') {
            myMap.geoObjects.remove(geoObject);
        }
    });

    

    if (linesCoordinates[lineName]) {
        var metroLine = new ymaps.Polyline(
            linesCoordinates[lineName],
            {
                hintContent: '🚇 ' + lineName // Использование Unicode символов для стилизации
            },
            {
                strokeColor: lineColors[lineName],
                strokeWidth: 4
            }
        );

        myMap.geoObjects.add(metroLine);

        myMap.setBounds(metroLine.getBounds(), { checkZoomRange: true }).then(function () {
            if (myMap.getZoom() > 10) myMap.setZoom(10);
        });
    } else {
        console.error("Coordinates for the line " + lineName + " not found.");
    }

}
function clearMapFromLines() {
    myMap.geoObjects.each(function (geoObject) {
        if (geoObject.geometry && geoObject.geometry.getType() === 'LineString') {
            myMap.geoObjects.remove(geoObject);
        }
    });
}

function drawAllMetroLines() {
    clearMapFromLines(); // Очистка карты от линий перед их повторной отрисовкой
    Object.keys(linesCoordinates).forEach(function(lineName) {
        drawMetroLine(lineName);
    });
}

function getCurrentTimeForTashkent() {
    const now = new Date();
    const currentTimeUtc = now.getTime() + (now.getTimezoneOffset() * 60000); // Конвертация в UTC
    const tashkentOffset = 5; // UTC+5 для Ташкента
    const tashkentTime = new Date(currentTimeUtc + (3600000 * tashkentOffset));

    const currentHours = tashkentTime.getHours();
    const currentMinutes = tashkentTime.getMinutes();
    return `${currentHours < 10 ? '0' + currentHours : currentHours}:${currentMinutes < 10 ? '0' + currentMinutes : currentMinutes}`;
}

function updateMetroMarkersTimes() {
    console.log("Updating metro arrival times...");
    const currentTimeString = getCurrentTimeForTashkent();

    metroStations.forEach(station => {
        const nextTimesForward = getNextThreeTimes(station.timetable["Вперед"], currentTimeString);
        const nextTimesBackward = getNextThreeTimes(station.timetable["Назад"], currentTimeString);

        station.placemark.properties.set('balloonContentBody', `
            <div class="metro-balloon">
                <p>Линия: <strong>${station.line}</strong></p>
                <p>Следующие прибытия:<br>
                Вперед: <span class="metro-time blink">${nextTimesForward.join(', ')}</span><br>
                Назад: <span class="metro-time blink">${nextTimesBackward.join(', ')}</span></p>
                <button onclick="buildRoute([${station.coordinates}])">Как добраться?</button>
            </div>
        `);
    });
}

function buildRoute(destination) {
    if (!navigator.geolocation) {
        alert("Геолокация не поддерживается вашим браузером");
        return;
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        ymaps.route([
            [latitude, longitude],
            destination
        ], {
            multiRoute: true,
            routingMode: 'pedestrian'
        }).then(function (route) {
            myMap.geoObjects.remove(myRoute);
            myRoute = route;
            myMap.geoObjects.add(route);

            // Расчет времени и расстояния
            const time = Math.round(route.getJamsTime() / 60); // Время в минутах
            const distance = route.getLength() / 1000; // Расстояние в километрах

            // Обновление информации в панели маршрута
            document.getElementById('routeTime').textContent = `Время в пути: ${time} мин.`;
            document.getElementById('routeDistance').textContent = `Расстояние: ${distance.toFixed(2)} км.`;

            // Отображение панели маршрута
            document.getElementById('routeInfoPanel').style.display = 'block';
        }, function (error) {
            alert("Возникла ошибка: " + error.message);
        });
    }

    function error() {
        alert("Невозможно получить ваше местоположение");
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

function clearRoute() {
    if (myRoute) {
        myMap.geoObjects.remove(myRoute);
        myRoute = null; // Обнулите переменную маршрута после его удаления
        
        // Скрыть панель информации о маршруте после удаления маршрута
        document.getElementById('routeInfoPanel').style.display = 'none';
    }
}
document.getElementById('clearRoute').addEventListener('click', clearRoute);


let myRoute; // Для хранения текущего маршрута
document.addEventListener('DOMContentLoaded', function () {
    setInterval(updateMetroMarkersTimes, 3000); // Обновление каждые 3 секунды
});

//крипт для навигации