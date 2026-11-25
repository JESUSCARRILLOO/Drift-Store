const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const filterInfo = document.getElementById("filter-info");
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const categoryFilter = document.getElementById("category-filter");
const initialParams = new URLSearchParams(window.location.search);
const initialCategory = initialParams.get("category");
const sectionCategory = categoryFilter && ["hombre", "mujer"].includes(initialCategory) ? initialCategory : "";
const brandFilter = document.getElementById("brand-filter");
const availabilityFilter = document.getElementById("availability-filter");
const sortSelect = document.getElementById("sort-select");
const arrivalHero = document.querySelector(".arrival-hero");
const catalogCount = document.getElementById("catalog-count");
let productSource = typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) ? PRODUCTS : [];
let activeFilters = { category: "", brand: "", availability: "", query: "" };

function setActiveNav() {
  if (!mainNav) return;

  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  const page = pathname.split("/").pop().toLocaleLowerCase("en");
  const params = new URLSearchParams(window.location.search);
  let activeHref = "index.html";

  if (page === "catalog.html") {
    if (sectionCategory) activeHref = `catalog.html?category=${sectionCategory}`;
    else if (params.get("brand")) activeHref = "brands.html";
    else if (params.get("filter") === "sale") activeHref = "catalog.html?filter=sale";
    else if (params.get("category") === "hombre") activeHref = "catalog.html?category=hombre";
    else if (params.get("category") === "mujer") activeHref = "catalog.html?category=mujer";
    else activeHref = "catalog.html";
  } else if (page === "new-arrivals.html") {
    activeHref = "new-arrivals.html";
  } else if (page === "brands.html") {
    activeHref = "brands.html";
  } else if (page === "product.html") {
    activeHref = "catalog.html";
  }

  const links = mainNav.querySelectorAll("a");
  links.forEach(link => link.removeAttribute("aria-current"));
  const activeLink = [...links].find(link => link.getAttribute("href") === activeHref);
  if (activeLink) activeLink.setAttribute("aria-current", "page");
}

function syncCatalogUrl() {
  const params = new URLSearchParams();
  if (activeFilters.category) params.set("category", activeFilters.category);
  if (activeFilters.brand) params.set("brand", activeFilters.brand);
  if (activeFilters.availability === "sale") params.set("filter", "sale");
  else if (activeFilters.favorites) params.set("filter", "favorites");
  if (activeFilters.query) params.set("q", activeFilters.query);

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (nextUrl !== currentUrl) window.history.replaceState(window.history.state, "", nextUrl);
  setActiveNav();
}

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
    const message = arrivalHero ? "Por ahora no hay nuevas incorporaciones." : activeFilters.query
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
  if (mode === "newest") sorted.sort((a, b) => Number(b.id) - Number(a.id));
  if (mode === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name, "es"));
  if (mode === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (mode === "price-desc") sorted.sort((a, b) => b.price - a.price);
  return sorted;
}

function renderArrivalFeature(product) {
  arrivalHero.classList.toggle("hidden", !product);
  if (!product) return;

  const mainImage = arrivalHero.querySelector(".arrival-hero-main");
  mainImage.src = product.image;
  mainImage.alt = product.name;

  const detailImage = arrivalHero.querySelector(".arrival-hero-detail");
  const detail = product.images?.find(image => image !== product.image);
  detailImage.classList.toggle("hidden", !detail);
  arrivalHero.classList.toggle("has-detail", Boolean(detail));
  if (detail) {
    detailImage.src = detail;
    detailImage.alt = `Otra vista de ${product.name}`;
  }

  arrivalHero.querySelector("#arrival-feature-name").textContent = product.name;
  arrivalHero.querySelector("#arrival-feature-description").textContent = product.description || "";
  arrivalHero.querySelector("#arrival-feature-price").innerHTML = priceHTML(product);
  arrivalHero.querySelector(".arrival-cta").href = `product.html?id=${encodeURIComponent(product.id)}`;
}

function renderArrivals() {
  const arrivals = productSource.filter(product => product.isNewArrival === true);
  const featured = arrivals.find(product => product.featuredArrival === true) ?? arrivals[0];
  const recent = arrivals.filter(product => product !== featured).slice(0, 6);
  const onlyFeatured = Boolean(featured) && recent.length === 0;
  renderArrivalFeature(featured);
  grid.previousElementSibling.classList.toggle("hidden", onlyFeatured);
  grid.classList.toggle("hidden", onlyFeatured);
  renderProducts(recent);
}

