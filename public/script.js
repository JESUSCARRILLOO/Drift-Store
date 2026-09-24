const grid = document.getElementById("product-grid");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutMsg = document.getElementById("checkout-msg");

let cart = {}; // { productId: qty }

// Renderizar catálogo
PRODUCTS.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img class="card-swatch" src="${p.image}" alt="${p.name}" />
    <div class="card-body">
      <h4>${p.name}</h4>
      <div class="price">$${p.price.toFixed(2)}</div>
      <button data-id="${p.id}">Añadir al carrito</button>
    </div>
  `;
  grid.appendChild(card);
});

grid.addEventListener("click", e => {
  const btn = e.target.closest("button[data-id]");
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  openCart();
});

function renderCart() {
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  cartItemsEl.innerHTML = "";
  let total = 0;
  let count = 0;

  ids.forEach(id => {
    const p = PRODUCTS.find(x => x.id === id);
    const qty = cart[id];
    total += p.price * qty;
    count += qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span>${p.name}</span>
      <div class="qty-controls">
        <button data-action="dec" data-id="${id}">−</button>
        <span> ${qty} </span>
        <button data-action="inc" data-id="${id}">+</button>
      </div>
      <span>$${(p.price * qty).toFixed(2)}</span>
    `;
    cartItemsEl.appendChild(row);
  });

  cartCountEl.textContent = count;
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
  checkoutBtn.disabled = count === 0;
}

cartItemsEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === "inc") cart[id]++;
  if (btn.dataset.action === "dec") cart[id] = Math.max(0, cart[id] - 1);
  renderCart();
});

// Abrir / cerrar panel del carrito
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
function openCart() { cartPanel.classList.add("open"); cartOverlay.classList.add("open"); }
function closeCart() { cartPanel.classList.remove("open"); cartOverlay.classList.remove("open"); }
document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Checkout real vía Stripe (llama a la función serverless /api/create-checkout-session)
checkoutBtn.addEventListener("click", async () => {
  const items = Object.keys(cart)
    .filter(id => cart[id] > 0)
    .map(id => ({ id, qty: cart[id] }));

  if (items.length === 0) return;

  checkoutBtn.disabled = true;
  checkoutMsg.textContent = "Redirigiendo a pago seguro…";

  try {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url; // Redirige a Stripe Checkout
    } else {
      checkoutMsg.textContent = "Error al iniciar el pago. Intenta de nuevo.";
      checkoutBtn.disabled = false;
    }
  } catch (err) {
    checkoutMsg.textContent = "No se pudo conectar con el servidor de pagos.";
    checkoutBtn.disabled = false;
  }
});
