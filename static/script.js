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
    // Make a request to the Flask endpoint with the club ID
    fetch(`/get_club_details?id=${clubId}`)
    .then(response => response.json())
    .then(club => {
        if (club.error) {
            alert(club.error);
            return;
        }

        // Construct the details HTML using the club data
        const detailsHtml = `
            <h2>${club.name}</h2>
            <p><strong>Description:</strong> ${club.description}</p>
            <p><strong>Location:</strong> ${club.location.address}, Coordinates: [${club.location.coordinates.join(', ')}], Time: ${club.location.time}</p>
            <div><strong>Photos:</strong> ${club.photos.map(photo => `<img src="${photo}" style="width: 100%; display: block; margin-bottom: 10px;">`).join('')}</div>
            <div><strong>Reviews:</strong> ${club.reviews.map(review => `<div>${review.user}: ${review.text} (Rating: ${review.rating})</div>`).join('')}</div>
            <p><strong>Contact:</strong> ${club.administration.contact}, ${club.administration.number}</p>
            <div><strong>Services:</strong> ${Object.entries(club.services).map(([service, available]) => `${service}: ${available ? 'Yes' : 'No'}`).join(', ')}</div>
            <p><strong>Prices:</strong> PC Rent: ${club.prices.pc_rent}, Special Offers: ${club.prices.special_offers}</p>
            <p><strong>Club Card:</strong> Loyalty Program: ${club.club_card.loyalty_program ? 'Yes' : 'No'}, Benefits: ${club.club_card.benefits}</p>
            <p><strong>Comments:</strong> ${club.comments}</p>
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
