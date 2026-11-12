const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const filterInfo = document.getElementById("filter-info");
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const categoryFilter = document.getElementById("category-filter");
const brandFilter = document.getElementById("brand-filter");
const availabilityFilter = document.getElementById("availability-filter");
const sortSelect = document.getElementById("sort-select");
const catalogCount = document.getElementById("catalog-count");
let productSource = typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) ? PRODUCTS : [];
let activeFilters = { category: "", brand: "", availability: "", query: "" };

function closeMenu({ restoreFocus = false } = {}) {
  if (!menuToggle || !mainNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("is-open");
  if (restoreFocus) menuToggle.focus();
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.addEventListener("click", e => {
    if (e.target.closest("a")) closeMenu();
  });

  document.addEventListener("click", e => {
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu({ restoreFocus: true });
    }
  });
}

function priceHTML(p) {
  if (p.onSale && p.originalPrice) {
    return `<span class="price">${formatMXN(p.price)}</span> <span class="original-price">${formatMXN(p.originalPrice)}</span>`;
  }
  return `<span class="price">${formatMXN(p.price)}</span>`;
}

function renderProducts(list) {
  if (!grid) return;
  grid.innerHTML = "";
  if (list.length === 0) {
    const message = activeFilters.query
      ? `No encontramos productos para “${activeFilters.query}”. Prueba con otro término o limpia los filtros.`
      : "No hay productos que coincidan con estos filtros.";
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = message;
    grid.appendChild(emptyState);
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    const favorite = isFavorite(p.id);
    card.className = "card";
    card.innerHTML = `
      <a href="product.html?id=${encodeURIComponent(p.id)}" class="card-link">
        <img class="card-swatch" src="${p.image}" alt="${p.name}" />
        ${p.onSale ? '<span class="sale-badge">Oferta</span>' : ''}
        <div class="card-body">
          <span class="brand-tag">${p.brand}</span>
          <h4>${p.name}</h4>
          <div class="price-row">${priceHTML(p)}</div>
        </div>
      </a>
      <div class="card-actions">
        <button class="fav-btn" type="button" data-id="${p.id}" aria-label="${favorite ? "Quitar de favoritos" : "Añadir a favoritos"}: ${p.name}" aria-pressed="${favorite}">${favorite ? "♥" : "♡"}</button>
        <button class="add-btn" type="button" data-id="${p.id}">Añadir al carrito</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function sortProducts(list, mode) {
  const sorted = [...list];
  if (mode === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
  if (mode === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (mode === "price-desc") sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

function updateCatalog() {
  if (!grid) return;
  const query = activeFilters.query.toLocaleLowerCase("es");
  let list = productSource.filter(product => {
    const matchesQuery = !query || [product.name, product.brand, product.category]
      .filter(Boolean).some(value => String(value).toLocaleLowerCase("es").includes(query));
    const matchesCategory = !activeFilters.category || product.category === activeFilters.category;
    const matchesBrand = !activeFilters.brand || product.brand?.toLocaleLowerCase("es") === activeFilters.brand.toLocaleLowerCase("es");
    const matchesAvailability = !activeFilters.availability || Boolean(product.onSale);
    return matchesQuery && matchesCategory && matchesBrand && matchesAvailability;
  });

  if (activeFilters.favorites) list = list.filter(product => isFavorite(product.id));
  const sortedProducts = sortProducts(list, sortSelect?.value || "featured");
  renderProducts(sortedProducts);
  if (catalogCount) catalogCount.textContent = `${sortedProducts.length} ${sortedProducts.length === 1 ? "producto" : "productos"}`;

  const hasFilters = Boolean(activeFilters.category || activeFilters.brand || activeFilters.availability || activeFilters.query || activeFilters.favorites);
  if (filterInfo) {
    filterInfo.classList.toggle("hidden", !hasFilters);
    filterInfo.textContent = hasFilters ? "Limpiar búsqueda y filtros" : "";
  }
}

function applyFilter(type, value) {
  if (type === "all") {
    activeFilters = { category: "", brand: "", availability: "", query: "", favorites: false };
    if (categoryFilter) categoryFilter.value = "";
    if (brandFilter) brandFilter.value = "";
    if (availabilityFilter) availabilityFilter.value = "";
    if (searchInput) searchInput.value = "";
  } else if (type === "category") {
    activeFilters.category = value || "";
    if (categoryFilter) categoryFilter.value = activeFilters.category;
  } else if (type === "brand") {
    activeFilters.brand = value || "";
    if (brandFilter) brandFilter.value = activeFilters.brand;
  } else if (type === "sale") {
    activeFilters.availability = "sale";
    if (availabilityFilter) availabilityFilter.value = "sale";
  } else if (type === "favorites") {
    activeFilters.favorites = true;
  }
  updateCatalog();
}

function populateBrands() {
  if (!brandFilter) return;
  while (brandFilter.options.length > 1) brandFilter.remove(1);
  const brands = [...new Set(productSource.map(product => product.brand).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));
  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });
}

function populateBrandDirectory() {
  const directory = document.getElementById("brand-directory");
  if (!directory) return;
  directory.innerHTML = "";
  const brands = [...new Set(productSource.map(product => product.brand).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));
  brands.forEach(brand => {
    const link = document.createElement("a");
    link.href = `catalog.html?brand=${encodeURIComponent(brand)}`;
    link.textContent = brand;
    directory.appendChild(link);
  });
}

function setCatalogProducts(products) {
  if (!Array.isArray(products)) return;
  productSource = products;
  populateBrands();
  populateBrandDirectory();
  if (brandFilter && ![...brandFilter.options].some(option => option.value === activeFilters.brand)) {
    activeFilters.brand = "";
    brandFilter.value = "";
  }
  updateCatalog();
}

window.setCatalogProducts = setCatalogProducts;

document.querySelectorAll('[data-filter-type]').forEach(el => {
  el.addEventListener("click", e => {
    if (el.matches("a[href]") && el.getAttribute("href") !== "#colecciones") return;
    e.preventDefault();
    applyFilter(el.dataset.filterType, el.dataset.filterValue);
  });
});

if (filterInfo) filterInfo.addEventListener("click", () => applyFilter("all"));
if (searchInput) searchInput.addEventListener("input", () => {
  activeFilters.query = searchInput.value.trim();
  updateCatalog();
});
if (categoryFilter) categoryFilter.addEventListener("change", () => {
  activeFilters.category = categoryFilter.value;
  updateCatalog();
});
if (brandFilter) brandFilter.addEventListener("change", () => {
  activeFilters.brand = brandFilter.value;
  updateCatalog();
});
if (availabilityFilter) availabilityFilter.addEventListener("change", () => {
  activeFilters.availability = availabilityFilter.value;
  updateCatalog();
});
if (sortSelect) sortSelect.addEventListener("change", updateCatalog);

const initialParams = new URLSearchParams(window.location.search);
activeFilters.category = initialParams.get("category") || "";
activeFilters.brand = initialParams.get("brand") || "";
activeFilters.query = initialParams.get("q") || "";
if (initialParams.get("filter") === "sale") activeFilters.availability = "sale";
if (initialParams.get("filter") === "favorites") activeFilters.favorites = true;
if (searchInput) searchInput.value = activeFilters.query;
if (categoryFilter) categoryFilter.value = activeFilters.category;
if (availabilityFilter) availabilityFilter.value = activeFilters.availability;
populateBrands();
populateBrandDirectory();
if (brandFilter) brandFilter.value = activeFilters.brand;
updateCatalog();

if (grid) grid.addEventListener("click", e => {
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
    updateCatalog();
  }
});

const favoriteFilterButton = document.getElementById("fav-filter-btn");
if (favoriteFilterButton) favoriteFilterButton.addEventListener("click", () => {
  activeFilters.favorites = true;
  updateCatalog();
});
