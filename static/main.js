let myMap;
var polygons = {};

document.addEventListener("DOMContentLoaded", function () {
  ymaps.ready(initMap);

  document.addEventListener("click", function (e) {
    if (e.target && e.target.matches("button[data-club-id]")) {
      const clubId = e.target.getAttribute("data-club-id");
      showClubDetails(clubId);
    } else if (e.target && e.target.id === "removeMarkers") {
      clearMarkers();
    } else if (e.target && e.target.id === "showMarkers") {
      loadMarkers();
    }
  });

  const clearDetailsButton = document.getElementById("clearDetails");
  if (clearDetailsButton) {
    clearDetailsButton.addEventListener("click", function () {
      const detailsElement = document.getElementById("clubDetails");
      detailsElement.innerHTML = "";
      detailsElement.style.display = "none";
    });
  }

  const openMenu = document.getElementById("open_menu");
  const closeMenu = document.getElementById("close_menu");
  const menu = document.getElementById("menu");

  openMenu.addEventListener("click", function () {
    menu.classList.remove("closed");
    menu.classList.add("opened");
    closeMenu.classList.remove("close");
    openMenu.classList.add("close");
  });

  closeMenu.addEventListener("click", function () {
    menu.classList.remove("opened");
    menu.classList.add("closed");
    openMenu.classList.remove("close");
    closeMenu.classList.add("close");
  });
});

function initMap() {
  myMap = new ymaps.Map("map", {
    center: [41.299496, 69.240073], // указанный центр Ташкента
    zoom: 10
  });

  // Удаление ненужных элементов управления
  myMap.controls.remove('geolocationControl'); // удаляем геолокацию
  myMap.controls.remove('searchControl'); // удаляем поиск
  myMap.controls.remove('trafficControl'); // удаляем контроль трафика
  myMap.controls.remove('typeSelector'); // удаляем тип
  myMap.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
  myMap.controls.remove('zoomControl'); // удаляем контрол зуммирования
  myMap.controls.remove('rulerControl'); // удаляем контрол правил


  loadMarkers(); // Загружаем маркеры
  loadPolygons(); // Загружаем полигоны
}


// Загрузка и анимация полигонов
function loadPolygons() {
  fetch("/static/poligons.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("Всего полигонов для загрузки:", data.features.length); // Выводим количество полигонов
      data.features.forEach((feature, index) => {
        console.log(
          `Загрузка полигона ${index + 1}: ${feature.properties.name}`
        ); // Выводим информацию о каждом полигоне перед его добавлением
        const polygon = new ymaps.Polygon(
          feature.geometry.coordinates,
          {
            hintContent: feature.properties.name,
          },
          {
            fillColor: feature.properties.fill,
            strokeColor: feature.properties.stroke,
            strokeWidth: feature.properties["stroke-width"],
            fillOpacity: feature.properties["fill-opacity"],
            strokeOpacity: feature.properties["stroke-opacity"],
          }
        );
        myMap.geoObjects.add(polygon);
      });
    })
    .catch((error) => {
      console.error("Error loading polygons:", error);
    });
}

function loadMarkers() {
  myMap.geoObjects.removeAll();
  fetch("/static/clubsData.json")
    .then((response) => response.json())
    .then((data) => {
      data.clubsData.forEach((club) => {
        addMarker(club);
      });
    })
    .catch((error) => console.error("Error loading club data:", error));
}

// Очистка марок на карте
function clearMarkers() {
  myMap.geoObjects.removeAll();
}

function addMarker(club) {
  let rating = club.reviews[0].rating;

  // Определение цвета маркера на основе рейтинга
  let presetColor;
  if (rating <= 2) {
    presetColor = "islands#redDotIcon"; // Рейтинг от 1 до 2 - красный
  } else if (rating <= 4) {
    presetColor = "islands#yellowDotIcon"; // Рейтинг от 3 до 4 - желтый
  } else {
    presetColor = "islands#greenDotIcon"; // Рейтинг 5 - зеленый
  }

  const placemark = new ymaps.Placemark(
    club.location.coordinates,
    {
      balloonContent: createBalloonContent(club),
    },
    {
      preset: presetColor,
    }
  );
  myMap.geoObjects.add(placemark);
}

function createBalloonContent(club) {
  let totalRating = club.reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  let averageRating =
    club.reviews.length > 0 ? totalRating / club.reviews.length : 0;
  let ratingStars = getRatingStars(averageRating);

  return `
  <div class="balloon-content" style="font-family: Arial, sans-serif; font-size: 14px; color: #333; animation: fadeIn 0.5s;">
      <h2 style="font-size: 16px; color: #000;">${club.name}</h2>
      <p style="color: #555;">${club.location.address}</p>
      <p>Оценка: ${ratingStars}</p>
      <div style="display: flex; justify-content: space-around; margin-top: 10px;">
          <button onclick="showClubDetails('${
            club.id
          }')" style="background-color: #4CAF50; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.2s ease;">Подробнее</button>
          <button onclick="callTaxi('${club.location.coordinates.join(",")}')"
                  style="background-color: #2196F3; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.2s ease;">Вызвать такси</button>
          <button onclick="buildRouteToClub('${club.location.coordinates.join(
            ","
          )}')"
                  style="background-color: #ffc107; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.2s ease;">Добраться пешком</button>
      </div>
  </div>
  <style>
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .balloon-content button:hover {
            background-color: darken(#4CAF50, 10%);
        }
    </style>
  `;
}

