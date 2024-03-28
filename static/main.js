let myMap; // Declare myMap globally

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Yandex Maps
  ymaps.ready(initMap);


  // Set up event listeners for dynamically generated "Подробнее" buttons
  document.addEventListener('click', function (e) {
    if (e.target && e.target.matches("button[data-club-id]")) {
      const clubId = e.target.getAttribute('data-club-id');
      showClubDetails(clubId);
    } else if (e.target && e.target.id === "removeMarkers") {
      clearMarkers(); // Clear all markers from the map
    } else if (e.target && e.target.id === "showMarkers") {
      loadMarkers(); // Reload all markers onto the map
    }
  });

  // Setup to clear club details
  const clearDetailsButton = document.getElementById('clearDetails');
  if (clearDetailsButton) {
    clearDetailsButton.addEventListener('click', function () {
      const detailsElement = document.getElementById('clubDetails');
      detailsElement.innerHTML = ''; // Clears the content
      detailsElement.style.display = 'none'; // Hides the div
    });
  }

  // Menu toggle functionality
  const openMenu = document.getElementById("open_menu");
  const closeMenu = document.getElementById("close_menu");
  const menu = document.getElementById("menu");

  openMenu.addEventListener("click", function () {
    menu.classList.remove("close_menu");
    menu.classList.add("open_menu");
    closeMenu.classList.remove("close");
    openMenu.classList.add("close");
  });

  closeMenu.addEventListener("click", function () {
    menu.classList.remove("open_menu");
    menu.classList.add("close_menu");
    openMenu.classList.remove("close");
    closeMenu.classList.add("close");
  });
});

// Initialize the map
function initMap() {
  myMap = new ymaps.Map("map", {
    center: [69.240073, 41.299496], // Center on Tashkent, Uzbekistan
    zoom: 5
  });

  loadMarkers(); // Load markers
  loadPolygons(); // Load polygons
}
function loadPolygons() {
  fetch('/static/poligons.json')
    .then(response => response.json())
    .then(data => {
      data.features.forEach(feature => {
        const polygon = new ymaps.Polygon(feature.geometry.coordinates, {
          hintContent: feature.properties.name
        }, {
          fillColor: feature.properties.fill,
          strokeColor: feature.properties.stroke,
          opacity: 0.5
        });
        myMap.geoObjects.add(polygon);
      });
    })
    .catch(error => console.error('Error loading polygons:', error));
}


// Load markers onto the map
function loadMarkers() {
  myMap.geoObjects.removeAll(); // Clear existing markers before loading new ones
  fetch('/static/clubsData.json')
    .then(response => response.json())
    .then(data => {
      data.clubsData.forEach(club => {
        addMarker(club);
      });
    })
    .catch(error => console.error('Error loading club data:', error));
}

// Clear all markers from the map
function clearMarkers() {
  myMap.geoObjects.removeAll();
}

function addMarker(club) {
  // Предполагается, что каждый клуб имеет массив отзывов 'reviews' и каждый отзыв имеет поле 'rating'.
  // Для упрощения примера, берем рейтинг первого отзыва клуба.
  let rating = club.reviews[0].rating; // В реальном случае здесь может быть вычисление среднего рейтинга

  // Определение цвета маркера на основе рейтинга
  let presetColor;
  if (rating <= 2) {
    presetColor = 'islands#redDotIcon'; // Рейтинг от 1 до 2 - красный
  } else if (rating <= 4) {
    presetColor = 'islands#yellowDotIcon'; // Рейтинг от 3 до 4 - желтый
  } else {
    presetColor = 'islands#greenDotIcon'; // Рейтинг 5 - зеленый
  }

  const placemark = new ymaps.Placemark(club.location.coordinates, {
    balloonContent: createBalloonContent(club)
  }, {
    preset: presetColor // Использование динамически определенного цвета
  });
  myMap.geoObjects.add(placemark);
}



function createBalloonContent(club) {
  // Вычисление среднего рейтинга из массива отзывов
  let totalRating = club.reviews.reduce((acc, review) => acc + review.rating, 0);
  let averageRating = club.reviews.length > 0 ? (totalRating / club.reviews.length) : 0;

  // Получение строки со звёздами для рейтинга
  let ratingStars = getRatingStars(averageRating);

  return `
    <div>
        <strong>${club.name}</strong><br>
        <span>${club.location.address}</span><br>
        <span>Rating: ${ratingStars}</span><br>
        <button data-club-id="${club.id}">Подробнее</button>
    </div>
  `;
}



function getRatingStars(rating) {
  let stars = '';
  let color;
  if (rating <= 2) {
    color = 'red'; // Рейтинг от 1 до 2 - красный цвет
  } else if (rating <= 4) {
    color = 'yellow'; // Рейтинг от 3 до 4 - желтый цвет
  } else {
    color = 'green'; // Рейтинг 5 - зеленый цвет
  }

  for (let i = 0; i < 5; i++) {
    stars += i < Math.round(rating) ? `<span style="color: ${color};">&#9733;</span>` : `<span style="color: lightgray;">&#9733;</span>`;
  }

  return stars;
}


// Fetch and display details for a club
function showClubDetails(clubId) {
  fetch(`/get-club-details?club_id=${clubId}`)
    .then(response => response.json())
    .then(club => {
      let clubDetailsHTML = `
        <h2>${club.name} - <span>${club.description}</span></h2>
        <div>${club.photos.map(photo => `<img src="${photo}" alt="Фото клуба" style="width:100px;">`).join('')}</div>
        <div><i class="fa-icon address-icon"></i><strong>Адрес:</strong> ${club.location.address}</div>

        <div><strong>Время работы:</strong> ${club.location.time}</div>
        <div><strong>Контакт:</strong> ${club.administration.number}</div>
        <div><strong>Услуги:</strong> ${Object.entries(club.services).map(([service, available]) => `<div>${service}: ${available ? 'Да' : 'Нет'}</div>`).join('')}</div>
        <div><strong>Цены:</strong> Standard: ${club.prices.pc_rent_STANDART}, VIP: ${club.prices.pc_rent_VIP}</div>
        <div><strong>Клубная карта:</strong> ${club.club_card.loyalty_program ? 'Доступна' : 'Не доступна'}, Преимущества: ${club.club_card.benefits}</div>
      `;

      const detailsElement = document.getElementById('clubDetails');
      detailsElement.innerHTML = clubDetailsHTML;
      detailsElement.style.display = 'block'; // Make sure the details are visible
    })
    .catch(error => console.error('Error fetching club details:', error));
}









