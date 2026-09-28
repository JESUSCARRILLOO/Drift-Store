const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutMsg = document.getElementById("checkout-msg");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");

function renderCart() {
  const cart = getCart();
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  cartItemsEl.innerHTML = "";
  let total = 0;
  let count = 0;

  if (ids.length === 0) {
    cartItemsEl.innerHTML = `<p style="color:var(--muted);text-align:center;">Tu carrito está vacío.</p>`;
  }

  ids.forEach(id => {
    const p = PRODUCTS.find(x => String(x.id) === id);
    if (!p) return;
    const qty = cart[id];
    total += p.price * qty;
    count += qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img class="cart-item-img" src="${p.image}" alt="${p.name}" />
      <div class="cart-item-info">
        <span>${p.name}</span>
        <div class="qty-controls">
          <button data-action="dec" data-id="${id}">−</button>
          <span> ${qty} </span>
          <button data-action="inc" data-id="${id}">+</button>
        </div>
      </div>
      <span>${formatMXN(p.price * qty)}</span>
    `;
    cartItemsEl.appendChild(row);
  });

  cartCountEl.textContent = count;
  cartTotalEl.textContent = formatMXN(total);
  checkoutBtn.disabled = count === 0;
}

cartItemsEl.addEventListener("click", e => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  updateCartQty(btn.dataset.id, btn.dataset.action === "inc" ? 1 : -1);
  renderCart();
});

document.getElementById("cart-clear").addEventListener("click", () => {
  if (confirm("¿Vaciar todo el carrito?")) {
    clearCart();
    renderCart();
  }
});

function openCart() { cartPanel.classList.add("open"); cartOverlay.classList.add("open"); }
function closeCart() { cartPanel.classList.remove("open"); cartOverlay.classList.remove("open"); }
document.getElementById("cart-toggle").addEventListener("click", () => { renderCart(); openCart(); });
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", async () => {
  const cart = getCart();
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
      window.location.href = data.url;
    } else {
      checkoutMsg.textContent = "Error al iniciar el pago. Intenta de nuevo.";
      checkoutBtn.disabled = false;
    }
  } catch (err) {
    checkoutMsg.textContent = "No se pudo conectar con el servidor de pagos.";
    checkoutBtn.disabled = false;
  }
});

window.addEventListener("storage", () => renderCart());
renderCart();