function updateCatalog() {
  if (!grid) return;
  if (arrivalHero) {
    renderArrivals();
    return;
  }
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
  const hasFilters = Boolean((activeFilters.category && !sectionCategory) || activeFilters.brand || activeFilters.availability || activeFilters.query || activeFilters.favorites);
  renderProducts(sortedProducts);
  if (catalogCount) catalogCount.textContent = `${sortedProducts.length} ${sortedProducts.length === 1 ? "producto" : "productos"}`;
  syncCatalogUrl();

  if (filterInfo) {
    filterInfo.classList.toggle("hidden", !hasFilters);
    filterInfo.textContent = hasFilters ? "Limpiar búsqueda y filtros" : "";
  }
}

function applyFilter(type, value) {
  if (type === "all") {
    activeFilters = { category: sectionCategory, brand: "", availability: "", query: "", favorites: false };
    if (categoryFilter) categoryFilter.value = sectionCategory;
    if (brandFilter) brandFilter.value = "";
    if (availabilityFilter) availabilityFilter.value = "";
    if (searchInput) searchInput.value = "";
  } else if (type === "category" && !sectionCategory) {
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
  const sectionProducts = sectionCategory
    ? productSource.filter(product => product.category === sectionCategory)
    : productSource;
  const brands = [...new Set(sectionProducts.map(product => product.brand).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));
  brands.forEach(brand => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });
  const selectedBrand = activeFilters.brand.toLocaleLowerCase("es");
  activeFilters.brand = brands.find(brand => brand.toLocaleLowerCase("es") === selectedBrand) ?? "";
  brandFilter.value = activeFilters.brand;
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

const homeHero = document.getElementById("home-hero");
if (homeHero) {
  const heroSlides = [...homeHero.querySelectorAll("[data-hero-slide]")];
  const heroIndicators = [...homeHero.querySelectorAll("[data-hero-to]")];
  const heroStatus = document.getElementById("home-hero-status");
  let activeHero = 0;
  let autoplayTimer = null;
  const autoplayDelay = 6000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showHero(index) {
    activeHero = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeHero;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    heroIndicators.forEach((indicator, indicatorIndex) => {
      if (indicatorIndex === activeHero) indicator.setAttribute("aria-current", "true");
      else indicator.removeAttribute("aria-current");
    });
    if (heroStatus) heroStatus.textContent = `${activeHero + 1} / ${heroSlides.length}`;
  }

  function stopAutoplay() {
    window.clearTimeout(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();
    if (reducedMotion || document.hidden || homeHero.matches(":hover") || homeHero.contains(document.activeElement)) return;
    autoplayTimer = window.setTimeout(() => {
      showHero(activeHero + 1);
      startAutoplay();
    }, autoplayDelay);
  }

  function moveHero(index) {
    showHero(index);
    startAutoplay();
  }

  heroIndicators.forEach(indicator => indicator.addEventListener("click", () => moveHero(Number(indicator.dataset.heroTo))));
  homeHero.querySelector("[data-hero-prev]")?.addEventListener("click", () => moveHero(activeHero - 1));
  homeHero.querySelector("[data-hero-next]")?.addEventListener("click", () => moveHero(activeHero + 1));
  homeHero.addEventListener("mouseenter", stopAutoplay);
  homeHero.addEventListener("mouseleave", startAutoplay);
  homeHero.addEventListener("focusin", stopAutoplay);
  homeHero.addEventListener("focusout", event => {
    if (!homeHero.contains(event.relatedTarget)) startAutoplay();
  });
  document.addEventListener("visibilitychange", () => document.hidden ? stopAutoplay() : startAutoplay());
  homeHero.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveHero(activeHero - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveHero(activeHero + 1);
    }
  });
  showHero(0);
  startAutoplay();
}

