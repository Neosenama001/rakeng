const platters = [
  { id: 1, name: "Premium Platter", img: "section 1.jpeg", time: "15 mins", price: 249.99, desc: "Grilled chicken, spicy wings, samosas, fries." },
  { id: 2, name: "Mini Platter", img: "mini platter.jpg", time: "10 mins", price: 169.99, desc: "Mini sliders, spicy fries, nuggets." },
  { id: 2, name: "Mini Platter", img: "mini platter.jpg", time: "10 mins", price: 169.99, desc: "Mini sliders, spicy fries, nuggets." },
  { id: 2, name: "Mini Platter", img: "mini platter.jpg", time: "10 mins", price: 169.99, desc: "Mini sliders, spicy fries, nuggets." }
];

const popularDishes = [
  { id: 3, name: "Patty Planet", img: "mini platter.jpg", time: "12 mins", price: 59.99, desc: "Beef patty, fresh lettuce, tomato, cheese." },
  { id: 4, name: "Triple Planet", img: "mini platter.jpg", time: "8 mins", price: 69.99, desc: "Three stacked patties, BBQ sauce, onion rings." },
  { id: 3, name: "Patty Planet", img: "mini platter.jpg", time: "12 mins", price: 59.99, desc: "Beef patty, fresh lettuce, tomato, cheese." },
  { id: 4, name: "Triple Planet", img: "mini platter.jpg", time: "8 mins", price: 69.99, desc: "Three stacked patties, BBQ sauce, onion rings." }
];

const quickBites = [
  { id: 5, name: "Hotdog", img: "mini platter.jpg", time: "10 mins", price: 40, desc: "Classic hotdog, mustard, ketchup, fried onions." },
  { id: 6, name: "Chef's Special", img: "mini platter.jpg", time: "20 mins", price: 299.99, desc: "Signature dish by our head chef with gourmet toppings." },
  { id: 5, name: "Hotdog", img: "mini platter.jpg", time: "10 mins", price: 40, desc: "Classic hotdog, mustard, ketchup, fried onions." },
  { id: 6, name: "Chef's Special", img: "mini platter.jpg", time: "20 mins", price: 299.99, desc: "Signature dish by our head chef with gourmet toppings." }
];

function renderTrain() {
  const train = document.getElementById("trainItems");
  train.innerHTML = "";
  platters.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.onclick = () => showFullscreen(item);
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <h4>${item.name}</h4>
      <p class="description">${item.desc}</p>
      <p>R${item.price} - ${item.time}</p>
    `;
    train.appendChild(div);
  });
}

// Render popular dishes or quick bites carousel
function renderCarousel(id) {
  const container = document.getElementById(id);
  container.innerHTML = "";
  let data = [];
  if (id === "carousel1") data = popularDishes;
  else if (id === "carousel2") data = quickBites;
  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.onclick = () => showFullscreen(item);
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <h4>${item.name}</h4>
      <p>${item.desc}</p>
      <p>R${item.price} - ${item.time}</p>
    `;
    container.appendChild(div);
  });
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
}

document.addEventListener("click", function (e) {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.querySelector(".hamburger");
  if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
    sidebar.style.left = "-250px";
  }
});

function addToCart(id) {
  const item = [...platters, ...popularDishes, ...quickBites].find(i => i.id === id);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  renderPopupCart();
}

function updateCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  const countElement = document.getElementById("cart-count");
  if (countElement) countElement.textContent = count;
}

function toggleCartPopup() {
  const popup = document.getElementById("cart-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
  renderPopupCart();
}

function renderPopupCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const popupContainer = document.getElementById("popup-cart-items");
  const totalElement = document.getElementById("popup-total");
  popupContainer.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.className = "popup-item";
    div.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <div>
        <button onclick="changeQty(${index}, -1)">-</button>
        <button onclick="changeQty(${index}, 1)">+</button>
      </div>
    `;
    popupContainer.appendChild(div);
  });
  totalElement.textContent = total.toFixed(2);
}

function changeQty(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderPopupCart();
  updateCart();
}

function changeQtyUI(id, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const idx = cart.findIndex(i => i.id === id);
  if (idx >= 0) {
    cart[idx].quantity += delta;
    if (cart[idx].quantity < 1) cart.splice(idx, 1);
  } else if (delta > 0) {
    const item = [...platters, ...popularDishes, ...quickBites].find(i => i.id === id);
    cart.push({ ...item, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderPopupCart();
  updateCart();
}

// Show fullscreen overlay with smooth scale
function showFullscreen(item) {
  const container = document.getElementById('fullscreenView');

  // Create content div for animation
  container.innerHTML = `
    <div>
      <button class="close-btn" aria-label="Close expanded view" onclick="closeFullscreen()">&times;</button>
      <img src="${item.img}" alt="${item.name}" />
      <h4>${item.name}</h4>
      <p>${item.desc}</p>
      <p>R${item.price} - ${item.time}</p>
      <div class="qty-controls">
        <button onclick="changeQtyUI(${item.id}, -1)">-</button>
        <button onclick="addToCart(${item.id})">Add to Cart</button>
        <button onclick="changeQtyUI(${item.id}, 1)">+</button>
      </div>
    </div>
  `;

  // Show container
  container.style.display = 'flex';

  // Trigger the animation by adding 'show' class after a tiny delay
  setTimeout(() => {
    container.classList.add('show');
  }, 10);

  // Close if clicking outside the content div
  container.onclick = function(e) {
    if (e.target === container) {
      closeFullscreen();
    }
  };
}

function closeFullscreen() {
  const container = document.getElementById('fullscreenView');
  container.classList.remove('show');

  // Wait for transition to end before hiding
  container.querySelector('div').style.opacity = '0';
  container.querySelector('div').style.transform = 'scale(0.8)';

  setTimeout(() => {
    container.style.display = 'none';
    container.innerHTML = '';
  }, 300); // match the CSS transition duration
}

window.onload = () => {
  renderTrain();
  renderCarousel("carousel1");
  renderCarousel("carousel2");
  updateCart();
};