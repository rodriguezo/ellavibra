const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {Resend} = require('resend');

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return res.status(400).json({ error: `Webhook error: ${e.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const name = session.metadata?.name || 'Participante';
    const email = session.customer_email;
    const event_name = session.metadata?.event_name || 'el evento';

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Ella Vibra <hola@ellavibra.com>',
      to: email,
      subject: `¡Pago confirmado! – ${event_name}`,
      html: `<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1e1a2e">
        <h1 style="font-size:32px;font-weight:300;margin-bottom:4px">Ella <em style="color:#7f77dd">Vibra</em></h1>
        <p style="font-size:15px;font-style:italic;color:#7a6e8a;margin-bottom:32px">Sanar. Crecer. Florecer juntas.</p>
        <p style="font-size:15px;line-height:1.7">Hola <strong>${name}</strong>,</p>
        <p style="font-size:15px;line-height:1.7;margin-top:16px">¡Tu pago fue confirmado! Tu lugar para <strong>${event_name}</strong> está reservado.</p>
        <p style="font-size:15px;line-height:1.7;margin-top:16px">Pronto recibirás los detalles de acceso. Si tienes alguna pregunta escríbenos a <a href="mailto:hola@ellavibra.com" style="color:#7f77dd">hola@ellavibra.com</a>.</p>
        <p style="font-size:15px;line-height:1.7;margin-top:24px">Con amor,<br><strong>Camila & el equipo de Ella Vibra</strong></p>
        <hr style="border:none;border-top:0.5px solid #e8e4f8;margin:32px 0">
        <a href="https://ellavibra.com" style="font-size:13px;color:#7f77dd;text-decoration:none">ellavibra.com</a>
      </div>`
    });
  }

  res.status(200).json({ received: true });
}
