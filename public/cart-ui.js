const cartItemsEl = document.getElementById("cart-items");
const cartRowTemplate = document.getElementById("cart-row-template");
const cartEmptyTemplate = document.getElementById("cart-empty-template");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartClearBtn = document.getElementById("cart-clear");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");

function renderCart() {
  const cart = getCart();
  const ids = Object.keys(cart).filter(id => cart[id] > 0);
  cartItemsEl.replaceChildren();
  let total = 0;
  let count = 0;

  ids.forEach(id => {
    const p = PRODUCTS.find(x => String(x.id) === id);
    if (!p) return;
    const qty = cart[id];
    total += p.price * qty;
    count += qty;
    const row = cartRowTemplate.content.firstElementChild.cloneNode(true);
    const image = row.querySelector(".cart-item-img");
    image.src = p.image;
    image.alt = p.name;
    row.querySelector("[data-cart-name]").textContent = p.name;
    row.querySelector("[data-cart-quantity]").textContent = ` ${qty} `;
    row.querySelector("[data-cart-subtotal]").textContent = formatMXN(p.price * qty);
    row.querySelectorAll("button[data-action]").forEach(button => {
      button.dataset.id = id;
    });
    cartItemsEl.appendChild(row);
  });

  if (count === 0) {
    cartItemsEl.appendChild(cartEmptyTemplate.content.firstElementChild.cloneNode(true));
  }

  cartClearBtn.disabled = count === 0;
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

cartClearBtn.addEventListener("click", () => {
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

checkoutBtn.addEventListener("click", () => {
  window.location.assign("checkout.html");
});

window.addEventListener("storage", () => renderCart());
renderCart();
