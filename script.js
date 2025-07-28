const platters = [
  { id: 1, name: "Premium Platter", time: "15 mins", price: 249.99, desc: "Grilled chicken, spicy wings, samosas, fries." },
  { id: 2, name: "Mini Platter", time: "10 mins", price: 169.99, desc: "Mini sliders, spicy fries, nuggets." },
  { id: 3, name: "Premium Platter", time: "15 mins", price: 249.99, desc: "Grilled chicken, spicy wings, samosas, fries." },
  { id: 4, name: "Mini Platter", time: "10 mins", price: 169.99, desc: "Mini sliders, spicy fries, nuggets." },
  { id: 5, name: "Mini Platter", time: "10 mins", price: 169.99, desc: "Mini sliders, spicy fries, nuggets." }
];

const popularDishes = [
  { id: 6, name: "Patty Planet", time: "12 mins", price: 59.99, desc: "Beef patty, fresh lettuce, tomato, cheese." },
  { id: 7, name: "Triple Planet", time: "8 mins", price: 69.99, desc: "Three stacked patties, BBQ sauce, onion rings." }
];

const quickBites = [
  { id: 8, name: "Hotdog", time: "10 mins", price: 40, desc: "Classic hotdog, mustard, ketchup, fried onions." },
  { id: 9, name: "Chef's Special", time: "20 mins", price: 299.99, desc: "Signature dish by our head chef with gourmet toppings." }
];

function getImageSrc(id) {
  switch (id) {
    case 1: return 'premium_platter.jpg';
    case 2: return 'mini_platter.jpg';
    case 3: return 'patty_planet.jpg';
    case 4: return 'triple_planet.jpg';
    case 5: return 'hotdog.jpg';
    case 6: return 'chefs_special.jpg';
    default: return 'default.jpg';
  }
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
  if (existing) existing.quantity++;
  else cart.push({ ...item, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  renderPopupCart();
}

function updateCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cart-count").textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
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
  cart.forEach((item, idx) => {
    total += item.price * item.quantity;
    const div = document.createElement("div");
    div.className = "popup-item";
    div.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <div>
        <button onclick="changeQty(${idx}, -1)">-</button>
        <button onclick="changeQty(${idx}, 1)">+</button>
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

function showFullscreen(id) {
  const item = [...platters, ...popularDishes, ...quickBites].find(i => i.id === id);
  const container = document.getElementById('fullscreenView');

  container.innerHTML = `
    <div>
      <button class="close-btn" aria-label="Close" onclick="closeFullscreen()">&times;</button>
      <img src="${getImageSrc(id)}" alt="${item.name}" />
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

  container.style.display = 'flex';
  setTimeout(() => container.classList.add('show'), 10);
  container.onclick = e => {
    if (e.target === container) closeFullscreen();
  };
}

function closeFullscreen() {
  const container = document.getElementById('fullscreenView');
  container.classList.remove('show');
  const inner = container.querySelector('div');
  inner.style.opacity = '0';
  inner.style.transform = 'scale(0.8)';
  setTimeout(() => {
    container.style.display = 'none';
    container.innerHTML = '';
  }, 300);
}

window.onload = () => {
  updateCart();
};
