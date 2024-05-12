const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 150; // количество звезд

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


class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 1.5 + 1;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
  }

  draw() {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Отскок от краев холста
    if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

    this.draw();
  }
}

// Создаем звезды
for (let i = 0; i < numStars; i++) {
  stars.push(new Star());
}

function connectStars() {
  let opacityValue = 1;
  for (let i = 0; i < numStars; i++) {
    for (let j = i + 1; j < numStars; j++) {
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        opacityValue = 1 - distance / 100;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
        ctx.beginPath();
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => star.update());
  connectStars();
  requestAnimationFrame(animate);
}

animate();