function getRatingStars(rating) {
  let stars = "";
  let color;
  if (rating <= 2) {
    color = "red";
  } else if (rating <= 4) {
    color = "yellow";
  } else {
    color = "green";
  }

  for (let i = 0; i < 5; i++) {
    stars +=
      i < Math.round(rating)
        ? `<span style="color: ${color};">&#9733;</span>`
        : `<span style="color: lightgray;">&#9733;</span>`;
  }

  return stars;
}

function showClubDetails(clubId) {
  fetch(`/get-club-details?club_id=${clubId}`)
    .then((response) => response.json())
    .then((club) => {
      let clubDetailsHTML = `
        <h2 style="color: #000; border-bottom: 2px solid #e1e1e1; padding-bottom: 10px; animation: fadeIn 1s;">${club.name} - <span>${club.description}</span></h2>
        <div style="margin-bottom: 15px;">${club.photos
          .map(
            (photo) =>
              `<img src="${photo}" alt="Фото клуба" style="width:200px; height:100px; object-fit: cover; margin: 15px 10px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">`
          )
          .join("")}</div>
        <div style="margin-bottom: 15px; color: #000;"><i class="fa-icon address-icon" style="margin-right: 5px; color: #666;"></i><strong style="animation: pulse 1.5s infinite;">Адрес:</strong> ${club.location.address}</div>
        <div style="margin-bottom: 15px; color: #000;"><strong>Время работы:</strong> ${club.location.time}</div>
        <div style="margin-bottom: 15px; color: #000;"><strong>Контакт:</strong> ${club.administration.number}</div>
        <div style="margin-bottom: 15px; color: #000;"><strong>Услуги:</strong> ${Object.entries(club.services)
          .map(
            ([service, available]) =>
              `<div>${service}: ${available ? 'Да' : 'Нет'}</div>`
          )
          .join("")}</div>
        <div style="margin-bottom: 15px; color: #000;"><strong>Цены:</strong> Standard: ${club.prices.pc_rent_STANDART}, VIP: ${club.prices.pc_rent_VIP}</div>
        <div style="margin-bottom: 15px; color: #000;"><strong>Клубная карта:</strong> ${club.club_card.loyalty_program ? "Доступна" : "Не доступна"}, Преимущества: ${club.club_card.benefits}</div>
      `;

      const detailsElement = document.getElementById("clubDetails");
      detailsElement.innerHTML = clubDetailsHTML;
      detailsElement.style.cssText = 'font-family: "Comic Sans MS", cursive, sans-serif; background: rgba(255, 255, 255, 0.8); border: 1px solid #ddd; padding: 20px; border-radius: 8px; display: block; max-width: 800px; margin: auto; animation: fadeIn 2s;';
    })
    .catch((error) => console.error("Error fetching club details:", error));

  if (!document.getElementById('animationStyles')) {
    const style = document.createElement('style');
    style.id = 'animationStyles';
    style.innerHTML = `
      /* Adjusted for black text */
      .details-panel {
          background: rgba(255, 255, 255, 0.5); /* Semi-transparent white background */
          color: #000; /* Black text for better contrast */
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .details-panel h2, .details-panel div {
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3); /* Lighter shadow for black text */
      }

      .details-panel img {
          border: 2px solid white;
      }

      @media (max-width: 768px) {
          .details-panel {
              font-size: 14px;
          }
      }
    `;
    document.head.appendChild(style);
  }
}


function callTaxi(coordinates) {
  window.open(
    `https://taxi.yandex.ru/?clid=xxx&from=geolocation&to=${coordinates}`,
    "_blank"
  );
}

function buildRouteToClub(clubCoordinates) {
  if (!navigator.geolocation) {
    alert("Геолокация не поддерживается вашим браузером");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const userCoordinates = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      const clubCoords = clubCoordinates.split(",");

      ymaps
        .route([userCoordinates, clubCoords], {
          multiRoute: true,
          routingMode: "pedestrian",
        })
        .then(
          function (route) {
            myMap.geoObjects.add(route);
            myMap.setBounds(route.getBounds(), { checkZoomRange: true });
          },
          function (error) {
            alert("Не удалось построить маршрут. Ошибка: " + error.message);
          }
        );
    },
    function () {
      alert("Невозможно получить ваше местоположение");
    }
  );
}
