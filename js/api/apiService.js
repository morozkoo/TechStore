const BASE_URL = 'https://fakestoreapi.com';

export async function getProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products/category/electronics`);
    if (!response.ok) {
      throw new Error(`FakeStore products error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('FakeStore API error:', error);
    return [];
  }
}

export async function syncCartToFakeStore(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return { ok: true, skipped: true };
  }

  const payload = {
    userId: 1,
    date: new Date().toISOString(),
    products: cartItems.map((item) => ({
      productId: Number(item.id),
      quantity: Number(item.quantity) || 1,
    })),
  };

  const response = await fetch(`${BASE_URL}/carts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`FakeStore cart sync error: ${response.status}`);
  }

  return response.json();
}
