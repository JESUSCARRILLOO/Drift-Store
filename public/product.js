const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));
const product = PRODUCTS.find(p => p.id === productId);
const detailEl = document.getElementById("product-detail");

if (!product) {
  detailEl.innerHTML = `<p style="text-align:center;padding:80px 6%;">Producto no encontrado.</p>`;
} else {
  let selectedSize = null;
  let currentIndex = 0;
  const gallery = product.images && product.images.length ? product.images : [product.image];

  detailEl.innerHTML = `
    <div class="detail-grid">
      <div class="detail-gallery">
        <div class="main-img-wrap">
          <button id="prev-img" class="arrow-btn">‹</button>
          <img id="main-detail-img" class="detail-img" src="${gallery[0]}" alt="${product.name}" />
          <button id="next-img" class="arrow-btn">›</button>
        </div>
        <div class="thumb-row">
          ${gallery.map((img, i) => `<img class="thumb ${i === 0 ? 'selected' : ''}" src="${img}" data-index="${i}" alt="${product.name} vista ${i + 1}" />`).join("")}
        </div>
      </div>
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

  const mainImg = document.getElementById("main-detail-img");
  const thumbs = document.querySelectorAll(".thumb");

  function showImage(index) {
    currentIndex = (index + gallery.length) % gallery.length;
    mainImg.src = gallery[currentIndex];
    thumbs.forEach(t => t.classList.remove("selected"));
    thumbs[currentIndex].classList.add("selected");
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => showImage(Number(thumb.dataset.index)));
  });
  document.getElementById("prev-img").addEventListener("click", () => showImage(currentIndex - 1));
  document.getElementById("next-img").addEventListener("click", () => showImage(currentIndex + 1));

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
