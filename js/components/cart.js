// js/components/cart.js
import { saveToStorage, getFromStorage } from '../utils/storage.js';

let cart = getFromStorage('cart') || [];

export function initCart() {
    // Добавление товара
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        }
    });

    // Открытие корзины по клику на иконку в шапке
    document.addEventListener('click', (e) => {
        if (e.target.closest('.header__icon-wrapper:nth-child(2)')) {
            showCartModal();
        }
    });

    updateCartCount();
    console.log('🛒 Корзина инициализирована');
}

function addToCart(id) {
    const product = window.products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveToStorage('cart', cart);
    updateCartCount();
    showNotification(`✅ ${product.title} добавлен в корзину`);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartWrapper = document.querySelector('.header__icon-wrapper:nth-child(2)');
    if (!cartWrapper) return;

    let badge = cartWrapper.querySelector('.cart-count');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-count';
        badge.style.cssText = `position:absolute; top:-6px; right:-6px; background:#ff3b5c; color:white; 
                               font-size:12px; width:20px; height:20px; border-radius:50%; display:flex; 
                               align-items:center; justify-content:center; font-weight:600;`;
        cartWrapper.style.position = 'relative';
        cartWrapper.appendChild(badge);
    }
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = `position:fixed; top:25px; right:25px; background:#00c853; color:white; 
                           padding:16px 24px; border-radius:10px; box-shadow:0 8px 25px rgba(0,0,0,0.25); 
                           z-index:10000; font-family:Manrope,sans-serif; font-size:15px;`;
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.remove(), 400);
    }, 2300);
}

// ==================== МОДАЛЬНОЕ ОКНО КОРЗИНЫ ====================
function showCartModal() {
    let modal = document.getElementById('cart-modal');
    if (modal) modal.remove();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const modalHTML = `
        <div id="cart-modal" style="position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:20000; 
                                  display:flex; align-items:center; justify-content:center;">
            <div style="background:white; width:92%; max-width:620px; border-radius:16px; padding:25px; max-height:88vh; overflow-y:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h2 style="margin:0;">Корзина (${cart.reduce((sum, item) => sum + item.quantity, 0)} товаров)</h2>
                    <button id="close-modal" style="background:none; border:none; font-size:28px; cursor:pointer;">×</button>
                </div>

                ${cart.length === 0 ? 
                    `<p style="text-align:center; padding:40px 0; color:#666;">Корзина пуста</p>` : ''}

                ${cart.map((item, index) => `
                    <div style="display:flex; gap:15px; padding:15px; background:#f9f9f9; border-radius:10px; margin-bottom:12px;">
                        <img src="${item.image}" style="width:90px; height:90px; object-fit:cover; border-radius:8px;">
                        <div style="flex:1;">
                            <h4 style="margin:0 0 6px;">${item.title}</h4>
                            <p style="margin:0; color:#0066ff; font-weight:600;">${item.price} BYN × ${item.quantity}</p>
                        </div>
                        <div style="text-align:right;">
                            <p style="margin:0 0 8px; font-weight:700;">${item.price * item.quantity} BYN</p>
                            <button data-index="${index}" class="remove-item" 
                                    style="background:#ff3b5c; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">
                                Удалить
                            </button>
                        </div>
                    </div>
                `).join('')}

                ${cart.length > 0 ? `
                    <div style="margin:25px 0; padding:15px; background:#f0f0f0; border-radius:10px; font-size:1.4rem; font-weight:700; text-align:right;">
                        Итого: ${total} BYN
                    </div>
                    
                    <button id="checkout-btn" style="width:100%; padding:16px; background:#00c853; color:white; 
                            border:none; border-radius:10px; font-size:1.1rem; cursor:pointer;">
                        Оформить заказ
                    </button>
                ` : ''}

                <button id="close-modal-bottom" style="width:100%; margin-top:15px; padding:14px; background:#666; color:white; 
                        border:none; border-radius:10px; cursor:pointer;">
                    Закрыть
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Закрытие модального окна
    const closeModal = () => document.getElementById('cart-modal').remove();
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('close-modal-bottom').addEventListener('click', closeModal);

    // Удаление товара
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            cart.splice(index, 1);
            saveToStorage('cart', cart);
            updateCartCount();
            showCartModal(); // обновляем окно
        });
    });

    // Кнопка "Оформить заказ" (заглушка)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('🎉 Заказ оформлен! (Это заглушка для лабораторной)');
            cart = [];
            saveToStorage('cart', cart);
            updateCartCount();
            closeModal();
        });
    }
}