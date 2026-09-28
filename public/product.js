const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));
const product = PRODUCTS.find(p => p.id === productId);
const detailEl = document.getElementById("product-detail");

if (!product) {
  detailEl.innerHTML = `<p style="text-align:center;padding:80px 6%;">Producto no encontrado.</p>`;
} else {
  let selectedSize = null;
  detailEl.innerHTML = `
    <div class="detail-grid">
      <img class="detail-img" src="${product.image}" alt="${product.name}" />
      <div class="detail-info">
        <span class="brand-tag">${product.brand}</span>
        <h1>${product.name}</h1>
        <div class="price-row">
          ${product.onSale && product.originalPrice
            ? `<span class="price">${formatMXN(product.price)}</span> <span class="original-price">${formatMXN(product.originalPrice)}</span>`
            : `<span class="price">${formatMXN(product.price)}</span>`}
        </div>
        <p class="detail-desc">${product.description || ""}</p>
        <p class="size-label">Selecciona tu talla (MX):</p>
        <div id="size-options" class="size-options">
          ${product.sizes.map(s => `<button class="size-btn" data-size="${s}">${s}</button>`).join("")}
        </div>
        <button id="add-detail-btn" class="btn-primary" disabled>Añadir al carrito</button>
        <p id="size-msg" class="checkout-msg"></p>
      </div>
    </div>
  `;

  const sizeButtons = document.querySelectorAll(".size-btn");
  const addBtn = document.getElementById("add-detail-btn");
  const sizeMsg = document.getElementById("size-msg");

  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = btn.dataset.size;
      addBtn.disabled = false;
    });
  });

  addBtn.addEventListener("click", () => {
    addToCart(product.id, 1);
    sizeMsg.textContent = `Agregado: talla ${selectedSize}`;
    renderCart();
  });
}
