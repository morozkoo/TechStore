// js/script.js
import { products } from './data/products.js';
import { initCart } from './components/cart.js';
import { initSlider } from './components/slider.js';

window.products = products;

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✅ TechStore JS успешно загружен!', 'color:#00ff88; font-size:18px; font-weight:bold');

    renderOriginalProducts(products);
    initSlider();
    initFilters();
    initCart();
});

function renderOriginalProducts(items) {
    const grid = document.querySelector('.products__grid');
    if (!grid) return;

    grid.innerHTML = '';

    const originalImages = [
        "images/74380b1e64385a8ac9966cd830a80e74a5d57240.png",
        "images/027d72b106e4c673ce2414fa93556f09b2ab5da8.png",
        "images/46b89f1998ba6d8d6ff394cff3a0167ae1534938.png",
        "images/6da65bb1960efba652fbb0cb51ece319d68abd1e.png"
    ];

    items.forEach((product, index) => {
        const imgSrc = originalImages[index % originalImages.length];

        const cardHTML = `
            <article class="product-card" data-id="${product.id}">
                <header class="product-card__header">
                    <h3 class="product-card__title">${product.title}</h3>
                </header>
                <figure class="product-card__figure">
                    <img src="${imgSrc}" alt="${product.title}" class="product-card__image">
                    ${product.discount > 0 ? `<span class="product-card__discount">-${product.discount}%</span>` : ''}
                    <figcaption class="product-card__figcaption">${product.title}</figcaption>
                </figure>
                <div class="product-card__content">
                    <div class="product-card__description">
                        <p>Флагманский товар с отличными характеристиками</p>
                    </div>
                    <div class="product-card__offers">
                        <div class="product-card__price-block">
                            <span class="product-card__price-label">Цена:</span>
                            <span class="product-card__price">${product.price}</span>
                            <span class="product-card__currency">BYN</span>
                            ${product.oldPrice ? `<span class="product-card__old-price">${product.oldPrice} BYN</span>` : ''}
                        </div>
                        <div class="product-card__availability">
                            <span>Наличие: </span>
                            <span>${product.inStock ? 'В наличии' : 'Нет в наличии'}</span>
                        </div>
                    </div>
                    <button class="product-card__button add-to-cart" data-id="${product.id}">
                        В корзину
                    </button>
                </div>
            </article>
        `;
        grid.innerHTML += cardHTML;
    });
}

// ==================== ФИЛЬТРЫ — как было + цена от и до ====================
function initFilters() {
    const productsHeader = document.querySelector('.products__header');
    if (!productsHeader) return;

    const filterHTML = `
        <div style="margin: 25px 0; padding: 20px; background: #0f1115; border-radius: 12px; text-align: center;"> 
            
            <select id="category-filter" style="padding: 10px 16px; font-size: 16px; border-radius: 8px; margin-bottom: 15px;">
                <option value="">Все категории</option>
                <option value="smartphone">Смартфоны</option>
                <option value="laptop">Ноутбуки</option>
                <option value="headphones">Наушники</option>
            </select>

            <div style="margin-bottom: 10px;">
                <span id="price-range-text" style="font-weight: 600; font-size: 16.5px;">
                    Цена: от 0 до 6000 BYN
                </span>
            </div>

            <input type="range" id="price-filter" 
                   min="0" max="6000" value="6000" step="100"
                   style="width: 70%; accent-color: #09ccc7;">

            <button id="reset-filters" 
                    style="margin-top: 15px; padding: 10px 20px; background: #f87171; color: white; 
                           border: none; border-radius: 8px; cursor: pointer;">
                Сбросить фильтры
            </button>
        </div>
    `;

    productsHeader.insertAdjacentHTML('afterend', filterHTML);

    const categorySelect = document.getElementById('category-filter');
    const priceSlider   = document.getElementById('price-filter');
    const priceText     = document.getElementById('price-range-text');
    const resetBtn      = document.getElementById('reset-filters');

    function applyFilters() {
        const category = categorySelect.value;
        const maxPrice = parseInt(priceSlider.value);

        // Обновляем текст над ползунком
        priceText.textContent = `Цена: от 0 до ${maxPrice} BYN`;

        const filtered = products.filter(product => {
            const matchCategory = !category || product.category === category;
            const matchPrice = product.price <= maxPrice;
            return matchCategory && matchPrice;
        });

        renderOriginalProducts(filtered);
    }

    priceSlider.addEventListener('input', applyFilters);
    categorySelect.addEventListener('change', applyFilters);

    resetBtn.addEventListener('click', () => {
        categorySelect.value = '';
        priceSlider.value = 6000;
        priceText.textContent = 'Цена: от 0 до 6000 BYN';
        renderOriginalProducts(products);
    });

    console.log('🔍 Фильтры добавлены (с ценой от и до)');
}
