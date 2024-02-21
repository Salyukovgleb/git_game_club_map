ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
        center: [41.311081, 69.240562], // Центр карты (Ташкент)
        zoom: 12
    });

    // Загрузка данных из файла clubsData.json
    fetch('static/clubsData.json').then(response => response.json()).then(data => {
        data.clubsData.forEach(club => {
            var balloonContent = `<strong>${club.name}</strong><br>${club.location.address}<br>Время работы: ${club.working_hours}<br><button onclick="showDetails('${club.id}')">Подробнее</button>`;
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
    // Make a request to the Flask endpoint with the club ID
    fetch(`/get_club_details?id=${clubId}`)
    .then(response => response.json())
    .then(club => {
        if (club.error) {
            alert(club.error);
            return;
        }

        // Construct the details HTML using the club data with styles for vertical layout
        const detailsHtml = `
            <style>
                #clubInfo {
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    background-color: #fff;
                    color: #4a4a4a;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                }
                .info-block {
                    background-color: #ecf0f1;
                    padding: 10px;
                    border-radius: 8px;
                    border-left: 5px solid #d35400;
                    margin-bottom: 5px;
                }
                #clubInfo h2, #clubInfo p, #clubInfo div, #clubInfo img {
                    margin-bottom: 10px;
                }
                #clubInfo img {
                    width: 100%;
                    border-radius: 8px;
                }
                .copy-icon {
                    cursor: pointer;
                    display: inline-block;
                    margin-left: 5px;
                }
            </style>
            <h2>${club.name} - <span style="font-weight: normal;"><strong></strong> ${club.description}</span></h2>
            <div>${club.photos.map(photo => `<img src="${photo}" alt="Фото клуба">`).join('')}</div>
            <div class="info-block"><strong>Адрес:</strong> ${club.location.address}</div>
            <div class="info-block"><strong>Время:</strong> ${club.location.time}</div>
            <div class="info-block"><strong>Контакты:</strong><br>${club.administration.contact} <span class="copy-icon" onclick="copyToClipboard('${club.administration.contact}')">&#x1f4cb;</span><br>${club.administration.number} <span class="copy-icon" onclick="copyToClipboard('${club.administration.number}')">&#x1f4cb;</span></div>
            <div class="info-block"><strong>Услуги:</strong> ${Object.entries(club.services).map(([service, available]) => `<div>${service}: ${available ? 'Да' : 'Нет'}</div>`).join('')}</div>
            <div class="info-block"><strong>Цены STANDART-VIP:</strong><br>PC Rent: ${club.prices.pc_rent_STANDART},${club.prices.pc_rent_VIP}<br>Специальные предложения: ${club.prices.special_offers}</div>
            <div class="info-block"><strong>Клубная карта:</strong><br>Программа лояльности: ${club.club_card.loyalty_program ? 'Да' : 'Нет'}<br>Преимущества: ${club.club_card.benefits}</div>
        `;

        // Populate the modal with the details and display it
        document.getElementById('clubInfo').innerHTML = detailsHtml;
        document.getElementById('clubModal').style.display = 'block';
    })
    .catch(error => {
        console.error('Error fetching club details:', error);
        alert('There was an error fetching the club details.');
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Номер скопирован: ' + text);
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}






// Close modal when the close button is clicked
document.querySelector('.close').onclick = function() {
    document.getElementById('clubModal').style.display = 'none';
};

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target == document.getElementById('clubModal')) {
        document.getElementById('clubModal').style.display = 'none';
    }
};





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
