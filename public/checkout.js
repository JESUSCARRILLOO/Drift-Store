const order = document.getElementById("checkout-order");
const empty = document.getElementById("checkout-empty");
const form = document.getElementById("checkout-form");
const itemsEl = document.getElementById("checkout-items");
const continueButton = document.getElementById("checkout-continue");
const statusEl = document.getElementById("checkout-status");
let items = [];
let shippingIncluded = false;
let submitting = false;

function renderOrder() {
  const cart = getCart();
  items = [];
  itemsEl.replaceChildren();
  let subtotal = 0;

  for (const product of PRODUCTS) {
    const qty = cart[product.id];
    if (!Number.isSafeInteger(qty) || qty < 1) continue;

    items.push({ id: product.id, qty });
    const amount = product.price * qty;
    subtotal += amount;
    const row = document.createElement("li");
    const name = document.createElement("span");
    const price = document.createElement("span");
    name.textContent = `${product.name} × ${qty}`;
    price.textContent = formatMXN(amount);
    row.append(name, price);
    itemsEl.append(row);
  }

  shippingIncluded = subtotal > 999;
  order.hidden = items.length === 0;
  empty.hidden = !order.hidden;
  continueButton.disabled = submitting || !shippingIncluded;
  document.getElementById("checkout-subtotal").textContent = formatMXN(subtotal);
  document.getElementById("checkout-shipping").textContent = shippingIncluded ? "Gratis" : "Por confirmar";
  document.getElementById("checkout-total").textContent = shippingIncluded ? formatMXN(subtotal) : "Por confirmar";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitting || !shippingIncluded || new FormData(form).get("method") !== "card") return;

  submitting = true;
  continueButton.disabled = true;
  statusEl.textContent = "Abriendo Stripe…";
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) throw new Error("Checkout request failed");
    const { url } = await response.json();
    if (!url) throw new Error("Checkout URL missing");
    window.location.assign(url);
  } catch {
    submitting = false;
    continueButton.disabled = !shippingIncluded;
    statusEl.textContent = "No se pudo iniciar el pago. Intenta de nuevo.";
  }
});

window.addEventListener("storage", renderOrder);
window.addEventListener("pageshow", () => {
  submitting = false;
  statusEl.textContent = new URLSearchParams(window.location.search).has("canceled")
    ? "El pago se canceló. Puedes intentarlo de nuevo."
    : "";
  renderOrder();
});
renderOrder();
