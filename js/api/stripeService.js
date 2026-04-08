export async function createPaymentIntent(amount) {
  try {
    const response = await fetch('http://localhost:3000/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error(`Stripe backend error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe API error:', error);
    throw error;
  }
}

export async function createCheckoutSession(items) {
  try {
    const response = await fetch('http://localhost:3000/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        origin: window.location.origin,
      }),
    });

    if (!response.ok) {
      throw new Error(`Stripe checkout error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe checkout API error:', error);
    throw error;
  }
}
