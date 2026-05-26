const STORAGE_KEYS = {
  user: 'stride-user',
  cart: 'stride-cart',
};

const PRODUCTS = [
  {
    id: 1,
    name: 'Velocity Runner X',
    category: 'buty',
    tag: 'Best seller',
    price: 499,
    color: 'from-red',
    description: 'Lekki model do szybkich treningów z amortyzacją i dynamicznym odbiciem.',
    features: ['Oddychająca cholewka', 'Amortyzacja premium', 'Podeszwa do sprintu'],
  },
  {
    id: 2,
    name: 'Aero Flex Jacket',
    category: 'odziez',
    tag: 'Weather shield',
    price: 349,
    color: 'from-blue',
    description: 'Lekka kurtka sportowa z osłoną przed wiatrem i eleganckim krojem.',
    features: ['Ochrona przed wiatrem', 'Szybkoschnący materiał', 'Dopasowany kaptur'],
  },
  {
    id: 3,
    name: 'CorePulse Hoodie',
    category: 'odziez',
    tag: 'Soft touch',
    price: 279,
    color: 'from-violet',
    description: 'Bluza do miasta i na rozgrzewkę, miękka w dotyku i nowoczesna wizualnie.',
    features: ['Miękki materiał', 'Kieszeń typu kangur', 'Minimalistyczny design'],
  },
  {
    id: 4,
    name: 'Sprint Track Set',
    category: 'odziez',
    tag: 'New drop',
    price: 429,
    color: 'from-green',
    description: 'Zestaw na trening: koszulka i spodenki w lekkim sportowym stylu.',
    features: ['2 części zestawu', 'Technologia dry-fit', 'Sportowy krój'],
  },
  {
    id: 5,
    name: 'AirMotion Backpack',
    category: 'akcesoria',
    tag: 'Daily carry',
    price: 189,
    color: 'from-orange',
    description: 'Plecak z przemyślanym układem kieszeni i trwałą konstrukcją.',
    features: ['Komora na laptop', 'Wzmocniony panel pleców', 'Ukryta kieszeń'],
  },
  {
    id: 6,
    name: 'Pulse Band Pro',
    category: 'akcesoria',
    tag: 'Smart style',
    price: 119,
    color: 'from-pink',
    description: 'Niewielki, stylowy dodatek poprawiający komfort i wygląd treningu.',
    features: ['Lekka forma', 'Regulowany rozmiar', 'Dodatkowy komfort'],
  },
];

const state = {
  activeFilter: 'all',
  search: '',
  currentProductId: null,
};

const money = (value) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);
const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const getUser = () => readJSON(STORAGE_KEYS.user, null);
const getCart = () => readJSON(STORAGE_KEYS.cart, []);
const setCart = (cart) => writeJSON(STORAGE_KEYS.cart, cart);

function getProduct(id) {
  return PRODUCTS.find((product) => product.id === id);
}

function openOverlay() {
  const overlay = document.querySelector('[data-overlay]');
  if (overlay) overlay.classList.add('open');
}

function closeOverlay() {
  const overlay = document.querySelector('[data-overlay]');
  const cart = document.querySelector('[data-cart-drawer]');
  const modal = document.querySelector('[data-product-modal]');
  if (overlay) overlay.classList.remove('open');
  if (cart) cart.classList.remove('open');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function openCart() {
  const cart = document.querySelector('[data-cart-drawer]');
  if (cart) cart.classList.add('open');
  openOverlay();
}

function updateUserUI() {
  const user = getUser();
  const label = document.querySelector('[data-user-label]');
  const loginLink = document.querySelector('.nav-login-link');
  if (label) label.textContent = user ? `Witaj, ${user.name}` : 'Gość';
  if (loginLink) loginLink.textContent = user ? 'Profil' : 'Logowanie';
}

function updateCartCount() {
  const countEl = document.querySelector('[data-cart-count]');
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countEl) countEl.textContent = String(count);
}

function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });

  setCart(cart);
  renderCart();
  updateCartCount();
}

