const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));
const product = PRODUCTS.find(p => p.id === productId);
const detailEl = document.getElementById("product-detail");

if (!product) {
  detailEl.innerHTML = `<h1 id="product-title" class="detail-empty">Producto no encontrado</h1>`;
} else {
  let selectedSize = null;
  let quantity = 1;
  let currentIndex = 0;
  const gallery = product.images && product.images.length ? product.images : [product.image];
  const relevance = item => Number(item.category === product.category) * 2 + Number(item.brand === product.brand);
  const priceDistance = item => Math.abs(item.price - product.price);
  const recommendations = PRODUCTS.filter(item => item.id !== product.id)
    .sort((a, b) => relevance(b) - relevance(a) || priceDistance(a) - priceDistance(b))
    .slice(0, 4);

  detailEl.innerHTML = `
    <div class="detail-grid">
      <div class="detail-gallery">
        <div class="main-img-wrap">
          <img id="main-detail-img" class="detail-img" src="${gallery[0]}" alt="${product.name}" />
          ${gallery.length > 1 ? `
            <div class="gallery-arrows">
              <button id="prev-img" class="arrow-btn" type="button" aria-label="Foto anterior">‹</button>
              <button id="next-img" class="arrow-btn" type="button" aria-label="Foto siguiente">›</button>
            </div>
          ` : ""}
        </div>
        ${gallery.length > 1 ? `
          <div class="thumb-row" role="group" aria-label="Fotos del producto">
            ${gallery.map((img, i) => `
              <button class="thumb" type="button" data-index="${i}" aria-label="Ver foto ${i + 1}" aria-pressed="${i === 0}">
                <img src="${img}" alt="" />
              </button>
            `).join("")}
          </div>
        ` : ""}
      </div>
      <div class="detail-info">
        <span class="brand-tag">${product.brand}</span>
        <h1 id="product-title">${product.name}</h1>
        <div class="price-row">
          ${product.onSale && product.originalPrice
            ? `<span class="price">${formatMXN(product.price)}</span> <span class="original-price">${formatMXN(product.originalPrice)}</span>`
            : `<span class="price">${formatMXN(product.price)}</span>`}
        </div>
        <p class="detail-desc">${product.description || ""}</p>
        <p id="size-label" class="size-label">Selecciona tu talla (MX)</p>
        <div id="size-options" class="size-options" role="group" aria-labelledby="size-label">
          ${product.sizes.map(s => `<button class="size-btn" type="button" data-size="${s}" aria-pressed="false">${s}</button>`).join("")}
        </div>
        <p id="quantity-label" class="size-label">Cantidad de pares</p>
        <div class="detail-purchase">
          <div class="quantity-picker" role="group" aria-labelledby="quantity-label">
            <button id="quantity-minus" type="button" aria-label="Quitar un par" disabled>−</button>
            <output id="detail-quantity">1</output>
            <button id="quantity-plus" type="button" aria-label="Sumar un par">+</button>
          </div>
          <button id="add-detail-btn" class="btn-primary" disabled>Añadir al carrito</button>
        </div>
        <p id="size-msg" class="checkout-msg" role="status"></p>
      </div>
    </div>
    ${recommendations.length ? `
      <section class="detail-recommendations" aria-labelledby="recommendations-title">
        <h2 id="recommendations-title">También te puede gustar</h2>
        <div class="detail-recommendation-grid">
          ${recommendations.map(item => `
            <a class="card-link detail-recommendation" href="product.html?id=${encodeURIComponent(item.id)}">
              <img class="card-swatch" src="${item.image}" alt="" loading="lazy" />
              <div class="card-body">
                <span class="brand-tag">${item.brand}</span>
                <h3>${item.name}</h3>
                <div class="price-row">
                  <span class="price">${formatMXN(item.price)}</span>
                  ${item.onSale && item.originalPrice ? `<span class="original-price">${formatMXN(item.originalPrice)}</span>` : ""}
                </div>
              </div>
            </a>
          `).join("")}
        </div>
      </section>
    ` : ""}
  `;

  const mainImg = document.getElementById("main-detail-img");
  const thumbs = detailEl.querySelectorAll(".thumb");

  function showImage(index) {
    currentIndex = (index + gallery.length) % gallery.length;
    mainImg.src = gallery[currentIndex];
    mainImg.alt = `${product.name}, vista ${currentIndex + 1}`;
    thumbs.forEach((thumb, i) => thumb.setAttribute("aria-pressed", String(i === currentIndex)));
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => showImage(Number(thumb.dataset.index)));
  });
  document.getElementById("prev-img")?.addEventListener("click", () => showImage(currentIndex - 1));
  document.getElementById("next-img")?.addEventListener("click", () => showImage(currentIndex + 1));

  const sizeButtons = document.querySelectorAll(".size-btn");
  const addBtn = document.getElementById("add-detail-btn");
  const sizeMsg = document.getElementById("size-msg");
  const quantityOutput = document.getElementById("detail-quantity");
  const minusBtn = document.getElementById("quantity-minus");

  function changeQuantity(delta) {
    quantity = Math.max(1, quantity + delta);
    quantityOutput.value = quantity;
    minusBtn.disabled = quantity === 1;
    sizeMsg.textContent = "";
  }

  minusBtn.addEventListener("click", () => changeQuantity(-1));
  document.getElementById("quantity-plus").addEventListener("click", () => changeQuantity(1));

  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      selectedSize = selectedSize === btn.dataset.size ? null : btn.dataset.size;
      sizeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.size === selectedSize)));
      addBtn.disabled = selectedSize === null;
      sizeMsg.textContent = "";
    });
  });

  addBtn.addEventListener("click", () => {
    addToCart(product.id, quantity);
    sizeMsg.textContent = `${quantity} ${quantity === 1 ? "par añadido" : "pares añadidos"} al carrito · Talla ${selectedSize} MX`;
    renderCart();
  });
}
