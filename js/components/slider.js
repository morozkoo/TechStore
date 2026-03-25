// js/components/slider.js
import { products } from '../data/products.js';

export function initSlider() {
    if (document.getElementById('promo-slider')) return;

    const productsSection = document.querySelector('.products');
    if (!productsSection) return;

    const promoProducts = products.filter(p => p.discount > 0);
    if (promoProducts.length === 0) return;

    const promoImages = [
        "images/74380b1e64385a8ac9966cd830a80e74a5d57240.png",
        "images/027d72b106e4c673ce2414fa93556f09b2ab5da8.png",
        "images/46b89f1998ba6d8d6ff394cff3a0167ae1534938.png",
        "images/6da65bb1960efba652fbb0cb51ece319d68abd1e.png"
    ];

    const sliderHTML = `
        <section id="promo-slider" style="margin: 50px 0 40px; padding: 40px 0; background: #0f1115;">
            <div class="container">
                <h2 style="text-align: center; font-size: 2.3rem; margin-bottom: 35px; color: #f5f5f5; font-weight: 600;">
                    Акционные товары
                </h2>

                <div style="position: relative; overflow: hidden; padding: 0 50px;">
                    <button id="promo-prev" style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); background: rgba(26,26,26,0.85); color: white; border: none; width: 48px; height: 48px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 20;">←</button>
                    
                    <div id="promo-track" style="display: flex; gap: 24px; transition: transform 0.5s ease-in-out;">
                        ${promoProducts.map((product, index) => {
                            const imgSrc = promoImages[index % promoImages.length];
                            return `
                                <div style="min-width: 285px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 16px rgba(0,0,0,0.08);">
                                    <div style="height: 200px; overflow: hidden;">
                                        <img src="${imgSrc}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;">
                                    </div>
                                    <div style="padding: 18px 16px 20px;">
                                        <h3 style="margin: 0 0 12px; font-size: 1.15rem; line-height: 1.3;">${product.title}</h3>
                                        <div style="margin-bottom: 16px;">
                                            <span style="font-size: 1.5rem; font-weight: 700; color: #e63939;">${product.price} BYN</span>
                                            ${product.oldPrice ? `<span style="margin-left: 10px; font-size: 1.1rem; text-decoration: line-through; color: #0f1115;">${product.oldPrice} BYN</span>` : ''}
                                        </div>
                                        <button class="add-to-cart" data-id="${product.id}" style="width: 100%; padding: 14px; background: #09ccc7; color: white; border: none; border-radius: 8px; font-size: 1.05rem; font-weight: 500; cursor: pointer;">
                                            В корзину
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <button id="promo-next" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); background: rgba(26,26,26,0.85); color: white; border: none; width: 48px; height: 48px; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 20;">→</button>
                </div>
            </div>
        </section>
    `;

    productsSection.insertAdjacentHTML('beforebegin', sliderHTML);

    const track = document.getElementById('promo-track');
    let scrollPos = 0;
    const step = 310;

    document.getElementById('promo-prev').addEventListener('click', () => {
        scrollPos = Math.max(scrollPos - step, 0);
        track.style.transform = `translateX(-${scrollPos}px)`;
    });

    document.getElementById('promo-next').addEventListener('click', () => {
        const maxScroll = track.scrollWidth - track.clientWidth;
        scrollPos = Math.min(scrollPos + step, maxScroll);
        track.style.transform = `translateX(-${scrollPos}px)`;
    });

    console.log(`🎠 Слайдер акционных товаров обновлён (${promoProducts.length} товаров)`);
}