const homeSaleCarousel = document.getElementById("home-sale-carousel");
if (homeSaleCarousel) {
  const saleSlides = [...homeSaleCarousel.querySelectorAll("[data-sale-slide]")];
  const saleIndicators = [...homeSaleCarousel.querySelectorAll("[data-sale-to]")];
  const saleStatus = document.getElementById("home-sale-status");
  let activeSale = 0;
  let saleTimer = null;
  const saleReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showSale(index) {
    activeSale = (index + saleSlides.length) % saleSlides.length;
    saleSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSale;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });
    saleIndicators.forEach((indicator, indicatorIndex) => {
      if (indicatorIndex === activeSale) indicator.setAttribute("aria-current", "true");
      else indicator.removeAttribute("aria-current");
    });
    if (saleStatus) saleStatus.textContent = `${activeSale + 1} / ${saleSlides.length}`;
  }

  function stopSaleAutoplay() {
    window.clearTimeout(saleTimer);
    saleTimer = null;
  }

  function startSaleAutoplay() {
    stopSaleAutoplay();
    if (saleReducedMotion || document.hidden || homeSaleCarousel.matches(":hover") || homeSaleCarousel.contains(document.activeElement)) return;
    saleTimer = window.setTimeout(() => {
      showSale(activeSale + 1);
      startSaleAutoplay();
    }, 5000);
  }

  function moveSale(index) {
    showSale(index);
    startSaleAutoplay();
  }

  saleIndicators.forEach(indicator => indicator.addEventListener("click", () => moveSale(Number(indicator.dataset.saleTo))));
  homeSaleCarousel.querySelector("[data-sale-prev]")?.addEventListener("click", () => moveSale(activeSale - 1));
  homeSaleCarousel.querySelector("[data-sale-next]")?.addEventListener("click", () => moveSale(activeSale + 1));
  homeSaleCarousel.addEventListener("mouseenter", stopSaleAutoplay);
  homeSaleCarousel.addEventListener("mouseleave", startSaleAutoplay);
  homeSaleCarousel.addEventListener("focusin", stopSaleAutoplay);
  homeSaleCarousel.addEventListener("focusout", event => {
    if (!homeSaleCarousel.contains(event.relatedTarget)) startSaleAutoplay();
  });
  homeSaleCarousel.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSale(activeSale - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSale(activeSale + 1);
    }
  });
  document.addEventListener("visibilitychange", () => document.hidden ? stopSaleAutoplay() : startSaleAutoplay());
  showSale(0);
  startSaleAutoplay();
}

function setCatalogProducts(products) {
  if (!Array.isArray(products)) return;
  productSource = products;
  populateBrands();
  populateBrandDirectory();
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
if (searchInput && !arrivalHero) searchInput.addEventListener("input", () => {
  activeFilters.query = searchInput.value.trim();
  updateCatalog();
});
if (categoryFilter && !sectionCategory) categoryFilter.addEventListener("change", () => {
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

if (sectionCategory) {
  const isMensSection = sectionCategory === "hombre";
  const title = document.getElementById("catalog-title");
  const cover = title.closest(".catalog-intro");
  const media = cover.querySelector(".catalog-category-media");
  const photo = media.querySelector(".catalog-category-photo");
  title.textContent = isMensSection ? "Hombre" : "Mujer";
  cover.dataset.category = sectionCategory;
  photo.src = isMensSection ? "images/drift-home-campaign-1.jpg" : "images/drift-home-campaign-2.jpg";
  media.hidden = false;
  document.title = `${title.textContent} - DRIFT Sneakers`;
  categoryFilter.closest(".filter-control").classList.add("hidden");
  categoryFilter.disabled = true;
  document.body.classList.add("catalog-category-page");
  searchInput?.form?.addEventListener("submit", event => event.preventDefault());
}

setActiveNav();
activeFilters.category = initialParams.get("category") || "";
activeFilters.brand = initialParams.get("brand") || "";
activeFilters.query = initialParams.get("q") || "";
if (initialParams.get("filter") === "sale") activeFilters.availability = "sale";
if (initialParams.get("filter") === "favorites") activeFilters.favorites = true;
if (searchInput && !arrivalHero) searchInput.value = activeFilters.query;
if (categoryFilter) categoryFilter.value = activeFilters.category;
if (availabilityFilter) availabilityFilter.value = activeFilters.availability;
populateBrands();
populateBrandDirectory();
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
if (favoriteFilterButton && !arrivalHero) favoriteFilterButton.addEventListener("click", () => {
  activeFilters.favorites = true;
  updateCatalog();
});
