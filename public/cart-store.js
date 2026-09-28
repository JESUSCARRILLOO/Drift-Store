// Carrito y favoritos guardados en el navegador (localStorage)
function getCart() {
  return JSON.parse(localStorage.getItem("drift_cart") || "{}");
}
function saveCart(cart) {
  localStorage.setItem("drift_cart", JSON.stringify(cart));
}
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const key = String(productId);
  cart[key] = (cart[key] || 0) + qty;
  saveCart(cart);
}
function updateCartQty(productId, delta) {
  const cart = getCart();
  const key = String(productId);
  cart[key] = Math.max(0, (cart[key] || 0) + delta);
  if (cart[key] === 0) delete cart[key];
  saveCart(cart);
}
function clearCart() {
  localStorage.setItem("drift_cart", "{}");
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("drift_favorites") || "[]");
}
function toggleFavorite(productId) {
  const favs = getFavorites();
  const id = String(productId);
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(id);
  localStorage.setItem("drift_favorites", JSON.stringify(favs));
}
function isFavorite(productId) {
  return getFavorites().includes(String(productId));
}

function formatMXN(amount) {
  return amount.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}
