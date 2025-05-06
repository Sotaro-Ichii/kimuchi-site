// api/create-checkout-session.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { courseId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Access to course: ${courseId}`,
          },
          unit_amount: 200, // $2.00（100 = $1.00）
        },
        quantity: 1,
      }],
      success_url: `${req.headers.origin}/course/${courseId}?status=success`,
      cancel_url: `${req.headers.origin}/course/${courseId}?status=cancel`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
