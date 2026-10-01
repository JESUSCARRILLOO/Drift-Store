const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const filterInfo = document.getElementById("filter-info");

function priceHTML(p) {
  if (p.onSale && p.originalPrice) {
    return `<span class="price">${formatMXN(p.price)}</span> <span class="original-price">${formatMXN(p.originalPrice)}</span>`;
  }
  return `<span class="price">${formatMXN(p.price)}</span>`;
}

function renderProducts(list) {
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = `<p style="color:var(--muted)">No se encontraron productos.</p>`;
    return;
  }
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <a href="product.html?id=${p.id}" target="_blank" class="card-link">
        <img class="card-swatch" src="${p.image}" alt="${p.name}" />
        ${p.onSale ? '<span class="sale-badge">Oferta</span>' : ''}
        <div class="card-body">
          <span class="brand-tag">${p.brand}</span>
          <h4>${p.name}</h4>
          <div class="price-row">${priceHTML(p)}</div>
        </div>
      </a>
      <div class="card-actions">
        <button class="fav-btn" data-id="${p.id}">${isFavorite(p.id) ? "❤️" : "🤍"}</button>
        <button class="add-btn" data-id="${p.id}">Añadir al carrito</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function applyFilter(type, value) {
  let list = PRODUCTS;
  let label = "";

  if (type === "category") {
    list = PRODUCTS.filter(p => p.category === value);
    label = `Mostrando: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
  } else if (type === "brand") {
    list = PRODUCTS.filter(p => p.brand.toLowerCase() === value.toLowerCase());
    label = `Mostrando: ${value}`;
  } else if (type === "sale") {
    list = PRODUCTS.filter(p => p.onSale);
    label = "Mostrando: Ofertas";
  } else if (type === "favorites") {
    list = PRODUCTS.filter(p => isFavorite(p.id));
    label = "Mostrando: Favoritos";
  } else {
    list = PRODUCTS;
    label = "";
  }

  renderProducts(list);
  if (label) {
    filterInfo.textContent = label + "  ✕ Quitar filtro";
    filterInfo.classList.remove("hidden");
  } else {
    filterInfo.classList.add("hidden");
  }
  searchInput.value = "";
}

document.querySelectorAll('[data-filter-type]').forEach(el => {
  el.addEventListener("click", e => {
    e.preventDefault();
    applyFilter(el.dataset.filterType, el.dataset.filterValue);
  });
});

filterInfo.addEventListener("click", () => applyFilter("all"));

renderProducts(PRODUCTS);

searchInput.addEventListener("input", () => {
  filterInfo.classList.add("hidden");
  const q = searchInput.value.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
  );
  renderProducts(filtered);
});

grid.addEventListener("click", e => {
  const addBtn = e.target.closest(".add-btn");
  if (addBtn) {
    addToCart(addBtn.dataset.id, 1);
    renderCart();
    openCart();
    return;
  }
  const favBtn = e.target.closest(".fav-btn");
  if (favBtn) {
    toggleFavorite(favBtn.dataset.id);
    favBtn.textContent = isFavorite(favBtn.dataset.id) ? "❤️" : "🤍";
  }
});

document.getElementById("fav-filter-btn").addEventListener("click", () => {
  applyFilter("favorites");
});
