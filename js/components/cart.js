import { saveToStorage, getFromStorage } from '../utils/storage.js';
import { syncCartToFakeStore } from '../api/apiService.js';
import { createCheckoutSession } from '../api/stripeService.js';

let cart = getFromStorage('cart') || [];
const CART_SYNC_PENDING_KEY = 'cartSyncPending';

export function initCart() {
  handlePaymentResult();
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.header__icon-wrapper:nth-child(2)')) {
      showCartModal();
    }
  });

  updateCartCount();
  console.log('🛒 Корзина инициализирована');
}

function addToCart(id) {
  const normalizedId = String(id);
  const product = (window.products || []).find((p) => String(p.id) === normalizedId);
  if (!product) return;

  const existing = cart.find((item) => String(item.id) === normalizedId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveToStorage('cart', cart);
  markCartForSync();
  updateCartCount();
  showNotification(`✅ ${product.title} добавлен в корзину`);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartWrapper = document.querySelector(
    '.header__icon-wrapper:nth-child(2)',
  );
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
function showCartModal() {
  let modal = document.getElementById('cart-modal');
  if (modal) modal.remove();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const modalHTML = `
        <div id="cart-modal" style="position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:20000; 
                                  display:flex; align-items:center; justify-content:center;">
            <div style="background:#111827; color:#f3f4f6; width:92%; max-width:620px; border-radius:16px; padding:25px; max-height:88vh; overflow-y:auto; border:1px solid #374151;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h2 style="margin:0;">Корзина (${cart.reduce((sum, item) => sum + item.quantity, 0)} товаров)</h2>
                    <button id="close-modal" style="background:none; border:none; font-size:28px; cursor:pointer; color:#f3f4f6;">×</button>
                </div>

                ${
                  cart.length === 0
                    ? `<p style="text-align:center; padding:40px 0; color:#9ca3af;">Корзина пуста</p>`
                    : ''
                }

                ${cart
                  .map(
                    (item, index) => `
                    <div style="display:flex; gap:15px; padding:15px; background:#1f2937; border:1px solid #374151; border-radius:10px; margin-bottom:12px;">
                        <img src="${item.image}" style="width:90px; height:90px; object-fit:cover; border-radius:8px;">
                        <div style="flex:1;">
                            <h4 style="margin:0 0 6px;">${item.title}</h4>
                            <p style="margin:0; color:#60a5fa; font-weight:600;">${item.price} BYN × ${item.quantity}</p>
                        </div>
                        <div style="text-align:right;">
                            <p style="margin:0 0 8px; font-weight:700;">${item.price * item.quantity} BYN</p>
                            <button data-index="${index}" class="remove-item" 
                                    style="background:#dc2626; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer;">
                                Удалить
                            </button>
                        </div>
                    </div>
                `,
                  )
                  .join('')}

                ${
                  cart.length > 0
                    ? `
                    <div style="margin:25px 0; padding:15px; background:#1f2937; border:1px solid #374151; border-radius:10px; font-size:1.4rem; font-weight:700; text-align:right;">
                        Итого: ${total} BYN
                    </div>
                    
                    <button id="checkout-btn" style="width:100%; padding:16px; background:#2563eb; color:white; 
                            border:none; border-radius:10px; font-size:1.1rem; cursor:pointer;">
                        Оформить заказ (Stripe)
                    </button>
                `
                    : ''
                }

                <button id="close-modal-bottom" style="width:100%; margin-top:15px; padding:14px; background:#374151; color:white; 
                        border:none; border-radius:10px; cursor:pointer;">
                    Закрыть
                </button>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const closeModal = () => document.getElementById('cart-modal').remove();
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document
    .getElementById('close-modal-bottom')
    .addEventListener('click', closeModal);
  document.querySelectorAll('.remove-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      cart.splice(index, 1);
      saveToStorage('cart', cart);
      markCartForSync();
      updateCartCount();
      showCartModal();
    });
  });
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (!cart.length) {
        alert('Корзина пуста');
        return;
      }

      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Переходим к оплате...';

      try {
        const data = await createCheckoutSession(cart);
        if (!data?.url) {
          throw new Error('Stripe checkout url missing');
        }

        window.location.href = data.url;
      } catch (error) {
        console.error(error);
        alert('Ошибка оплаты. Проверь, запущен ли backend Stripe на localhost:3000');
      } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Оформить заказ (Stripe)';
      }
    });
  }
}

function handlePaymentResult() {
  const url = new URL(window.location.href);
  const paymentStatus = url.searchParams.get('payment');
  if (!paymentStatus) return;

  if (paymentStatus === 'success') {
    cart = [];
    saveToStorage('cart', cart);
    clearPendingSync();
    updateCartCount();
    alert('Оплата прошла успешно');
  } else if (paymentStatus === 'cancel') {
    alert('Оплата отменена');
  }

  url.searchParams.delete('payment');
  window.history.replaceState({}, '', url.toString());
}

function markCartForSync() {
  saveToStorage(CART_SYNC_PENDING_KEY, true);
  if (navigator.onLine) {
    void syncCartNow();
  }
}

function clearPendingSync() {
  saveToStorage(CART_SYNC_PENDING_KEY, false);
}

async function syncCartNow() {
  const isPending = getFromStorage(CART_SYNC_PENDING_KEY);
  if (!isPending) return;

  const currentCart = getFromStorage('cart') || [];
  if (!currentCart.length) {
    clearPendingSync();
    return;
  }

  try {
    await syncCartToFakeStore(currentCart);
    clearPendingSync();
    console.log('✅ Корзина синхронизирована с FakeStore');
  } catch (error) {
    console.log('❌ Ошибка синхронизации корзины', error);
  }
}

export function syncCartOnline() {
  window.addEventListener('online', async () => {
    console.log('🌐 Интернет восстановлен, синхронизация корзины');
    await syncCartNow();
  });

  if (navigator.onLine) {
    void syncCartNow();
  }
}
