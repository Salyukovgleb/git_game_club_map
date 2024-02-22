let myMap;
let markers = []; // Глобальный массив для хранения меток

ymaps.ready(() => {
    myMap = new ymaps.Map("map", {
        center: [41.311081, 69.240562],
        zoom: 12
    });
    loadMarkers(); // Первоначальная загрузка меток
});

function loadMarkers() {
    fetch('static/clubsData.json').then(response => response.json()).then(data => {
        // Удаляем старые метки перед добавлением новых
        markers.forEach(marker => myMap.geoObjects.remove(marker));
        markers = []; // Очищаем массив меток

        data.clubsData.forEach(club => {
            let totalRating = club.reviews.reduce((acc, review) => acc + review.rating, 0);
            let averageRating = club.reviews.length > 0 ? (totalRating / club.reviews.length) : 0;
            let ratingStars = getRatingStars(averageRating);

            // Берем первый номер телефона из списка
            let phoneNumber = club.administration.number.split(', ')[0];

            var balloonContent = `
                <div style="font-family: Arial, sans-serif; font-size: 14px;">
                    <strong>${club.name}</strong><br>
                    <span style="color: gray;">${club.location.address}</span><br>
                    <span>Время работы: ${club.working_hours}</span><br>
                    <span>Рейтинг: ${ratingStars}</span><br>
                    <div style="display: flex; align-items: center; color: navy; font-weight: bold;">
                        <span>Телефон: ${phoneNumber}</span>
                        <button onclick="copyToClipboard('${phoneNumber}')" style="margin-left: 10px; padding: 6px 15px; background-color: #343a40; color: white; border: none; border-radius: 11px; cursor: pointer; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.2s, transform 0.1s; min-width: 80px;">
                            <i class="fas fa-copy" style="margin-right: 5px;"></i>
                        </button>
                    </div>
                    <button style="margin-top: 10px; padding: 6px 15px; background-color: #343a40; color: white; border: none; border-radius: 11px; cursor: pointer; font-size: 10px; display: inline-flex; align-items: center; justify-content: center; transition: background-color 0.2s, transform 0.1s; min-width: 80px;" onclick="showDetails('${club.id}')">
                        <i class="fa-solid fa-circle-info" style="margin-right: 5px;"></i>Подробнее
                    </button>
                </div>
            `;

            var placemark = new ymaps.Placemark(club.location.coordinates, {
                balloonContent: balloonContent
            }, {
                preset: 'islands#redDotIcon'
            });

            myMap.geoObjects.add(placemark);
            markers.push(placemark); // Сохраняем метку в массиве
        });
    }).catch(error => console.error('Ошибка при загрузке данных: ', error));
}

function getRatingStars(rating) {
    let stars = '';
    let color;
    if (rating <= 2) {
        color = 'red';
    } else if (rating <= 4) {
        color = 'orange';
    } else {
        color = 'yellow';
    }

    for (let i = 0; i < 5; i++) {
        stars += i < Math.round(rating) ? `<span style="color: ${color};">&#9733;</span>` : `<span style="color: lightgray;">&#9733;</span>`;
    }

    return stars;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Номер скопирован: ' + text);
    }).catch(err => {
        console.error('Error copying text: ', err);
        alert('Ошибка при копировании текста.');
    });
}




document.getElementById('removeMarkers').addEventListener('click', () => {
    markers.forEach(marker => myMap.geoObjects.remove(marker)); // Удаление всех меток с карты
    markers = []; // Очищаем массив меток
});

document.getElementById('showMarkers').addEventListener('click', () => {
    loadMarkers(); // Загружаем метки снова
});


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
