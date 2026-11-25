const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));
const product = PRODUCTS.find(p => p.id === productId);
const detailEl = document.getElementById("product-detail");

function copyDetailTemplate(id) {
  return document.getElementById(id).content.cloneNode(true);
}

function fillDetailPrice(priceRow, item) {
  priceRow.querySelector(".price").textContent = formatMXN(item.price);
  const originalPrice = priceRow.querySelector(".original-price");
  if (item.onSale && item.originalPrice) {
    originalPrice.textContent = formatMXN(item.originalPrice);
  } else {
    originalPrice.previousSibling.remove();
    originalPrice.remove();
  }
}

if (!product) {
  detailEl.append(copyDetailTemplate("detail-empty-template"));
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

  const detail = copyDetailTemplate("detail-template");
  const mainImg = detail.querySelector("#main-detail-img");
  mainImg.src = gallery[0];
  mainImg.alt = product.name;

  const thumbRow = detail.querySelector(".thumb-row");
  if (gallery.length > 1) {
    gallery.forEach((image, index) => {
      const thumb = copyDetailTemplate("detail-thumb-template").firstElementChild;
      thumb.dataset.index = index;
      thumb.setAttribute("aria-label", `Ver foto ${index + 1}`);
      thumb.setAttribute("aria-pressed", String(index === 0));
      thumb.querySelector("img").src = image;
      thumbRow.append(thumb);
    });
  } else {
    detail.querySelector(".gallery-arrows").remove();
    thumbRow.remove();
  }

  detail.querySelector(".brand-tag").textContent = product.brand;
  detail.querySelector("#product-title").textContent = product.name;
  detail.querySelector(".detail-desc").textContent = product.description || "";
  fillDetailPrice(detail.querySelector(".price-row"), product);

  const sizeOptions = detail.querySelector("#size-options");
  product.sizes.forEach(size => {
    const button = copyDetailTemplate("detail-size-template").firstElementChild;
    button.dataset.size = size;
    button.textContent = size;
    sizeOptions.append(button);
  });

  const recommendationSection = detail.querySelector(".detail-recommendations");
  if (recommendations.length) {
    const recommendationGrid = recommendationSection.querySelector(".detail-recommendation-grid");
    recommendations.forEach(item => {
      const card = copyDetailTemplate("detail-recommendation-template").firstElementChild;
      card.href = `product.html?id=${encodeURIComponent(item.id)}`;
      card.querySelector(".card-swatch").src = item.image;
      card.querySelector(".brand-tag").textContent = item.brand;
      card.querySelector("h3").textContent = item.name;
      fillDetailPrice(card.querySelector(".price-row"), item);
      recommendationGrid.append(card);
    });
  } else {
    recommendationSection.remove();
  }

  detailEl.append(detail);
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