function renderCart() {
  const container = document.querySelector('[data-cart-items]');
  const totalEl = document.querySelector('[data-cart-total]');
  if (!container || !totalEl) return;

  const cart = getCart();
  container.innerHTML = '';

  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty">Koszyk jest pusty. Dodaj coś z kolekcji.</div>';
    totalEl.textContent = money(0);
    return;
  }

  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.qty;

    const row = document.createElement('article');
    row.className = 'cart-item';
    row.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <div>${money(item.price)} / szt.</div>
        <div class="cart-controls">
          <button type="button" data-cart-action="minus" data-id="${item.id}">-</button>
          <span>${item.qty}</span>
          <button type="button" data-cart-action="plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <strong>${money(item.price * item.qty)}</strong>
    `;
    container.appendChild(row);
  });

  totalEl.textContent = money(total);
}

function changeCartQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;
  item.qty += delta;
  const filtered = cart.filter((entry) => entry.qty > 0);
  setCart(filtered);
  renderCart();
  updateCartCount();
}

function clearCart() {
  setCart([]);
  renderCart();
  updateCartCount();
}

function renderProducts() {
  const grid = document.querySelector('[data-products-grid]');
  const template = document.getElementById('product-card-template');
  if (!grid || !template) return;

  const matches = PRODUCTS.filter((product) => {
    const categoryMatch = state.activeFilter === 'all' || product.category === state.activeFilter;
    const search = state.search.trim().toLowerCase();
    const searchMatch = !search || [product.name, product.category, product.description, product.tag].join(' ').toLowerCase().includes(search);
    return categoryMatch && searchMatch;
  });

  grid.innerHTML = '';

  if (!matches.length) {
    grid.innerHTML = '<div class="cart-empty">Brak produktów spełniających filtr. Spróbuj innej frazy.</div>';
    return;
  }

  matches.forEach((product) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.product-card');
    card.dataset.id = String(product.id);

    node.querySelector('.product-badge').textContent = product.tag;
    node.querySelector('.product-media').classList.add(product.color);
    node.querySelector('.product-category').textContent = product.category;
    node.querySelector('.product-title').textContent = product.name;
    node.querySelector('.product-description').textContent = product.description;
    node.querySelector('.product-price').textContent = money(product.price);

    const detailsButton = node.querySelector('[data-action="details"]');
    const addButton = node.querySelector('[data-action="add"]');

    detailsButton.addEventListener('click', () => openProductModal(product.id));
    addButton.addEventListener('click', () => addToCart(product.id));

    grid.appendChild(node);
  });
}

function openProductModal(productId) {
  const product = getProduct(productId);
  const modal = document.querySelector('[data-product-modal]');
  if (!modal || !product) return;

  state.currentProductId = productId;
  modal.querySelector('[data-modal-category]').textContent = product.category;
  modal.querySelector('[data-modal-title]').textContent = product.name;
  modal.querySelector('[data-modal-description]').textContent = product.description;
  modal.querySelector('[data-modal-price]').textContent = money(product.price);
  modal.querySelector('[data-modal-visual]').style.background = `radial-gradient(circle at 25% 20%, rgba(255,255,255,0.18), transparent 22%), linear-gradient(145deg, rgba(255,59,48,0.28), rgba(12, 20, 34, 0.88))`;

  const list = modal.querySelector('[data-modal-features]');
  list.innerHTML = product.features.map((feature) => `<li>${feature}</li>`).join('');

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  openOverlay();
}

function initHome() {
  const grid = document.querySelector('[data-products-grid]');
  if (!grid) return;

  updateUserUI();
  renderProducts();
  renderCart();
  updateCartCount();

  document.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      state.activeFilter = button.dataset.filter;
      renderProducts();
    });
  });

  const search = document.querySelector('[data-search]');
  if (search) {
    search.addEventListener('input', () => {
      state.search = search.value;
      renderProducts();
    });
  }

  document.querySelector('[data-open-cart]')?.addEventListener('click', openCart);
  document.querySelector('[data-close-cart]')?.addEventListener('click', closeOverlay);
  document.querySelector('[data-close-modal]')?.addEventListener('click', closeOverlay);
  document.querySelector('[data-overlay]')?.addEventListener('click', closeOverlay);

  document.querySelector('[data-checkout]')?.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) return;
    clearCart();
    alert('Wirtualne zamówienie zostało przyjęte. To była tylko symulacja.');
    closeOverlay();
  });

  document.querySelector('[data-modal-add]')?.addEventListener('click', () => {
    if (state.currentProductId) addToCart(state.currentProductId);
  });

  document.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-cart-action]');
    if (!actionButton) return;
    const id = Number(actionButton.dataset.id);
    const action = actionButton.dataset.cartAction;
    changeCartQty(id, action === 'plus' ? 1 : -1);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeOverlay();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

document.addEventListener('DOMContentLoaded', () => {
  updateUserUI();
  initHome();
});
