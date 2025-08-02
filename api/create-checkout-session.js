// api/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe Checkout セッション作成API
 * フロントエンドから courseId を受け取り、Stripe CheckoutのURLを返します
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'Missing courseId' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Musashi Admission Fee',
            },
            unit_amount: 5000, // 金額（セント単位）。$50.00なら5000
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/course/${courseId}?status=success`,
      cancel_url: `${req.headers.origin}/course/${courseId}?status=cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
};
