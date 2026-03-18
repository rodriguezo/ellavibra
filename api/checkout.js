const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { price_id, event_name, email, name } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: price_id, quantity: 1 }],
      mode: 'payment',
      customer_email: email,
      metadata: { event_name, name },
      success_url: `https://ellavibra.com?rsvp=success&event=${encodeURIComponent(event_name)}`,
      cancel_url: `https://ellavibra.com?rsvp=cancelled`,
    });
    res.status(200).json({ url: session.url });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
