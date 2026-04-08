import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Missing STRIPE_SECRET_KEY in .env');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ ok: true, service: 'stripe-backend' });
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const amount = Number(req.body?.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Stripe error',
    });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, origin } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const safeOrigin = typeof origin === 'string' && origin.startsWith('http')
      ? origin
      : 'http://localhost:5500';

    const lineItems = items.map((item) => {
      const quantity = Number(item.quantity) || 1;
      const unitAmount = Math.max(1, Math.round(Number(item.price) * 100));
      const name = item.title || 'TechStore item';

      return {
        quantity,
        price_data: {
          currency: 'usd',
          product_data: { name },
          unit_amount: unitAmount,
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${safeOrigin}/index.html?payment=success`,
      cancel_url: `${safeOrigin}/index.html?payment=cancel`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      error: error?.message || 'Stripe checkout error',
    });
  }
});

app.listen(port, () => {
  console.log(`Stripe backend running on http://localhost:${port}`);
});
