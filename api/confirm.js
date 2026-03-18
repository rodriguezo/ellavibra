const {Resend} = require('resend');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { type, name, email, event_name } = req.body;

  let subject, html;

  if (type === 'waitlist') {
    subject = '¡Ya estás en la lista! · Ella Vibra';
    html = `<div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:40px 24px;color:#1e1a2e">
      <h1 style="font-size:32px;font-weight:300;margin-bottom:8px">Ella <em style="color:#7f77dd">Vibra</em></h1>
      <p style="font-size:18px;font-weight:300;color:#7a6e8a;margin-bottom:32px;font-style:italic">Sanar. Crecer. Florecer juntas.</p>
      <p style="font-size:15px;line-height:1.7">Hola <strong>${name}</strong>,</p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">¡Gracias por unirte a la lista de Ella Vibra! Serás de las primeras en enterarte cuando abramos las puertas, con acceso anticipado a eventos, recursos y nuestra comunidad.</p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">Con amor,<br><strong>Camila & el equipo de Ella Vibra</strong></p>
      <hr style="border:none;border-top:0.5px solid #e8e4f8;margin:32px 0">
      <p style="font-size:12px;color:#b8afc8">ellavibra.com</p>
    </div>`;
  } else if (type === 'rsvp') {
    subject = `¡Reservado! ${event_name} · Ella Vibra`;
    html = `<div style="font-family:Georgia,serif;max-width:500px;margin:0 auto;padding:40px 24px;color:#1e1a2e">
      <h1 style="font-size:32px;font-weight:300;margin-bottom:8px">Ella <em style="color:#7f77dd">Vibra</em></h1>
      <p style="font-size:18px;font-weight:300;color:#7a6e8a;margin-bottom:32px;font-style:italic">Sanar. Crecer. Florecer juntas.</p>
      <p style="font-size:15px;line-height:1.7">Hola <strong>${name}</strong>,</p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">¡Tu lugar está reservado para <strong>${event_name}</strong>! Te enviaremos los detalles de acceso próximamente.</p>
      <p style="font-size:15px;line-height:1.7;margin-top:16px">Con amor,<br><strong>Camila & el equipo de Ella Vibra</strong></p>
      <hr style="border:none;border-top:0.5px solid #e8e4f8;margin:32px 0">
      <p style="font-size:12px;color:#b8afc8">ellavibra.com</p>
    </div>`;
  }

  try {
    await resend.emails.send({
      from: 'Ella Vibra <hola@ellavibra.com>',
      to: email,
      subject,
      html
    });
    res.status(200).json({ok: true});
  } catch(e) {
    res.status(500).json({error: e.message});
  }
}
