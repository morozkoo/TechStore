import { getProducts } from './api/apiService.js';
import { initCart, syncCartOnline } from './components/cart.js';
import { initSlider } from './components/slider.js';
import { products as localTechProducts } from './data/products.js';

let products = [];

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 TechStore запущен');

  products = await getProducts();

  if (!products.length) {
    console.warn('Не удалось загрузить товары из выбранного API, fallback на локальные данные');
    products = localTechProducts.map((p) => ({
      id: p.id,
      title: p.title,
      price: Number(p.price),
      image: p.image,
    }));
  }

  window.products = products;

  renderProducts(products);

  initFilters();
  initSlider();
  initCart();
  syncCartOnline();

});

function renderProducts(items) {
  const grid = document.querySelector('.products__grid');
  if (!grid) return;

  grid.innerHTML = '';

  items.forEach((product) => {
    grid.insertAdjacentHTML(
      'beforeend',
      `
            <article class="product-card" data-id="${product.id}">
                
                <img 
                    src="${product.image}" 
                    class="product-card__img"
                    alt="${product.title}"
                >

                <h3 class="product-card__title">
                    ${product.title}
                </h3>

                <p class="product-card__price">
                    ${Number(product.price).toFixed(2)} $
                </p>

                <button 
                    class="product-card__button add-to-cart"
                    data-id="${product.id}"
                >
                    Добавить в корзину
                </button>

            </article>
        `,
    );
  });
}

function initFilters() {
  const minPrice = document.getElementById('minPrice');
  const maxPrice = document.getElementById('maxPrice');
  const filterBtn = document.getElementById('filterBtn');

  if (!filterBtn) return;

  filterBtn.addEventListener('click', () => {
    const min = Number(minPrice.value) || 0;
    const max = Number(maxPrice.value) || 10000;

    const filtered = products.filter((p) => p.price >= min && p.price <= max);

    renderProducts(filtered);
  });
}

