function loadMetroMarkers() {
    const station = { name: "Пример станции", coordinates: [41.335569, 69.339737], line: "Пример линии" }; // Пример данных
    let placemark = new ymaps.Placemark(station.coordinates, {
        balloonContent: `<strong>${station.name}</strong><br>Линия: ${station.line}`
    }, {
        preset: 'islands#icon',
        iconColor: '#0095b6'
    });
    myMap.geoObjects.add(placemark);

}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('metroMarkers').addEventListener('click', loadMetroMarkers);
});


var metroStations = [
    { name: "Станция 1", coordinates: [41.1456, 69.1158], line: "Красная линия" },
    { name: "Станция 2", coordinates: [41.1567, 69.1249], line: "Синяя линия" },
    { name: "Станция 3", coordinates: [41.1678, 69.1340], line: "Зеленая линия" },
    { name: "Станция 4", coordinates: [41.1789, 69.1431], line: "Желтая линия" },
    { name: "Станция 5", coordinates: [41.1900, 69.1522], line: "Фиолетовая линия" },
];


let metroTimetable = {
    "Станция 1": {
        "Вперед": ["06:00", "06:15", "06:30", "06:45"],
        "Назад": ["06:05", "06:20", "06:35", "06:50"],
        line: "Красная линия"
    },
    "Станция 2": {
        "Вперед": ["06:10", "06:25", "06:40", "06:55"],
        "Назад": ["06:15", "06:30", "06:45", "07:00"],
        line: "Синяя линия"
    },
    "Станция 3": {
        "Вперед": ["06:20", "06:35", "06:50", "07:05"],
        "Назад": ["06:25", "06:40", "06:55", "07:10"],
        line: "Зеленая линия"
    },
    "Станция 4": {
        "Вперед": ["06:30", "06:45", "07:00", "07:15"],
        "Назад": ["06:35", "06:50", "07:05", "07:20"],
        line: "Желтая линия"
    },
    "Станция 5": {
        "Вперед": ["06:40", "06:55", "07:10", "07:25"],
        "Назад": ["06:45", "07:00", "07:15", "07:30"],
        line: "Фиолетовая линия"
    },
};
