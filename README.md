# STRIDE — Demo Static Storefront

Overview
- STRIDE is a small client-side demo storefront built with plain HTML, CSS and JavaScript.
- It runs entirely in the browser (no server). State (user and cart) is stored in `localStorage` for demo persistence.

Pages & purpose
- `mian.html` — Main storefront (home): product catalogue, filters, search, product details modal, cart drawer, and virtual checkout.
- `login.html` — Login demo: collects `name`, `email`, and `password` and saves a local demo session to `localStorage`.
- `regulamin.html` — Terms / policy page (static informational content).
- `mian.html` and `login.html` are integrated: the topbar reads stored user data and updates labels across pages.

Key features
- Product data: defined in `app.js` as a `PRODUCTS` array with id, name, category, price, description and features.
- Dynamic UI: `app.js` renders product cards from a `<template>`, handles filtering, search, opening product modal, and adding items to the cart.
- Cart: virtual cart stored under `stride-cart` in `localStorage`; supports quantity changes, removal and a simulated checkout that clears the cart.
- Authentication demo: `auth.js` manages the demo login flow and stores the user under `stride-user` in `localStorage`.
- Accessibility & UX: semantic HTML, aria attributes for overlays/modals, visible state classes and keyboard handling (Escape closes overlays).

How to run
- Open `mian.html` or `login.html` in a modern browser. No build or server is required.
- To reset demo state open browser DevTools → Application → Local Storage and remove `stride-cart` and `stride-user` keys.

Developer notes
- Edit products: update the `PRODUCTS` array in `app.js`.
- UI hooks: many elements use `data-*` attributes (e.g., `data-products-grid`, `data-cart-items`, `data-product-modal`, `data-login-form`).
- The code is intentionally simple and client-side only — not suited for production authentication or payments.

Files
- `mian.html`, `login.html`, `regulamin.html` — markup
- `app.js` — products, rendering, cart and main UI logic
- `auth.js` — demo login logic
- `main.css` — styles
