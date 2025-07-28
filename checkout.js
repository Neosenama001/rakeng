function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div class="cart-details">
        <h4>${item.name}</h4>
        <p>Price: R${item.price}</p>
        <p>Subtotal: R${itemTotal}</p>
        <div class="qty-controls">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(div);
  });

  document.getElementById("popup-total").innerText = total;
  document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function changeQty(index, delta) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function sendWhatsAppOrder() {
  const phoneInput = document.getElementById("phone").value.trim();
  if (!phoneInput) {
    alert("Please enter your phone number.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let message = "Hello! I'd like to place an order:%0A%0A";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    message += `• ${item.name} x ${item.quantity} - R${subtotal}%0A`;
    total += subtotal;
  });

  message += `%0ATotal: R${total}%0A`;
  message += `My Phone Number: ${phoneInput}`;

  const whatsappNumber = "27625741296"; // Replace with your number
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;
  window.open(url, "_blank");
}

function toggleCartPopup() {
  const popup = document.getElementById("cart-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
}

window.onload = loadCart;



